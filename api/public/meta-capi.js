import { createHash } from "crypto";

const PIXEL_ID = "839542085373899";

const sha256 = (v) =>
  v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).end("Method not allowed");
    return;
  }

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    res.status(500).end("Missing token");
    return;
  }

  let parsed;
  try {
    parsed = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).end("Invalid payload");
    return;
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim();

  const event = {
    event_name: parsed.eventName,
    event_time: parsed.eventTime,
    event_id: parsed.eventId,
    event_source_url: parsed.eventSourceUrl,
    action_source: "website",
    user_data: {
      em: parsed.userData?.email ? [sha256(parsed.userData.email)] : undefined,
      ph: parsed.userData?.phone ? [sha256(parsed.userData.phone.replace(/\D/g, ""))] : undefined,
      fbp: parsed.userData?.fbp,
      fbc: parsed.userData?.fbc,
      client_user_agent: parsed.userData?.clientUserAgent,
      client_ip_address: ip,
    },
    custom_data: {
      value: parsed.customData?.value,
      currency: parsed.customData?.currency,
      content_ids: parsed.customData?.contentIds,
      content_type: "product",
    },
  };

  const r = await fetch(
    `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event] }),
    }
  );
  const body = await r.text();
  res.status(r.status).setHeader("Content-Type", "application/json").end(body);
}
