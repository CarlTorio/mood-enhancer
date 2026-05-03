import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const PANCAKE_BASE = "https://pos.pages.fm/api/v1";

const ShippingAddressSchema = z.object({
  address: z.string().min(1).max(500),
  province_id: z.union([z.string(), z.number()]),
  province_name: z.string().min(1).max(200),
  district_id: z.union([z.string(), z.number()]),
  district_name: z.string().min(1).max(200),
  commune_id: z.union([z.string(), z.number()]),
  commune_name: z.string().min(1).max(200),
});

const OrderItemSchema = z.object({
  product_id: z.string().min(1).max(64),
  variation_id: z.string().min(1).max(128),
  quantity: z.number().int().min(1).max(50),
  retail_price: z.number().min(0).max(1_000_000),
});

const CreateOrderSchema = z.object({
  bill_full_name: z.string().min(1).max(200),
  bill_phone_number: z.string().min(7).max(20),
  shipping_address: ShippingAddressSchema,
  province_id: z.union([z.string(), z.number()]),
  district_id: z.union([z.string(), z.number()]),
  commune_id: z.union([z.string(), z.number()]),
  bill_province: z.string().min(1).max(200),
  bill_district: z.string().min(1).max(200),
  bill_commune: z.string().min(1).max(200),
  note: z.string().max(2000).optional(),
  note_internal: z.string().max(4000).optional(),
  is_free_shipping: z.boolean().optional(),
  cod: z.number().min(0).max(1_000_000).optional(),
  cash: z.number().min(0).max(1_000_000).optional(),
  items: z.array(OrderItemSchema).min(1).max(20),
});

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("getVariations") }),
  z.object({ action: z.literal("getProvinces") }),
  z.object({ action: z.literal("getDistricts"), provinceId: z.union([z.string(), z.number()]) }),
  z.object({ action: z.literal("getCommunes"), districtId: z.union([z.string(), z.number()]) }),
  z.object({ action: z.literal("createOrder"), payload: CreateOrderSchema }),
]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

async function pancakeGet(path: string, apiKey: string) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${PANCAKE_BASE}${path}${sep}api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`Pancake ${res.status}: ${text.slice(0, 300)}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function pancakePost(path: string, apiKey: string, body: unknown) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${PANCAKE_BASE}${path}${sep}api_key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Pancake ${res.status}: ${text.slice(0, 500)}`);
  try { return JSON.parse(text); } catch { return text; }
}

export const Route = createFileRoute("/api/pancake")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const apiKey = process.env.PANCAKE_API_KEY;
        const shopId = process.env.PANCAKE_SHOP_ID;
        if (!apiKey || !shopId) return json({ error: "Missing PANCAKE_API_KEY or PANCAKE_SHOP_ID" }, 500);

        let parsed: z.infer<typeof Body>;
        try {
          parsed = Body.parse(await request.json());
        } catch (e) {
          return json({ error: "Invalid request", details: (e as Error).message }, 400);
        }

        try {
          switch (parsed.action) {
            case "getVariations": {
              const data = await pancakeGet(`/shops/${shopId}/variations`, apiKey);
              // TEMP DEBUG: log all SKUs returned by Pancake
              const list = Array.isArray(data)
                ? data
                : Array.isArray((data as { data?: unknown[] })?.data)
                  ? (data as { data: unknown[] }).data
                  : Array.isArray((data as { variations?: unknown[] })?.variations)
                    ? (data as { variations: unknown[] }).variations
                    : [];
              const skus = (list as Array<Record<string, unknown>>).map((v) => ({
                sku: v.sku ?? v.display_id ?? null,
                id: v.id ?? v.variation_id ?? v.uuid ?? null,
                name: v.name ?? v.display_name ?? null,
              }));
              console.log("[pancake-proxy] getVariations count=", skus.length, "skus=", JSON.stringify(skus));
              return json({ data });
            }
            case "getProvinces": {
              // Pancake uses ISO calling code 63 for Philippines (not "PH")
              const data = await pancakeGet(`/geo/provinces?country_code=63`, apiKey);
              return json({ data });
            }
            case "getDistricts": {
              const data = await pancakeGet(`/geo/districts?province_id=${encodeURIComponent(String(parsed.provinceId))}`, apiKey);
              return json({ data });
            }
            case "getCommunes": {
              const data = await pancakeGet(`/geo/communes?district_id=${encodeURIComponent(String(parsed.districtId))}`, apiKey);
              return json({ data });
            }
            case "createOrder": {
              const body = { ...parsed.payload, shop_id: Number(shopId) };
              const data = await pancakePost(`/shops/${shopId}/orders`, apiKey, body);
              return json({ data });
            }
          }
        } catch (e) {
          return json({ error: (e as Error).message }, 502);
        }
      },
    },
  },
});
