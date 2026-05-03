import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Truck, CheckCircle2, ArrowLeft, Star, Heart } from "lucide-react";
import { AddressCombobox, type ComboOption } from "@/components/AddressCombobox";
import {
  fetchVariations,
  fetchProvinces,
  fetchDistricts,
  fetchCommunes,
  submitOrder,
  PRODUCT_MAP,
  type PancakeGeo,
  type PancakeSku,
} from "@/services/pancakeService";

const BOTTLE_HER_URL =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/12.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMi5wbmciLCJpYXQiOjE3NzcwODkxODksImV4cCI6MTgwODYyNTE4OX0.lwk9AUb9CE31IDWqJDTuZOZtmes59bZ4FO-lUxOVd4s";
const BOTTLE_HIM_URL =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/11.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMS5wbmciLCJpYXQiOjE3NzcwODkyNTksImV4cCI6MTgwODYyNTI1OX0.K5QMIKYRD65B8p2BagU6a3SVO0gCmuwFYS78qwdHmPU";

type Variant = "her" | "him" | "couples";
type BundleId = "1" | "2" | "3";

type CheckoutSearch = { variant: Variant; bundle: BundleId };

const PRICING: Record<Variant, Record<BundleId, { price: number; baseEach: number; label: string; supply: string }>> = {
  her: {
    "1": { price: 599, baseEach: 599, label: "1 Bottle", supply: "30-day supply" },
    "2": { price: 899, baseEach: 599, label: "2 Bottles", supply: "60-day supply" },
    "3": { price: 1199, baseEach: 599, label: "3 Bottles", supply: "90-day supply" },
  },
  him: {
    "1": { price: 599, baseEach: 599, label: "1 Bottle", supply: "30-day supply" },
    "2": { price: 899, baseEach: 599, label: "2 Bottles", supply: "60-day supply" },
    "3": { price: 1199, baseEach: 599, label: "3 Bottles", supply: "90-day supply" },
  },
  couples: {
    "1": { price: 899, baseEach: 899, label: "1 Bottle Men + 1 Bottle Women", supply: "30-day supply" },
    "2": { price: 1476, baseEach: 738, label: "2 Bottles Men + 2 Bottles Women", supply: "60-day supply" },
    "3": { price: 1476, baseEach: 738, label: "2 Bottles Men + 2 Bottles Women", supply: "60-day supply" },
  },
};

