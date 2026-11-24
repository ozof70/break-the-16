// POST /api/track — store a meal-bell sign-up or coupon event
import { getStore } from "@netlify/blobs";

const str = (v, n) => String(v ?? "").trim().slice(0, n);
const oneOf = (v, list, d) => (list.includes(v) ? v : d);
const SHOPS = ["waffle", "juicy", "libai", "minzhong", "jinghua", "apo", "shousiyi", "hulu", "bangkok", "arirang", "mcd", "8way"];
const MODES = ["solo", "duo", "group"];

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let d;
  try { d = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  if (!d || typeof d !== "object") return new Response("Bad body", { status: 400 });

  const ts = Date.now();
  let rec;
  if (d.type === "bell") {
    const nick = str(d.nick, 30), contact = str(d.contact, 80);
    if (!nick || !contact || !/^\d{4}-\d{2}-\d{2}$/.test(d.date || "")) return new Response("Missing fields", { status: 400 });
    const pref = (Array.isArray(d.pref) ? d.pref : []).filter((p) => ["any", "chinese", "western", "intl", "veg"].includes(p)).slice(0, 5);
    rec = {
      type: "bell", ts, nick, contact, date: d.date,
      who: oneOf(d.who, ["student", "intl", "local", "other"], "other"),
      time: oneOf(d.time, ["lunch", "tea", "dinner"], "lunch"),
      budget: Math.min(2000, Math.max(0, Number(d.budget) || 0)),
      pref: pref.length ? pref : ["any"],
      ppl: Math.min(8, Math.max(2, Number(d.ppl) || 2)),
      lang: oneOf(d.lang, ["zh", "en"], "zh"),
    };
  } else if (d.type === "coupon_issue" || d.type === "coupon_redeem") {
    rec = { type: d.type, ts, shop: oneOf(d.shop, SHOPS, "unknown"), mode: oneOf(d.mode, MODES, "solo"), code: str(d.code, 20) };
  } else {
    return new Response("Unknown type", { status: 400 });
  }

  const key = `${rec.type}/${ts}-${Math.random().toString(36).slice(2, 8)}`;
  await getStore("events").setJSON(key, rec);
  return Response.json({ ok: true });
};

export const config = { path: "/api/track" };
