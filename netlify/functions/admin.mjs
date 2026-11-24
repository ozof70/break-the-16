// GET /api/admin — dashboard data, protected by the ADMIN_KEY env var
import { getStore } from "@netlify/blobs";
import { timingSafeEqual } from "node:crypto";

const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export default async (req) => {
  const expected = Netlify.env.get("ADMIN_KEY");
  if (!expected || !same(req.headers.get("x-admin-key") || "", expected)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const store = getStore("events");
  const out = { bell: [], coupon_issue: [], coupon_redeem: [] };
  for (const type of Object.keys(out)) {
    const { blobs } = await store.list({ prefix: type + "/" });
    out[type] = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
  }
  return Response.json(out, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/admin" };