const VARIANT_NAME: Record<Variant, { full: React.ReactNode; plain: string }> = {
  her: { full: <>LOVABLE for <em style={{ color: "#DC2627", fontStyle: "italic" }}>Her</em></>, plain: "LOVABLE for Her" },
  him: { full: <>LOVABLE for <em style={{ color: "#DC2627", fontStyle: "italic" }}>Him</em></>, plain: "LOVABLE for Him" },
  couples: { full: <>LOVABLE <em style={{ color: "#DC2627", fontStyle: "italic" }}>Couples</em> Bundle</>, plain: "LOVABLE Couples Bundle" },
};

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => {
    const v = search.variant;
    const b = search.bundle;
    const variant: Variant = v === "him" || v === "couples" ? v : "her";
    const bundle: BundleId = b === "1" || b === "3" ? b : "2";
    return { variant, bundle };
  },
  head: () => ({
    meta: [
      { title: "Checkout | LOVABLE Mood Drops" },
      { name: "description", content: "Secure checkout for LOVABLE Mood Drops. Free nationwide shipping, 30-day money-back guarantee." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = Route.useSearch();
  const variant = search.variant as Variant;
  const bundle = search.bundle as BundleId;
  const navigate = useNavigate();
  const item = PRICING[variant][bundle];

  const payment = "cod" as const;
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<{ code: string; amount: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Form state (kept minimal but real)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    regionCode: "",
    region: "",
    provinceCode: "",
    province: "",
    cityCode: "",
    city: "",
    barangayCode: "",
    barangay: "",
    landmark: "",
    saveInfo: true,
  });
  const [fullNameError, setFullNameError] = useState<string | null>(null);

  // Restore from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("lovable-checkout-form");
    if (saved) {
      try { setForm((f) => ({ ...f, ...JSON.parse(saved) })); } catch {}
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("lovable-checkout-form", JSON.stringify(form));
  }, [form]);

  // ====== Pancake cascading geo data (Province -> District -> Commune) ======
  const [provinces, setProvinces] = useState<PancakeGeo[]>([]);
  const [cities, setCities] = useState<PancakeGeo[]>([]);
  const [barangays, setBarangays] = useState<PancakeGeo[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load provinces + warm variation cache on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingProvinces(true);
    fetchProvinces()
      .then((p) => { if (!cancelled) setProvinces(p); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingProvinces(false); });
    fetchVariations().catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!form.provinceCode) { setCities([]); return; }
    let cancelled = false;
    setLoadingCities(true);
    fetchDistricts(form.provinceCode)
      .then((c) => { if (!cancelled) setCities(c); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingCities(false); });
    return () => { cancelled = true; };
  }, [form.provinceCode]);

  useEffect(() => {
    if (!form.cityCode) { setBarangays([]); return; }
    let cancelled = false;
    setLoadingBarangays(true);
    fetchCommunes(form.cityCode)
      .then((b) => { if (!cancelled) setBarangays(b); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingBarangays(false); });
    return () => { cancelled = true; };
  }, [form.cityCode]);

  const provinceOptions: ComboOption[] = useMemo(
    () => provinces.map((p) => ({ value: String(p.id), label: p.name })),
    [provinces],
  );
  const cityOptions: ComboOption[] = useMemo(
    () => cities.map((c) => ({ value: String(c.id), label: c.name })),
    [cities],
  );
  const barangayOptions: ComboOption[] = useMemo(
    () => barangays.map((b) => ({ value: String(b.id), label: b.name })),
    [barangays],
  );

  const setProvince = (code: string, label: string) => {
    setForm((f) => ({
      ...f,
      provinceCode: code, province: label,
      cityCode: "", city: "",
      barangayCode: "", barangay: "",
    }));
  };
  const setCity = (code: string, label: string) => {
    setForm((f) => ({
      ...f,
      cityCode: code, city: label,
      barangayCode: "", barangay: "",
    }));
  };
  const setBarangay = (code: string, label: string) => {
    setForm((f) => ({ ...f, barangayCode: code, barangay: label }));
  };



  const subtotal = variant === "couples"
    ? item.price
    : item.baseEach * Number(bundle);
  // Bundle savings = subtotal - price
  const bundleSavings = Math.max(0, subtotal - item.price);
  const discountAmount = discountApplied?.amount ?? 0;
  const afterDiscount = item.price - discountAmount;
  const shipping = 0;
  const total = afterDiscount + shipping;
  const totalSavings = bundleSavings + discountAmount;
  void totalSavings;

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) return;
    if (code === "SAVE10") {
      setDiscountApplied({ code, amount: Math.round(item.price * 0.1) });
    } else if (code === "LOVABLE50") {
      setDiscountApplied({ code, amount: 50 });
    } else {
      setDiscountApplied(null);
      alert("Invalid discount code");
    }
  };

  const [addressErrors, setAddressErrors] = useState<{
    region?: string; province?: string; city?: string; barangay?: string; address?: string;
  }>({});

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);

    const fullName = form.fullName.trim();
    if (!fullName.includes(" ")) {
      setFullNameError("Please enter your full name (first and last)");
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setSubmitError("Please enter a valid phone number (10-11 digits).");
      return;
    }

    const errs: typeof addressErrors = {};
    if (!form.provinceCode) errs.province = "Please select your province";
    if (!form.cityCode) errs.city = "Please select your city or municipality";
    if (!form.barangayCode) errs.barangay = "Please select your barangay";
    if (form.address.trim().length < 5) errs.address = "Please enter your complete address (House #, Street, Subdivision)";
    setAddressErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Resolve Pancake SKU from variant + bundle
    const skuMap: Record<Variant, Record<BundleId, PancakeSku>> = {
      her: { "1": "1LFW", "2": "2LFW", "3": "3LFW" },
      him: { "1": "1LFM", "2": "2LFM", "3": "3LFM" },
      couples: { "1": "1LFC", "2": "2LFC", "3": "2LFC" },
    };
    const sku = skuMap[variant][bundle];
    const product = PRODUCT_MAP[sku];

    const [firstName] = fullName.split(/\s+/);
    const landmark = form.landmark.trim();

    // Generate website order reference
    const year = new Date().getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    const orderId = `LV-${year}-${seq}`;

    setSubmitting(true);
    try {
      await submitOrder({
        fullName,
        phone: phoneDigits,
        streetAddress: form.address.trim(),
        landmark,
        provinceId: form.provinceCode,
        provinceName: form.province,
        districtId: form.cityCode,
        districtName: form.city,
        communeId: form.barangayCode,
        communeName: form.barangay,
        paymentMethod: "cod",
        price: product.price,
        productId: product.productId,
        sku,
        bundleLabel: item.label,
        websiteOrderId: orderId,
      });
    } catch (err) {
      setSubmitting(false);
      setSubmitError((err as Error).message || "Could not place order. Please try again.");
      return;
    }
    setSubmitting(false);

    navigate({
      to: "/thank-you",
      search: {
        orderId,
        variant,
        bundle,
        total: String(total),
        firstName,
        fullName,
        phone: form.phone,
        address: form.address,
        region: "",
        city: form.city,
        barangay: form.barangay,
      } as never,
    });
  };


  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ background: "linear-gradient(180deg, #100808 0%, #0D0606 50%, #100808 100%)", minHeight: "100vh", color: "#F2EAE0", fontFamily: "Montserrat, sans-serif" }}>
      <CheckoutHeader />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 140px" }}>
        <TrustStrip />

        <div className="ck-mobile-summary-wrap">
          <button
            type="button"
            onClick={() => setShowMobileSummary((s) => !s)}
            aria-expanded={showMobileSummary}
            className="ck-mobile-summary-toggle"
          >
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: 2, color: "#B8955A", textTransform: "uppercase" }}>
                {showMobileSummary ? "Hide order summary" : "View order summary"}
              </span>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: "#F2EAE0", fontWeight: 500 }}>
                ₱{total.toLocaleString()}
              </span>
            </span>
            <span aria-hidden style={{ color: "#B8955A", transition: "transform 300ms ease", transform: showMobileSummary ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
          </button>
          <div className={`ck-mobile-summary-panel${showMobileSummary ? " is-open" : ""}`}>
            <div style={{ padding: "0 4px 16px" }}>
              <OrderSummary
                variant={variant}
                bundle={bundle}
                item={item}
                subtotal={subtotal}
                bundleSavings={bundleSavings}
                shipping={shipping}
                discountApplied={discountApplied}
                total={total}
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
                onApplyDiscount={handleApplyDiscount}
              />
            </div>
          </div>
        </div>

        <form onSubmit={placeOrder} className="checkout-grid">
          <div>
            <SectionCard>
              <SectionHeader number={1} title="Delivery" italic="Information" right={<RequiredLabel />} />

              <FieldRow>
                <Field label="Full Name" required>
                  <input
                    className="ck-input"
                    required
                    placeholder="Juan Dela Cruz"
                    value={form.fullName}
                    onChange={(e) => {
                      update("fullName", e.target.value);
                      if (fullNameError) setFullNameError(null);
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && !/\s/.test(v)) setFullNameError("Please enter your full name (first and last)");
                    }}
                  />
                  {fullNameError && (
                    <div style={{ marginTop: 6, fontSize: 11, color: "#DC2627" }}>{fullNameError}</div>
                  )}
                </Field>
              </FieldRow>

              <FieldRow cols={2}>
                <Field label="Phone Number" required>
                  <input className="ck-input" required type="tel" placeholder="09XX XXX XXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </Field>
                <div className="ck-hide-mobile" style={{ display: "contents" }}>
                  <Field label="Email">
                    <input className="ck-input" type="email" placeholder="example@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>
                </div>
              </FieldRow>

              <FieldRow>
                <Field label="Complete Address" required sublabel="House #, Street, Subdivision">
                  <input
                    className="ck-input"
                    required
                    placeholder="e.g., 123 Mabuhay St., Subdivision Heights"
                    value={form.address}
                    onChange={(e) => { update("address", e.target.value); if (addressErrors.address) setAddressErrors((er) => ({ ...er, address: undefined })); }}
                  />
                  {addressErrors.address && <div style={{ marginTop: 6, fontSize: 11, color: "#DC2627" }}>{addressErrors.address}</div>}
                </Field>
              </FieldRow>

              <FieldRow>
                <Field label="Nearest Landmark" sublabel="optional">
                  <input
                    className="ck-input"
                    type="text"
                    maxLength={200}
                    placeholder="e.g., near 7-Eleven, beside Mercury Drug, behind the church"
                    value={form.landmark}
                    onChange={(e) => update("landmark", e.target.value)}
                  />
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      fontStyle: "italic",
                      color: "rgba(154, 136, 128, 0.7)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    <span aria-hidden style={{ color: "#B8955A", fontSize: 8 }}>◊</span>
                    Helps our delivery riders find you faster.
                  </div>
                </Field>
              </FieldRow>

              <FieldRow>
                <Field label="Province" required>
                  <AddressCombobox
                    label="Province"
                    placeholder="Select province"
                    value={form.provinceCode}
                    onChange={(c, l) => { setProvince(c, l); setAddressErrors((e) => ({ ...e, province: undefined })); }}
                    options={provinceOptions}
                    loading={loadingProvinces}
                    required
                  />
                  {addressErrors.province && <div style={{ marginTop: 6, fontSize: 11, color: "#DC2627" }}>{addressErrors.province}</div>}
                </Field>
              </FieldRow>


              <FieldRow>
                <Field label="City / Municipality" required>
                  <AddressCombobox
                    label="City"
                    placeholder={form.provinceCode ? "Search city or municipality" : "Select province first"}
                    value={form.cityCode}
                    onChange={(c, l) => { setCity(c, l); setAddressErrors((e) => ({ ...e, city: undefined })); }}
                    options={cityOptions}
                    disabled={!form.provinceCode}
                    loading={loadingCities}
                    required
                  />
                  {addressErrors.city && <div style={{ marginTop: 6, fontSize: 11, color: "#DC2627" }}>{addressErrors.city}</div>}
                </Field>
              </FieldRow>

              <FieldRow>
                <Field label="Barangay" required>
                  <AddressCombobox
                    label="Barangay"
                    placeholder={form.cityCode ? "Search barangay" : "Select city first"}
                    value={form.barangayCode}
                    onChange={(c, l) => { setBarangay(c, l); setAddressErrors((e) => ({ ...e, barangay: undefined })); }}
                    options={barangayOptions}
                    disabled={!form.cityCode}
                    loading={loadingBarangays}
                    required
                  />
                  {addressErrors.barangay && <div style={{ marginTop: 6, fontSize: 11, color: "#DC2627" }}>{addressErrors.barangay}</div>}
                </Field>
              </FieldRow>

              <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, fontSize: 12, color: "#F2EAE0", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.saveInfo}
                  onChange={(e) => update("saveInfo", e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "#DC2627" }}
                />
                Save this information for next time
              </label>
            </SectionCard>

            <div style={{ height: 24 }} />

            <SectionCard>
              <SectionHeader number={2} title="Payment" italic="Method" right={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#B8955A" }}>
                  <Truck size={11} /> Cash on Delivery
                </span>
              } />

              <PaymentCard
                selected
                onClick={() => {}}
                icon={<Truck size={20} color="#B8955A" />}
                title={<>Cash on <em style={{ color: "#DC2627", fontStyle: "italic" }}>Delivery</em> (COD)</>}
                subtitle="Pay when you receive your order"
              />

              <div style={{ marginTop: 12, fontSize: 12, fontStyle: "italic", color: "#B8955A" }}>
                We'll inform you when your order is ready for delivery.
              </div>

              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontStyle: "italic", color: "#9A8880" }}>
                <Lock size={12} /> Your delivery information is encrypted and never shared. ✓
              </div>
            </SectionCard>

            {submitError && (
              <div role="alert" style={{ marginTop: 16, padding: "12px 14px", border: "1px solid rgba(220,38,39,0.5)", background: "rgba(220,38,39,0.08)", color: "#F2EAE0", borderRadius: 8, fontSize: 12 }}>
                {submitError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-pulse-shine btn-pulse-medium ck-place-order"
              style={{ width: "100%", marginTop: 24, opacity: submitting ? 0.7 : 1 }}
            >
              <span>
                {submitting ? "PROCESSING..." : `PLACE ORDER · ₱${total.toLocaleString()}`}
              </span>
              <span className="arrow">{submitting ? "" : "🔒"}</span>
            </button>
          </div>

          <aside className="checkout-summary">
            <OrderSummary
              variant={variant}
              bundle={bundle}
              item={item}
              subtotal={subtotal}
              bundleSavings={bundleSavings}
              shipping={shipping}
              discountApplied={discountApplied}
              total={total}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              onApplyDiscount={handleApplyDiscount}
            />
          </aside>
        </form>
      </main>

      {/* Sticky mobile bottom CTA */}
      <div className="ck-mobile-bottom">
        <button
          onClick={() => setShowMobileSummary((s) => !s)}
          aria-expanded={showMobileSummary}
          style={{
            background: "transparent", border: "none", color: "#F2EAE0", textAlign: "left", flex: 1, cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#9A8880" }}>Total</div>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, color: "#DC2627", fontStyle: "italic" }}>
            ₱{total.toLocaleString()}
          </div>
        </button>
        <button
          form=""
          onClick={(e) => {
            // Submit the form
            const f = (e.currentTarget.closest("body") as HTMLElement | null)?.querySelector("form");
            if (f) (f as HTMLFormElement).requestSubmit();
          }}
          className="btn-pulse-shine btn-pulse-compact"
          style={{ minWidth: 160 }}
          disabled={submitting}
        >
          <span>{submitting ? "PROCESSING" : "PLACE ORDER"}</span> <span className="arrow">→</span>
        </button>
      </div>

      <style>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
          gap: 32px;
          align-items: start;
        }
        .checkout-summary { position: sticky; top: 100px; }
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; gap: 24px; }
          .checkout-summary { position: static; }
        }
        .ck-input {
          width: 100%;
          background: #150909;
          border: 0.5px solid rgba(184, 149, 90, 0.32);
          border-radius: 8px;
          padding: 14px 16px;
          color: #F2EAE0;
          font-family: Montserrat, sans-serif;
          font-size: 13px;
          transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
          outline: none;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
        }
        .ck-input::placeholder { color: rgba(154, 136, 128, 0.7); }
        .ck-input:hover { border-color: rgba(184, 149, 90, 0.55); background: #180A0A; }
        .ck-input:focus {
          border: 1px solid #DC2627;
          background: #180A0A;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(220, 38, 39, 0.12);
        }
        .ck-input:disabled { opacity: 0.5; cursor: not-allowed; }
        select.ck-input { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #C9A06D 50%), linear-gradient(135deg, #C9A06D 50%, transparent 50%); background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50%; background-size: 5px 5px, 5px 5px; background-repeat: no-repeat; padding-right: 36px; }

        .ck-mobile-bottom {
          display: none;
          position: fixed; left: 0; right: 0; bottom: 0;
          background: rgba(13, 13, 13, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 0.5px solid rgba(184, 149, 90, 0.22);
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
          z-index: 50;
          gap: 12px; align-items: center;
        }
        .ck-mobile-summary-wrap { display: none; }
        .ck-mobile-summary-toggle {
          width: 100%;
          background: linear-gradient(180deg, #1F1010 0%, #1A0E0E 100%);
          border: 0.5px solid rgba(184, 149, 90, 0.35);
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #F2EAE0;
          cursor: pointer;
          font-family: Montserrat, sans-serif;
          box-shadow: 0 1px 0 rgba(242, 234, 224, 0.08) inset, 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        .ck-mobile-summary-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ck-mobile-summary-panel.is-open {
          max-height: 1400px;
          padding-top: 12px;
        }
        @media (max-width: 900px) {
          .ck-mobile-bottom { display: flex; }
          .ck-place-order { display: none; }
          .ck-hide-mobile { display: none !important; }
          .ck-mobile-summary-wrap { display: block; margin-bottom: 24px; }
          .checkout-summary { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function CheckoutHeader() {
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(20, 12, 12, 0.88)",
        backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        padding: "20px 32px",
        borderBottom: "0.5px solid rgba(184, 149, 90, 0.32)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link
          to="/"
          aria-label="LOVABLE"
          style={{
            display: "inline-flex", alignItems: "center", gap: 0,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.02em",
            color: "#DC2627",
            textDecoration: "none",
            lineHeight: 1,
          }}
        >
          <span>LO</span>
          <Heart size={18} fill="#DC2627" stroke="#DC2627" strokeWidth={1.5} style={{ margin: "0 1px" }} aria-hidden="true" />
          <span>ABLE</span>
        </Link>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(184, 149, 90, 0.1)",
            border: "0.5px solid rgba(184, 149, 90, 0.3)",
            padding: "6px 14px", borderRadius: 999,
          }}
        >
          <span style={{ display: "inline-flex", gap: 1 }}>
            {[0,1,2,3,4].map((i) => <Star key={i} size={10} fill="#B8955A" stroke="#B8955A" />)}
          </span>
          <span style={{ fontSize: 10, letterSpacing: 1.5, color: "#F2EAE0" }}>1,200+ 5-Star Reviews</span>
        </div>
      </div>
      <Link
        to="/shop"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "rgba(184, 149, 90, 0.75)", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none",
          transition: "color 250ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A06D")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184, 149, 90, 0.75)")}
      >
        <ArrowLeft size={12} /> Back to Shop
      </Link>
    </header>
  );
}

function TrustStrip() {
  const items = [
    "Free Nationwide Shipping",
    "30-Day Money-Back Guarantee",
    "Discreet Packaging",
    "FDA-Registered Facility",
  ];
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(184, 149, 90, 0.08) 0%, rgba(184, 149, 90, 0.04) 100%)",
        border: "0.5px solid rgba(184, 149, 90, 0.3)",
        borderRadius: 14,
        padding: "16px 24px",
        marginBottom: 32,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        boxShadow: "0 1px 0 rgba(242, 234, 224, 0.06) inset, 0 4px 16px rgba(0, 0, 0, 0.3)",
      }}
      className="ck-trust"
    >
      {items.map((it) => (
        <div key={it} className="ck-trust-item" style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ color: "#C9A06D", fontSize: 12, flexShrink: 0 }}>◊</span>
          <span className="ck-trust-label" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(242, 234, 224, 0.92)", lineHeight: 1.3 }}>{it}</span>
        </div>
      ))}
      <style>{`
        @media (max-width: 700px) {
          .ck-trust {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 14px 12px !important;
            gap: 10px !important;
          }
          .ck-trust-item { justify-content: flex-start !important; padding: 6px 4px; }
          .ck-trust-label { font-size: 9.5px !important; letter-spacing: 1.1px !important; }
        }
      `}</style>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #1F1010 0%, #1A0E0E 100%)",
        border: "0.5px solid rgba(184, 149, 90, 0.35)",
        borderRadius: 14,
        padding: "36px 32px",
        boxShadow:
          "0 1px 0 rgba(242, 234, 224, 0.08) inset, 0 8px 24px rgba(0, 0, 0, 0.5), 0 16px 48px rgba(0, 0, 0, 0.3), 0 32px 64px rgba(0, 0, 0, 0.2)",
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ number, title, italic, right }: { number: number; title: string; italic: string; right?: React.ReactNode }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #FF3F40 0%, #DC2627 100%)", color: "#F2EAE0",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 14,
              boxShadow: "0 1px 0 rgba(242, 234, 224, 0.2) inset, 0 4px 12px rgba(220, 38, 39, 0.4), 0 0 0 4px rgba(220, 38, 39, 0.1)",
            }}
          >{number}</span>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: "#F2EAE0", margin: 0 }}>
            {title} <em style={{ color: "#C9A06D", fontStyle: "italic" }}>{italic}</em>
          </h2>
        </div>
        {right}
      </div>
      <div style={{ height: 0.5, background: "linear-gradient(to right, rgba(184,149,90,0.5) 0%, rgba(184,149,90,0.3) 30%, transparent 100%)", margin: "16px 0 24px" }} />
    </>
  );
}

