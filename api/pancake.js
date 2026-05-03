const PANCAKE_BASE = "https://pos.pages.fm/api/v1";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (res, data, status = 200) => {
  res.status(status).setHeader("Content-Type", "application/json");
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(data));
};

async function pancakeGet(path, apiKey) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${PANCAKE_BASE}${path}${sep}api_key=${encodeURIComponent(apiKey)}`;
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) throw new Error(`Pancake ${r.status}: ${text.slice(0, 300)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function pancakePost(path, apiKey, body) {
  const sep = path.includes("?") ? "&" : "?";
  const r = await fetch(`${PANCAKE_BASE}${path}${sep}api_key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`Pancake ${r.status}: ${text.slice(0, 500)}`);
  try { return JSON.parse(text); } catch { return text; }
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    json(res, { error: "Method not allowed" }, 405);
    return;
  }

  const apiKey = process.env.PANCAKE_API_KEY;
  const shopId = process.env.PANCAKE_SHOP_ID;
  if (!apiKey || !shopId) {
    json(res, { error: "Missing PANCAKE_API_KEY or PANCAKE_SHOP_ID" }, 500);
    return;
  }

  let parsed;
  try {
    parsed = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    json(res, { error: "Invalid JSON" }, 400);
    return;
  }

  try {
    switch (parsed.action) {
      case "getVariations": {
        const data = await pancakeGet(`/shops/${shopId}/variations`, apiKey);
        json(res, { data });
        break;
      }
      case "getProvinces": {
        const data = await pancakeGet(`/geo/provinces?country_code=63`, apiKey);
        json(res, { data });
        break;
      }
      case "getDistricts": {
        const data = await pancakeGet(`/geo/districts?province_id=${encodeURIComponent(String(parsed.provinceId))}`, apiKey);
        json(res, { data });
        break;
      }
      case "getCommunes": {
        const data = await pancakeGet(`/geo/communes?district_id=${encodeURIComponent(String(parsed.districtId))}`, apiKey);
        json(res, { data });
        break;
      }
      case "createOrder": {
        const body = { ...parsed.payload, shop_id: Number(shopId) };
        const data = await pancakePost(`/shops/${shopId}/orders`, apiKey, body);
        json(res, { data });
        break;
      }
      default:
        json(res, { error: "Unknown action" }, 400);
    }
  } catch (e) {
    json(res, { error: e.message }, 502);
  }
}
