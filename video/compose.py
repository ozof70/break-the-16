"""Compose the recorded screencast into a 1920x1080 demo video.
Usage: python compose.py rec out.mp4 [preview_times...]
"""
import bisect, json, math, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import imageio_ffmpeg

REC, OUT = sys.argv[1], sys.argv[2]
PREVIEW = [float(x) for x in sys.argv[3:]]
W, H, FPS = 1920, 1080, 30
INK, YEL, YEL2, MUTED, WHITE = (17, 17, 17), (255, 244, 163), (255, 228, 92), (150, 150, 140), (250, 250, 245)
F = "C:/Windows/Fonts/"
font = lambda n, s: ImageFont.truetype(F + n, s)
f_black, f_bold, f_semi, f_reg = "seguibl.ttf", "segoeuib.ttf", "seguisb.ttf", "segoeui.ttf"

d = json.load(open(f"{REC}/rec.json"))
frames = d["frames"]; fts = [f[0] for f in frames]
M = {n: t for n, t in d["marks"]}

# ---- timeline: (src_from, src_to, out_duration) ; contiguous source ----
INTRO, OUTRO = 1.9, 2.8
segs = [
    (M["hero"], M["cta"], 3.4),
    (M["cta"], M["spin"], 1.9),
    (M["spin"], M["coupon"], 3.5),
    (M["coupon"], M["menu"], 2.6),
    (M["menu"], M["form"], 2.0),
    (M["form"], M["ring"], 3.3),
    (M["ring"], M["shops"], 3.3),
    (M["shops"], M["end"], 3.7),
]
PH0 = INTRO
PH1 = PH0 + sum(s[2] for s in segs)
TOTAL = PH1 + OUTRO
seg_out = []; acc = PH0
for s in segs:
    seg_out.append((acc, acc + s[2])); acc += s[2]

CAPS = [  # (out_start, kicker, title, sub)
    (seg_out[0][0], "HOME", "Bring the food street\nback to life.", "Animated, bilingual, built for mobile."),
    (seg_out[1][0], "COUPON WHEEL", "Spin for a deal.", "Choose your party size and land\na real offer from a local shop."),
    (seg_out[3][0], "REDEEM", "Show it. Redeem it.", "One tap at the counter,\nwith bus directions from the zoo."),
    (seg_out[4][0], "MEAL BELL", "Never eat alone\non holiday.", "Set the time, budget and taste,\nthen ring the bell."),
    (seg_out[6][0], "MATCHED", "Matched by taste.", "Instant confirmation with\nsuggested shops nearby."),
    (seg_out[7][0], "PARTNER SHOPS", "12 local partners.", "Filter by cuisine and see\nevery deal at a glance."),
]

def src_time(t):
    for (a, b, _), (oa, ob) in zip(segs, seg_out):
        if t < ob:
            return a + (b - a) * max(0.0, (t - oa) / (ob - oa))
    return segs[-1][1]

cache = {}
SCR_W, SCR_H = 430, 930
def screen_at(t):
    st = src_time(t)
    i = max(0, bisect.bisect_right(fts, st) - 1)
    if i not in cache:
        if len(cache) > 6: cache.clear()
        cache[i] = Image.open(frames[i][1]).convert("RGB").resize((SCR_W, SCR_H), Image.LANCZOS)
    return cache[i]

ease = lambda x: 1 - (1 - min(1, max(0, x))) ** 3
eio = lambda x: (lambda y: 4 * y * y * y if y < .5 else 1 - (-2 * y + 2) ** 3 / 2)(min(1, max(0, x)))

