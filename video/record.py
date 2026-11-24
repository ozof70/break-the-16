"""Record a scripted mobile walkthrough of the site via CDP screencast.
Usage: python record.py <site_dir> <out_dir>
"""
import base64, json, os, subprocess, sys, time, threading
from playwright.sync_api import sync_playwright

SITE, OUT = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(OUT, "f"), exist_ok=True)
PORT = 5193
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "-d", SITE],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
BASE = f"http://127.0.0.1:{PORT}/"

INIT = r"""
try { localStorage.setItem('lang','en'); } catch(e) {}
(function(){ let s = 7; Math.random = function(){ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; })();
document.addEventListener('DOMContentLoaded', () => {
  const st = document.createElement('style');
  st.textContent = `.tapdot{position:fixed;z-index:99999;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;
    background:rgba(17,17,17,.18);border:2px solid rgba(17,17,17,.55);pointer-events:none;animation:tapdot .55s ease-out forwards}
    @keyframes tapdot{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.5);opacity:0}}
    ::-webkit-scrollbar{display:none} *{-webkit-tap-highlight-color:transparent!important}`;
  document.head.appendChild(st);
  addEventListener('pointerdown', e => { const d = document.createElement('div'); d.className='tapdot';
    d.style.left=e.clientX+'px'; d.style.top=e.clientY+'px'; document.body.appendChild(d); setTimeout(()=>d.remove(),600); }, true);
});
"""

frames, marks = [], []
T0 = None

def mark(name):
    marks.append((name, time.time()))
    print("mark", name, flush=True)

with sync_playwright() as p:
    br = p.chromium.launch(channel="chrome", headless=True, args=["--force-device-scale-factor=2"])
    ctx = br.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2,
                         is_mobile=True, has_touch=True, locale="en-US",
                         user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
    ctx.add_init_script(INIT)
    ctx.route("**/api/track", lambda r: r.fulfill(status=200, content_type="application/json", body='{"ok":true}'))
    page = ctx.new_page()
    cdp = ctx.new_cdp_session(page)

    def on_frame(ev):
        ts = ev["metadata"]["timestamp"]
        fn = os.path.join(OUT, "f", f"{len(frames):05d}.jpg")
        with open(fn, "wb") as fh:
            fh.write(base64.b64decode(ev["data"]))
        frames.append((ts, fn))
        try: cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
        except Exception: pass
    cdp.on("Page.screencastFrame", on_frame)

    def wait(s):
        end = time.time() + s
        while time.time() < end:
            page.wait_for_timeout(50)

    def smooth(y=None, sel=None, block="start"):
        if sel:
            page.evaluate(f"document.querySelector('{sel}').scrollIntoView({{behavior:'smooth',block:'{block}'}})")
        else:
            page.evaluate(f"window.scrollTo({{top:{y},behavior:'smooth'}})")

    page.goto(BASE + "index.html", wait_until="networkidle")
    page.wait_for_timeout(300)
    cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 92, "everyNthFrame": 1, "maxWidth": 780, "maxHeight": 1688})
    mark("hero"); wait(1.8); smooth(330); wait(2.2); smooth(0); wait(0.8)

    mark("cta"); page.locator(".hero-cta .btn-ink").tap(); wait(1.6)
    mark("duo"); page.locator('.seg-btn[data-mode="duo"]').tap(); wait(1.2)
    mark("spin"); page.locator("#spinBtn").tap(); wait(5.6)
    mark("coupon"); wait(1.4)
    mark("redeem"); page.locator("#redeemBtn").tap(); wait(1.8)

    mark("menu"); smooth(0); wait(0.6)
    page.locator("#burger").tap(); wait(0.9)
    page.locator('#links a[href="bell.html"]').tap()
    page.wait_for_load_state("networkidle"); mark("bell"); wait(1.2)
    smooth(sel="#bellForm", block="start"); wait(0.8)
    mark("form")
    page.locator("#bNick").tap(); page.locator("#bNick").press_sequentially("Alex", delay=70)
    page.locator("#bContact").tap(); page.locator("#bContact").press_sequentially("alex.nccu", delay=55)
    page.locator("#bDate").fill("2026-07-18"); wait(0.3)
    page.locator('.chips[data-name=time] .chip[data-v="dinner"]').tap(); wait(0.4)
    smooth(sel=".chips[data-name=pref]", block="center"); wait(0.6)
    page.locator('.chips[data-name=pref] .chip[data-v="intl"]').tap(); wait(0.3)
    page.locator('.step[data-d="1"]').tap(); wait(0.4)
    smooth(sel="#ringBtn", block="center"); wait(0.6)
    page.locator("#bConsent").tap(); wait(0.4)
    mark("ring"); page.locator("#ringBtn").tap(); wait(1.4)
    mark("matched"); wait(2.6)

    page.goto(BASE + "shops.html", wait_until="networkidle"); mark("shops"); wait(1.2)
    smooth(sel="#filter", block="start"); wait(0.8)
    page.locator('#filter .chip[data-f="異國"]').tap(); wait(0.9)
    page.locator('#filter .chip[data-f="all"]').tap(); wait(0.7)
    mark("modal"); page.locator("#shopGrid .shop").first.tap(); wait(2.4)
    mark("end"); wait(0.5)
    cdp.send("Page.stopScreencast")
    br.close()

srv.terminate()
json.dump({"frames": frames, "marks": marks}, open(os.path.join(OUT, "rec.json"), "w"))
print(len(frames), "frames")