function RequiredLabel() {
  return (
    <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#C9A06D" }}>Required</span>
  );
}

function FieldRow({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginBottom: 14 }}
      className={`ck-fieldrow-${cols}`}
    >
      {children}
      {cols > 1 && (
        <style>{`
          @media (max-width: 600px) { .ck-fieldrow-${cols} { grid-template-columns: 1fr; } }
        `}</style>
      )}
    </div>
  );
}

function Field({ label, required, sublabel, children }: { label: string; required?: boolean; sublabel?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ marginBottom: 6, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#C9A06D" }}>
        {label}{required && <span style={{ color: "#FF3F40", marginLeft: 4 }}>*</span>}
        {sublabel && <span style={{ marginLeft: 6, color: "rgba(154, 136, 128, 0.85)", textTransform: "none", letterSpacing: 0.5, fontStyle: "italic" }}>({sublabel})</span>}
      </div>
      {children}
    </label>
  );
}

function PaymentCard({
  selected, onClick, icon, title, subtitle, badge, logos, children,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  badge?: string;
  logos?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }}}
      style={{
        border: selected ? "1px solid #DC2627" : "0.5px solid rgba(184, 149, 90, 0.32)",
        background: selected ? "rgba(220, 38, 39, 0.06)" : "rgba(20, 12, 12, 0.4)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        cursor: "pointer",
        transition: "all 250ms ease",
        boxShadow: selected
          ? "0 1px 0 rgba(242, 234, 224, 0.1) inset, 0 8px 20px rgba(220, 38, 39, 0.25), 0 0 0 4px rgba(220, 38, 39, 0.08)"
          : "0 1px 0 rgba(242, 234, 224, 0.04) inset, 0 4px 12px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            width: 22, height: 22, borderRadius: "50%",
            border: selected ? "6px solid #DC2627" : "1.5px solid #C9A06D",
            background: selected ? "#0D0606" : "transparent",
            boxShadow: selected ? "0 0 12px rgba(220, 38, 39, 0.5)" : "none",
            flexShrink: 0,
          }}
        />
        <span style={{ width: 40, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(184,149,90,0.14)", flexShrink: 0 }}>
          {icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, color: "#F2EAE0" }}>{title}</div>
          <div style={{ fontSize: 12, color: "rgba(242, 234, 224, 0.7)", marginTop: 2 }}>{subtitle}</div>
        </div>
        {badge && (
          <span style={{
            background: "rgba(184, 149, 90, 0.14)",
            border: "0.5px solid rgba(184, 149, 90, 0.4)",
            padding: "4px 10px", borderRadius: 999,
            fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#C9A06D",
            flexShrink: 0,
          }}>{badge}</span>
        )}
        {logos && (
          <div style={{ display: "flex", gap: 6, color: "#C9A06D", fontSize: 10, letterSpacing: 1 }}>
            <span>VISA</span><span>MC</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function OrderSummary({
  variant, bundle, item, subtotal, bundleSavings, shipping, discountApplied, total,
  discountCode, setDiscountCode, onApplyDiscount,
}: {
  variant: Variant;
  bundle: BundleId;
  item: { price: number; baseEach: number; label: string; supply: string };
  subtotal: number;
  bundleSavings: number;
  shipping: number;
  discountApplied: { code: string; amount: number } | null;
  total: number;
  discountCode: string;
  setDiscountCode: (s: string) => void;
  onApplyDiscount: () => void;
}) {
  const savingsTotal = bundleSavings + (discountApplied?.amount ?? 0);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #1F1010 0%, #180A0A 100%)",
        border: "0.5px solid rgba(220, 38, 39, 0.25)",
        borderRadius: 14,
        padding: "32px 28px",
        boxShadow:
          "0 1px 0 rgba(242, 234, 224, 0.1) inset, 0 12px 32px rgba(0, 0, 0, 0.5), 0 24px 56px rgba(0, 0, 0, 0.3), 0 0 64px rgba(220, 38, 39, 0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: "#F2EAE0", margin: 0 }}>
          Order <em style={{ color: "#C9A06D", fontStyle: "italic" }}>Summary</em>
        </h2>
        <Link
          to="/shop"
          search={{ variant }}
          style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#C9A06D", textDecoration: "none" }}
        >
          Edit
        </Link>
      </div>
      <div style={{ height: 0.5, background: "linear-gradient(to right, rgba(184,149,90,0.5) 0%, rgba(184,149,90,0.3) 30%, transparent 100%)", margin: "16px 0 20px" }} />

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ position: "relative", width: 64, height: 64, borderRadius: 8, border: "0.5px solid rgba(184, 149, 90, 0.35)", overflow: "hidden", background: "#0D0606", flexShrink: 0 }}>
          {variant === "couples" ? (
            <div style={{ display: "flex", height: "100%" }}>
              <img src={BOTTLE_HER_URL} alt="" style={{ width: "50%", height: "100%", objectFit: "cover" }} />
              <img src={BOTTLE_HIM_URL} alt="" style={{ width: "50%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <img src={variant === "her" ? BOTTLE_HER_URL : BOTTLE_HIM_URL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <span style={{
            position: "absolute", top: -6, right: -6,
            width: 22, height: 22, borderRadius: "50%",
            background: "rgba(0,0,0,0.85)", border: "0.5px solid #C9A06D",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: '"Playfair Display", serif', fontSize: 11, color: "#F2EAE0",
          }}>{bundle}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 14, color: "#F2EAE0" }}>
            {VARIANT_NAME[variant].full}
          </div>
          <div style={{ fontSize: 11, color: "rgba(242, 234, 224, 0.7)", marginTop: 2 }}>
            {item.label}
          </div>
        </div>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, color: "#F2EAE0", fontWeight: 500 }}>
          ₱{item.price.toLocaleString()}
        </div>
      </div>

      {/* Discount code */}
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <input
          className="ck-input"
          placeholder="Discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={onApplyDiscount}
          className="btn-shine btn-shine-gold"
          style={{
            background: "#150909",
            border: "0.5px solid rgba(184, 149, 90, 0.5)",
            borderRadius: 999,
            padding: "12px 20px",
            color: "#F2EAE0",
            fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 1px 0 rgba(242, 234, 224, 0.06) inset, 0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span>Apply</span>
        </button>
      </div>

      {/* Price breakdown */}
      <div style={{ marginTop: 24 }}>
        <PriceRow label="Subtotal" value={`₱${subtotal.toLocaleString()}`} />
        {bundleSavings > 0 && (
          <PriceRow label="Bundle Savings" value={`-₱${bundleSavings.toLocaleString()}`} accent="#C9A06D" />
        )}
        <PriceRow
          label="Shipping"
          value={shipping === 0 ? "FREE" : `₱${shipping.toLocaleString()}`}
          accent={shipping === 0 ? "#1FBB7B" : undefined}
          glow={shipping === 0}
        />
        {discountApplied && (
          <PriceRow label={`Promo: ${discountApplied.code}`} value={`-₱${discountApplied.amount.toLocaleString()}`} accent="#1FBB7B" />
        )}
      </div>

      {savingsTotal > 0 && (
        <div
          style={{
            background: "rgba(31, 187, 123, 0.1)",
            border: "0.5px solid rgba(31, 187, 123, 0.4)",
            borderRadius: 8,
            padding: "12px 16px",
            margin: "12px 0",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 0 16px rgba(31, 187, 123, 0.08)",
          }}
        >
          <CheckCircle2 size={14} color="#1FBB7B" />
          <span style={{ fontSize: 12, color: "#1FBB7B" }}>
            You're saving ₱{savingsTotal.toLocaleString()} on this order!
          </span>
        </div>
      )}

      <div style={{ height: 1, background: "rgba(184, 149, 90, 0.4)", margin: "16px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#F2EAE0" }}>Total</span>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, color: "#FF3F40", fontStyle: "italic", fontWeight: 500, textShadow: "0 0 12px rgba(220, 38, 39, 0.3)" }}>
          ₱{total.toLocaleString()}
        </span>
      </div>

      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "0.5px solid rgba(184, 149, 90, 0.3)", display: "grid", gap: 12 }}>
        {[
          "30-Day Money-Back Guarantee",
          "Discreet, unmarked packaging",
          "SSL secured payment",
        ].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle2 size={16} color="#1FBB7B" />
            <span style={{ fontSize: 12, color: "#F2EAE0" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceRow({ label, value, accent, glow }: { label: string; value: string; accent?: string; glow?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12 }}>
      <span style={{ fontSize: 13, color: accent ?? "rgba(242, 234, 224, 0.85)" }}>{label}</span>
      <span
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 14,
          color: accent ?? "#F2EAE0",
          fontWeight: glow ? 700 : 500,
          letterSpacing: glow ? 1.5 : undefined,
          textShadow: glow ? "0 0 8px rgba(31, 187, 123, 0.3)" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}
