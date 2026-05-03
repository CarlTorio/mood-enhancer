// Client-side service that talks to /api/pancake (server route).
// The Pancake API key never leaves the server.

export type PancakeProduct = "LF her" | "LF him" | "LF couple";
export type PancakeSku = "1LFW" | "2LFW" | "3LFW" | "1LFM" | "2LFM" | "3LFM" | "1LFC" | "2LFC";

export const PANCAKE_SHOP_ID = 1635271122;

export const PRODUCT_MAP: Record<
  PancakeSku,
  { productId: PancakeProduct; price: number; label: string }
> = {
  "1LFW": { productId: "LF her", price: 599, label: "1 Bottle" },
  "2LFW": { productId: "LF her", price: 899, label: "2 Bottles" },
  "3LFW": { productId: "LF her", price: 1199, label: "3 Bottles" },
  "1LFM": { productId: "LF him", price: 599, label: "1 Bottle" },
  "2LFM": { productId: "LF him", price: 899, label: "2 Bottles" },
  "3LFM": { productId: "LF him", price: 1199, label: "3 Bottles" },
  "1LFC": { productId: "LF couple", price: 899, label: "1M + 1W" },
  "2LFC": { productId: "LF couple", price: 1476, label: "2M + 2W" },
};

export type PancakeGeo = { id: string | number; name: string };

type ApiResp<T> = { data?: T; error?: string; details?: string };

async function call<T>(body: unknown): Promise<T> {
  const res = await fetch("/api/pancake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as ApiResp<T>;
  if (!res.ok || json.error) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json.data as T;
}

// ---------- Variations cache ----------
type RawVariation = {
  id?: string;
  variation_id?: string;
  uuid?: string;
  display_id?: string;
  sku?: string;
  fields?: Array<{ name?: string; value?: string }>;
  product?: { id?: string; display_id?: string };
};

// Cache disabled — always fetch fresh variations from Pancake.

function extractSku(v: RawVariation): string | undefined {
  if (v.sku) return v.sku;
  if (v.display_id) return v.display_id;
  if (v.fields) {
    for (const f of v.fields) {
      if (!f?.value) continue;
      const val = f.value.toUpperCase();
      if (/^[123]LF[WMC]$/.test(val)) return val;
    }
  }
  return undefined;
}

function extractId(v: RawVariation): string | undefined {
  return v.id ?? v.variation_id ?? v.uuid;
}

export async function fetchVariations(): Promise<Map<string, string>> {
  const data = await call<unknown>({ action: "getVariations" });
  const list: RawVariation[] = Array.isArray(data)
    ? (data as RawVariation[])
    : Array.isArray((data as { variations?: RawVariation[] })?.variations)
      ? ((data as { variations: RawVariation[] }).variations)
      : Array.isArray((data as { data?: RawVariation[] })?.data)
        ? ((data as { data: RawVariation[] }).data)
        : [];
  const map = new Map<string, string>();
  for (const v of list) {
    const sku = extractSku(v);
    const id = extractId(v);
    if (sku && id) map.set(sku.toUpperCase(), id);
  }
  return map;
}

// ---------- Geo ----------
function normalizeGeo(data: unknown): PancakeGeo[] {
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown[] })?.data)
      ? (data as { data: unknown[] }).data
      : [];
  return (list as Array<Record<string, unknown>>)
    .map((r) => ({
      id: (r.id ?? r.province_id ?? r.district_id ?? r.commune_id) as string | number,
      name: (r.name ?? r.province_name ?? r.district_name ?? r.commune_name ?? "") as string,
    }))
    .filter((g) => g.id != null && g.name);
}

export async function fetchProvinces(): Promise<PancakeGeo[]> {
  return normalizeGeo(await call<unknown>({ action: "getProvinces" }));
}
export async function fetchDistricts(provinceId: string | number): Promise<PancakeGeo[]> {
  return normalizeGeo(await call<unknown>({ action: "getDistricts", provinceId }));
}
export async function fetchCommunes(districtId: string | number): Promise<PancakeGeo[]> {
  return normalizeGeo(await call<unknown>({ action: "getCommunes", districtId }));
}

// ---------- Submit Order ----------
export type SubmitOrderInput = {
  fullName: string;
  phone: string;
  streetAddress: string;
  landmark?: string;
  provinceId: string | number;
  provinceName: string;
  districtId: string | number;
  districtName: string;
  communeId: string | number;
  communeName: string;
  paymentMethod: "cod" | "transfer";
  price: number;
  productId: PancakeProduct;
  sku: PancakeSku;
  bundleLabel: string;
  websiteOrderId?: string;
};

export async function submitOrder(input: SubmitOrderInput) {
  const variations = await fetchVariations();
  const variationId = variations.get(input.sku.toUpperCase());
  if (!variationId) {
    const available = Array.from(variations.keys());
    console.error(
      `[pancakeService] Variation not found for SKU "${input.sku}". Available SKUs (${available.length}):`,
      available,
    );
    throw new Error(
      `Variation not found for SKU "${input.sku}". Available SKUs in Pancake: ${
        available.length ? available.join(", ") : "(none returned)"
      }`,
    );
  }

  const note_internal = [
    `Payment: ${input.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Bank Transfer / GCash"}`,
    `Amount: ₱${input.price.toLocaleString()}`,
    `Website Order ID: ${input.websiteOrderId ?? "N/A"}`,
    `Product: ${input.productId} - ${input.bundleLabel}`,
  ].join("\n");

  const payload = {
    bill_full_name: input.fullName,
    bill_phone_number: input.phone,
    shipping_address: {
      address: input.streetAddress,
      province_id: input.provinceId,
      province_name: input.provinceName,
      district_id: input.districtId,
      district_name: input.districtName,
      commune_id: input.communeId,
      commune_name: input.communeName,
    },
    province_id: input.provinceId,
    district_id: input.districtId,
    commune_id: input.communeId,
    bill_province: input.provinceName,
    bill_district: input.districtName,
    bill_commune: input.communeName,
    note: input.landmark ? `Landmark: ${input.landmark}` : "",
    note_internal,
    is_free_shipping: true,
    cod: input.paymentMethod === "cod" ? Number(input.price) : 0,
    cash: input.paymentMethod === "transfer" ? Number(input.price) : 0,
    items: [
      {
        product_id: input.productId,
        variation_id: variationId,
        quantity: 1,
        retail_price: input.price,
      },
    ],
  };

  return call<unknown>({ action: "createOrder", payload });
}