# ---- static layers ----
def make_bg():
    bg = Image.new("RGB", (W, H), INK)
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((1290 - 380, 540 - 380, 1290 + 380, 540 + 380), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    bg = Image.composite(Image.new("RGB", (W, H), (120, 110, 40)), bg, glow)
    # fine dot grid
    dr = ImageDraw.Draw(bg)
    for x in range(40, W, 48):
        for y in range(40, H, 48):
            dr.point((x, y), fill=(42, 42, 40))
    return bg
BG = make_bg()

BZ = 16  # bezel
SB = 40  # status bar
PW, PHt = SCR_W + BZ * 2, SCR_H + SB + BZ * 2
def make_phone():
    ph = Image.new("RGBA", (PW + 80, PHt + 80), (0, 0, 0, 0))
    sh = Image.new("L", ph.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle((40, 56, 40 + PW, 56 + PHt), 66, fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(26))
    ph.paste((0, 0, 0, 255), (0, 0), sh)
    dr = ImageDraw.Draw(ph)
    dr.rounded_rectangle((40, 40, 40 + PW, 40 + PHt), 64, fill=(10, 10, 10, 255), outline=(78, 78, 74, 255), width=3)
    dr.rounded_rectangle((44, 44, 36 + PW, 36 + PHt), 60, outline=(30, 30, 30, 255), width=4)
    return ph
PHONE = make_phone()
MASK = Image.new("L", (SCR_W, SCR_H + SB), 0)
ImageDraw.Draw(MASK).rounded_rectangle((0, 0, SCR_W - 1, SCR_H + SB - 1), 50, fill=255)
ISLAND = Image.new("RGBA", (120, 34), (0, 0, 0, 0))
ImageDraw.Draw(ISLAND).rounded_rectangle((0, 0, 119, 33), 17, fill=(5, 5, 5, 255))

def text(dr, xy, s, f, fill, spacing=8, alpha=255):
    dr.multiline_text(xy, s, font=f, fill=fill + (alpha,), spacing=spacing)

def logo(dr, x, y, r, alpha):
    dr.ellipse((x, y, x + 2 * r, y + 2 * r), fill=YEL + (alpha,))
    dr.ellipse((x + 2.6 * r, y, x + 4.6 * r, y + 2 * r), fill=YEL2 + (alpha,))

PHONE_X = 1290 - PW // 2 - 40
def render(t):
    im = BG.copy()
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(ov)

    # ---------- intro ----------
    if t < INTRO + 0.4:
        a = ease(t / 0.5) * (1 - ease((t - INTRO + 0.25) / 0.55))
        al = int(255 * a); dy = int(30 * (1 - ease(t / 0.6)))
        logo(dr, 960 - 46, 330 + dy, 20, al)
        fb = font(f_black, 150); s = "Break the 16"
        w = dr.textlength(s, font=fb)
        text(dr, (960 - w / 2, 390 + dy), s, fb, WHITE, alpha=al)
        fs = font(f_semi, 40); s2 = "NCCU Food Street  ×  Holiday Meal Buddies"
        w2 = dr.textlength(s2, font=fs)
        text(dr, (960 - w2 / 2, 600 + dy * 2), s2, fs, YEL, alpha=int(al * ease((t - 0.25) / 0.5)))
        fr = font(f_reg, 26); s3 = "PRODUCT DEMO"
        w3 = dr.textlength(s3, font=fr)
        text(dr, (960 - w3 / 2, 690 + dy * 2), s3, fr, MUTED, alpha=int(al * ease((t - 0.45) / 0.5)))

    # ---------- phone ----------
    if PH0 - 0.5 < t < PH1 + 0.7:
        pin = eio((t - (PH0 - 0.5)) / 0.9); pout = eio((t - PH1) / 0.7)
        y = int(39 + (1 - pin) * 700 + pout * 760) + int(5 * math.sin(t * 1.6))
        ph = PHONE.copy()
        sc = screen_at(max(t, PH0))
        full = Image.new("RGB", (SCR_W, SCR_H + SB), YEL)
        full.paste(sc, (0, SB))
        fd = ImageDraw.Draw(full)
        fd.text((40, 9), "9:41", font=font(f_bold, 18), fill=INK)
        for b in range(4):
            fd.rounded_rectangle((SCR_W - 92 + b * 7, 22 - b * 3, SCR_W - 88 + b * 7, 27), 1, fill=INK)
        fd.rounded_rectangle((SCR_W - 58, 13, SCR_W - 30, 27), 4, outline=INK, width=2)
        fd.rounded_rectangle((SCR_W - 55, 16, SCR_W - 37, 24), 2, fill=INK)
        ph.paste(full, (40 + BZ, 40 + BZ), MASK)
        ph.alpha_composite(ISLAND, (40 + PW // 2 - 60, 40 + BZ + 4))
        im.paste(ph, (PHONE_X, y - 40), ph)

        # captions
        idx = max(i for i, c in enumerate(CAPS) if t >= c[0] or i == 0)
        c0 = CAPS[idx][0]; nxt = CAPS[idx + 1][0] if idx + 1 < len(CAPS) else PH1
        ain = ease((t - max(c0, PH0 - 0.1)) / 0.45); aout = 1 - ease((t - (nxt - 0.22)) / 0.22)
        a = ain * aout
        _, k, ttl, sub = CAPS[idx]
        X = 170; dy = int(26 * (1 - ain))
        dr.rounded_rectangle((X, 330 + dy, X + 8, 360 + dy), 3, fill=YEL + (int(255 * a),))
        text(dr, (X + 26, 326 + dy), f"{idx + 1:02d}   {k}", font(f_bold, 26), YEL, alpha=int(255 * a))
        text(dr, (X, 380 + dy), ttl, font(f_black, 72), WHITE, spacing=4, alpha=int(255 * a))
        nl = ttl.count("\n") + 1
        text(dr, (X, 400 + nl * 90 + dy), sub, font(f_reg, 32), (200, 200, 190), spacing=10, alpha=int(235 * a))
        # step dots + brand
        ga = int(255 * ease((t - PH0 + 0.3) / 0.5) * (1 - ease((t - PH1) / 0.4)))
        logo(dr, X, 150, 9, ga)
        text(dr, (X + 54, 141), "Break the 16", font(f_bold, 28), WHITE, alpha=ga)
        for j in range(len(CAPS)):
            x0 = X + j * 46
            fill = YEL + (ga,) if j == idx else (70, 70, 66, ga)
            dr.rounded_rectangle((x0, 880, x0 + (34 if j == idx else 20), 886), 3, fill=fill)
        prog = (t - PH0) / (PH1 - PH0)
        dr.rectangle((0, H - 4, int(W * min(1, max(0, prog))), H), fill=YEL + (ga,))

    # ---------- outro ----------
    if t > PH1 - 0.1:
        a = ease((t - PH1 - 0.05) / 0.6); al = int(255 * a); dy = int(28 * (1 - a))
        logo(dr, 960 - 46, 300 + dy, 20, al)
        fb = font(f_black, 120); s = "Break the 16"; w = dr.textlength(s, font=fb)
        text(dr, (960 - w / 2, 355 + dy), s, fb, WHITE, alpha=al)
        fs = font(f_semi, 36); s2 = "Spin a coupon.  Ring the bell.  Eat together."
        w2 = dr.textlength(s2, font=fs)
        text(dr, (960 - w2 / 2, 535 + dy), s2, fs, (215, 215, 205), alpha=int(al * ease((t - PH1 - 0.25) / 0.5)))
        a2 = int(255 * ease((t - PH1 - 0.45) / 0.5))
        fu = font(f_bold, 38); url = "dennis-tw.com/management"; wu = dr.textlength(url, font=fu)
        dr.rounded_rectangle((960 - wu / 2 - 36, 640, 960 + wu / 2 + 36, 716), 38, fill=YEL + (a2,))
        text(dr, (960 - wu / 2, 650), url, fu, INK, alpha=a2)
        fr = font(f_reg, 24); s3 = "A student team from National Chengchi University"
        w3 = dr.textlength(s3, font=fr)
        text(dr, (960 - w3 / 2, 770), s3, fr, MUTED, alpha=a2)
        fade = 1 - ease((t - TOTAL + 0.35) / 0.35)
        if fade < 1:
            dr.rectangle((0, 0, W, H), fill=INK + (int(255 * (1 - fade)),))

    im.paste(ov, (0, 0), ov)
    return im

if PREVIEW:
    for tt in PREVIEW:
        render(tt).save(f"prev_{tt:05.2f}.jpg", quality=88)
    print("TOTAL", round(TOTAL, 2)); sys.exit()

ff = imageio_ffmpeg.get_ffmpeg_exe()
p = subprocess.Popen([ff, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                      "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
                     stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
n = int(TOTAL * FPS)
for k in range(n):
    p.stdin.write(np.asarray(render(k / FPS)).tobytes())
p.stdin.close(); p.wait()
print("done", OUT, round(TOTAL, 2), "s", n, "frames")
