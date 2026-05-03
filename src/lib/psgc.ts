// PSGC (Philippine Standard Geographic Code) data loader.
// Static JSON files served from /public/psgc/. Lazy-loaded and cached.

export type Region = { id: number; psgc_code: string; region_name: string; region_code: string };
export type Province = { province_code: string; province_name: string; psgc_code: string; region_code: string };
export type City = { city_code: string; city_name: string; province_code: string; psgc_code: string; region_desc: string };
export type Barangay = { brgy_code: string; brgy_name: string; city_code: string; province_code: string; region_code: string };

const cache: { regions?: Region[]; provinces?: Province[]; cities?: City[]; barangays?: Barangay[] } = {};
const inflight: Record<string, Promise<unknown> | undefined> = {};

async function load<T>(key: "region" | "province" | "city" | "barangay"): Promise<T[]> {
  const cacheKey = (key + "s") as "regions" | "provinces" | "cities" | "barangays";
  const existing = cache[cacheKey];
  if (existing) return existing as T[];
  if (!inflight[key]) {
    inflight[key] = fetch(`/psgc/${key}.json`).then(async (r) => {
      if (!r.ok) throw new Error(`Failed to load ${key}.json`);
      const data = (await r.json()) as T[];
      // @ts-expect-error indexed assignment
      cache[cacheKey] = data;
      return data;
    });
  }
  return (await inflight[key]) as T[];
}

export const loadRegions = () => load<Region>("region");
export const loadProvinces = () => load<Province>("province");
export const loadCities = () => load<City>("city");
export const loadBarangays = () => load<Barangay>("barangay");

export async function provincesByRegion(regionCode: string) {
  const all = await loadProvinces();
  return all.filter((p) => p.region_code === regionCode);
}
export async function citiesByProvince(provinceCode: string) {
  const all = await loadCities();
  return all.filter((c) => c.province_code === provinceCode);
}
export async function barangaysByCity(cityCode: string) {
  const all = await loadBarangays();
  return all.filter((b) => b.city_code === cityCode);
}
