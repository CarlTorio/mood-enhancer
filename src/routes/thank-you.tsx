import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Check, Download } from "lucide-react";
import manualCover from "@/assets/reconnection-manual-cover.jpg";
import { trackPurchase } from "@/lib/metaPixel";

type ThankYouSearch = {
  orderId: string;
  variant: "her" | "him" | "couples";
  bundle: "1" | "2" | "3";
  total: string;
  firstName: string;
  fullName: string;
  phone: string;
  address: string;
  region: string;
  city: string;
  barangay: string;
};

const BOTTLE_HER_URL =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/12.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMi5wbmciLCJpYXQiOjE3NzcwODkxODksImV4cCI6MTgwODYyNTE4OX0.lwk9AUb9CE31IDWqJDTuZOZtmes59bZ4FO-lUxOVd4s";
const BOTTLE_HIM_URL =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/11.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMS5wbmciLCJpYXQiOjE3NzcwODkyNTksImV4cCI6MTgwODYyNTI1OX0.K5QMIKYRD65B8p2BagU6a3SVO0gCmuwFYS78qwdHmPU";

type Variant = "her" | "him" | "couples";
type BundleId = "1" | "2" | "3";

const PRICING: Record<Variant, Record<BundleId, { price: number; baseEach: number; label: string }>> = {
  her: {
    "1": { price: 599, baseEach: 599, label: "1 Bottle" },
    "2": { price: 899, baseEach: 599, label: "2 Bottles" },
    "3": { price: 1199, baseEach: 599, label: "3 Bottles" },
  },
  him: {
    "1": { price: 599, baseEach: 599, label: "1 Bottle" },
    "2": { price: 899, baseEach: 599, label: "2 Bottles" },
    "3": { price: 1199, baseEach: 599, label: "3 Bottles" },
  },
  couples: {
    "1": { price: 1099, baseEach: 1198, label: "1 Set" },
    "2": { price: 1899, baseEach: 1099, label: "2 Sets" },
    "3": { price: 2699, baseEach: 1099, label: "3 Sets" },
  },
};

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>): ThankYouSearch => {
    const str = (k: string) => {
      const v = search[k];
      if (typeof v === "string") return v;
      if (typeof v === "number" || typeof v === "boolean") return String(v);
      return "";
    };
    const v = search.variant;
    const variant: ThankYouSearch["variant"] = v === "him" || v === "couples" ? v : "her";
    const bRaw = typeof search.bundle === "number" ? String(search.bundle) : search.bundle;
    const bundle: ThankYouSearch["bundle"] = bRaw === "2" || bRaw === "3" ? bRaw : "1";
    return {
      orderId: str("orderId"),
      variant,
      bundle,
      total: str("total"),
      firstName: str("firstName"),
      fullName: str("fullName"),
      phone: str("phone"),
      address: str("address"),
      region: str("region"),
      city: str("city"),
      barangay: str("barangay"),
    };
  },
  head: () => ({
    meta: [
      { title: "Thank You | LOVABLE Mood Drops" },
      { name: "description", content: "Your order has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function Wordmark() {
  return (
    <span
      aria-label="LOVABLE"
      className="inline-flex items-center font-extrabold tracking-tight leading-none"
      style={{ fontFamily: '"Playfair Display", serif', letterSpacing: "-0.02em", color: "#DC2627", fontSize: 24 }}
    >
      <span>LO</span>
      <Heart className="mx-[1px]" size="0.95em" fill="currentColor" stroke="currentColor" strokeWidth={1.5} aria-hidden />
      <span>ABLE</span>
    </span>
  );
}

function ThankYouPage() {
  const search = Route.useSearch();
  const [hasParams, setHasParams] = useState(true);

  useEffect(() => {
    // Consider order "found" if we have at least an orderId or a total
    setHasParams(Boolean(search.orderId || search.total));
  }, [search.orderId, search.total]);

  const purchaseFiredRef = useRef(false);
  useEffect(() => {
    if (purchaseFiredRef.current) return;
    if (!search.orderId && !search.total) return;
    purchaseFiredRef.current = true;
    const v = search.variant === "him" || search.variant === "couples" ? search.variant : "her";
    const b = search.bundle === "2" || search.bundle === "3" ? search.bundle : "1";
    const total = Number(search.total) || PRICING[v as Variant][b as BundleId].price;
    trackPurchase({
      value: total,
      currency: "PHP",
      contentIds: [`lovable-${v}-${b}`],
      phone: search.phone || undefined,
    });
  }, [search.orderId, search.total, search.variant, search.bundle, search.phone]);

  if (!hasParams) {
    return (
      <div className="thank-you-page">
        <PageStyles />
        <div className="thank-you-content" style={{ textAlign: "center" }}>
          <div className="thank-you-logo"><Wordmark /></div>
          <h1 className="thank-you-headline">Order <em>not found.</em></h1>
          <p className="thank-you-subhead">We couldn't find an order to display.</p>
          <div className="thank-you-cta-section">
            <Link to="/" className="back-home-btn btn-shine btn-shine-glass"><span>← BACK TO HOME</span></Link>
          </div>
        </div>
      </div>
    );
  }

  const variant = search.variant as Variant;
  const bundle = search.bundle as BundleId;
  const item = PRICING[variant][bundle];
  const total = Number(search.total) || item.price;

  // Subtotal: unbundled price
  let subtotal: number;
  let qtyForSubtotal: number;
  if (variant === "couples") {
    qtyForSubtotal = Number(bundle);
    subtotal = qtyForSubtotal === 1 ? 1198 : 1198 * qtyForSubtotal;
  } else {
    qtyForSubtotal = Number(bundle);
    subtotal = 599 * qtyForSubtotal;
  }
  const savings = Math.max(0, subtotal - total);

  const productImg = variant === "her" ? BOTTLE_HER_URL : BOTTLE_HIM_URL;
  const productName =
    variant === "her" ? <>LOVABLE for <em>Her</em></> :
    variant === "him" ? <>LOVABLE for <em>Him</em></> :
    <>LOVABLE <em>Couples</em> Bundle</>;

  const orderId = search.orderId || "LV-XXXXXX";
  const firstName = search.firstName || (search.fullName.trim().split(/\s+/)[0] ?? "");

  const addressLines = [
    search.fullName,
    search.address,
    [search.barangay, search.city, search.region].filter(Boolean).join(", "),
    search.phone,
  ].filter((l) => l && l.trim().length > 0);

  return (
    <div className="thank-you-page">
      <PageStyles />
      <div className="thank-you-content">
        <div className="thank-you-logo"><Wordmark /></div>

        <div className="success-badge" aria-hidden>
          <Check strokeWidth={2.5} />
        </div>

        <h1 className="thank-you-headline">
          {firstName ? <>Salamat, <em>{firstName}</em>.</> : <>Order received. <em>Thank you.</em></>}
        </h1>

        <p className="thank-you-subhead">Your order is in. We'll inform you when it's on the way.</p>

        <div className="order-reference">
          <p className="order-reference-label">Order Reference</p>
          <p className="order-reference-id">{orderId}</p>
        </div>

        <div className="order-summary">
          <div className="summary-product">
            <img className="summary-product-image" src={productImg} alt="" />
            <div className="summary-product-info">
              <p className="summary-product-name">{productName}</p>
              <p className="summary-product-meta">{item.label.toUpperCase()}</p>
            </div>
            <span className="summary-product-price">₱{total.toLocaleString()}</span>
          </div>

          <div className="summary-prices">
            <div className="summary-price-row">
              <span className="label">Subtotal</span>
              <span className="value">₱{subtotal.toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div className="summary-price-row" style={{ color: "#B8955A" }}>
                <span className="label" style={{ color: "#B8955A" }}>Bundle Savings</span>
                <span className="value" style={{ color: "#B8955A" }}>-₱{savings.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-price-row shipping">
              <span className="label">Shipping</span>
              <span className="value">FREE</span>
            </div>
          </div>

          <div className="summary-total">
            <span className="summary-total-label">Total</span>
            <span className="summary-total-value">₱{total.toLocaleString()}</span>
          </div>

          <p className="summary-payment-method">Cash on Delivery · Pay when your order arrives</p>
        </div>

        {addressLines.length > 0 && (
          <div className="delivery-block">
            <p className="delivery-block-label">Delivery Address</p>
            <p className="delivery-block-address">
              {addressLines.map((l, i) => (
                <span key={i}>{l}{i < addressLines.length - 1 && <br />}</span>
              ))}
            </p>
          </div>
        )}

        {Number(bundle) >= 2 && (
          <BonusDownloadSection isThree={bundle === "3"} />
        )}

        <div className="expectations">
          <h2 className="expectations-title">What happens <em>next.</em></h2>
          <ul className="expectations-list">
            <li className="expectation-item">
              <span className="expectation-number">01</span>
              <div className="expectation-content">
                <p className="expectation-step-title">We're processing your order</p>
                <p className="expectation-step-desc">Our team will prepare your order within 24 hours.</p>
              </div>
            </li>
            <li className="expectation-item">
              <span className="expectation-number">02</span>
              <div className="expectation-content">
                <p className="expectation-step-title">We'll inform you when it ships</p>
                <p className="expectation-step-desc">We'll reach out to you with delivery details.</p>
              </div>
            </li>
            <li className="expectation-item">
              <span className="expectation-number">03</span>
              <div className="expectation-content">
                <p className="expectation-step-title">Delivery in 2 to 5 days</p>
                <p className="expectation-step-desc">Discreet packaging via J&T, Ninja Van, or Flash. Pay cash on arrival.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="thank-you-cta-section">
          <Link to="/" className="back-home-btn btn-shine btn-shine-glass"><span>← BACK TO HOME</span></Link>
        </div>

        <div className="support-footer">
          <p className="support-footer-text">Need help with your order?</p>
          <p className="support-footer-info">admin@lovablecouple.shop · 0935 7314 280</p>
        </div>
      </div>
    </div>
  );
}

const MANUAL_PDF = "/lovable-reconnection-manual.pdf";

function BonusDownloadSection({ isThree }: { isThree: boolean }) {
  const [clicked, setClicked] = useState(false);

  const onDownload = () => {
    setClicked(true);
    // Force download via temporary anchor
    const a = document.createElement("a");
    a.href = MANUAL_PDF;
    a.download = "LOVABLE-Reconnection-Manual.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bonus-download-section">
      <span className="bonus-label">{isThree ? "Your Bonuses" : "Your Bonus"}</span>
      <h2 className="bonus-title">
        {isThree ? <>Two <em>exclusive</em> guides</> : <>The <em>Reconnection</em> Manual</>}
      </h2>
      <p className="bonus-subtitle">Available now for download.</p>

      <div className="bonus-cover-display">
        <img src={manualCover} alt="The Reconnection Manual cover" />
      </div>

      <button type="button" className="download-manual-btn" onClick={onDownload}>
        <Download size={14} strokeWidth={2.2} />
        <span>Download Manual (PDF)</span>
      </button>

      <p className="bonus-meta">
        {isThree
          ? "Two PDFs · Compatible with all devices · Lifetime access"
          : "PDF · Compatible with all devices · Lifetime access"}
      </p>

      {clicked && (
        <p className="download-success-message is-visible">
          ✓ Download started. Check your Downloads folder.
        </p>
      )}

      {isThree && (
        <p className="bonus-meta" style={{ marginTop: 12 }}>
          The Daily Ritual Companion is included with your manual download.
        </p>
      )}
    </div>
  );
}

function PageStyles() {
  return (
    <style>{`
      .thank-you-page {
        background: #0D0D0D;
        min-height: 100vh;
        min-height: 100dvh;
        padding: 80px 24px 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-family: 'Montserrat', sans-serif;
        color: #F2EAE0;
      }
      .thank-you-content { max-width: 520px; width: 100%; }
      .thank-you-logo { text-align: center; margin-bottom: 56px; }

      .success-badge {
        width: 72px; height: 72px; border-radius: 50%;
        background: rgba(220,38,39,0.08);
        border: 1.5px solid #DC2627;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 32px; position: relative;
        animation: badge-appear 700ms cubic-bezier(0.34,1.56,0.64,1);
      }
      .success-badge svg { width: 28px; height: 28px; color: #DC2627; }
      .success-badge::after {
        content: ''; position: absolute; inset: -6px;
        border-radius: 50%;
        border: 0.5px solid rgba(220,38,39,0.3);
        animation: pulse-ring 2.5s ease-in-out infinite;
      }
      @keyframes badge-appear {
        0% { opacity: 0; transform: scale(0.6); }
        60% { opacity: 1; transform: scale(1.08); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes pulse-ring {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.06); }
      }

      .thank-you-headline {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 36px; font-weight: 400; color: #F2EAE0;
        margin: 0 0 14px; line-height: 1.15;
        letter-spacing: -0.02em; text-align: center;
      }
      .thank-you-headline em { font-style: italic; color: #DC2627; }

      .thank-you-subhead {
        font-family: 'Playfair Display', Georgia, serif;
        font-style: italic; font-size: 16px;
        color: rgba(184,149,90,0.9);
        margin: 0 auto 48px; text-align: center;
        max-width: 400px; line-height: 1.5;
      }

      .order-reference {
        text-align: center; margin-bottom: 40px;
        padding: 16px 24px;
        background: rgba(184,149,90,0.04);
        border-top: 0.5px solid rgba(184,149,90,0.2);
        border-bottom: 0.5px solid rgba(184,149,90,0.2);
        width: 100%;
      }
      .order-reference-label {
        font-family: 'Montserrat', sans-serif;
        font-size: 9px; letter-spacing: 3px; color: #B8955A;
        text-transform: uppercase; margin: 0 0 6px;
      }
      .order-reference-id {
        font-family: 'Playfair Display', Georgia, serif;
        font-style: italic; font-size: 18px; color: #F2EAE0;
        margin: 0; letter-spacing: 1px;
      }

      .order-summary {
        width: 100%; margin-bottom: 40px; padding: 24px;
        background: #160808;
        border: 0.5px solid rgba(184,149,90,0.2);
        border-radius: 14px;
      }
      .summary-product {
        display: flex; gap: 14px; align-items: center;
        padding-bottom: 18px;
        border-bottom: 0.5px solid rgba(184,149,90,0.15);
        margin-bottom: 18px;
      }
      .summary-product-image {
        width: 56px; height: 56px; border-radius: 8px;
        background: #0D0D0D;
        border: 0.5px solid rgba(184,149,90,0.22);
        flex-shrink: 0; object-fit: cover;
      }
      .summary-product-info { flex: 1; min-width: 0; }
      .summary-product-name {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 15px; color: #F2EAE0;
        margin: 0 0 4px; line-height: 1.3;
      }
      .summary-product-name em { font-style: italic; color: #DC2627; }
      .summary-product-meta {
        font-size: 11px; color: rgba(154,136,128,0.85);
        margin: 0; letter-spacing: 0.5px;
      }
      .summary-product-price {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 16px; color: #F2EAE0; font-weight: 500; flex-shrink: 0;
      }
      .summary-prices {
        display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;
      }
      .summary-price-row {
        display: flex; justify-content: space-between; align-items: center; font-size: 13px;
      }
      .summary-price-row .label { color: rgba(154,136,128,0.95); }
      .summary-price-row .value { color: #F2EAE0; font-weight: 500; }
      .summary-price-row.shipping .value {
        color: #10B981; letter-spacing: 1px; font-size: 12px; font-weight: 600;
      }
      .summary-total {
        display: flex; justify-content: space-between; align-items: baseline;
        padding-top: 16px; border-top: 0.5px solid rgba(184,149,90,0.25);
      }
      .summary-total-label {
        font-family: 'Montserrat', sans-serif;
        font-size: 12px; letter-spacing: 2.5px;
        color: #F2EAE0; text-transform: uppercase; font-weight: 600;
      }
      .summary-total-value {
        font-family: 'Playfair Display', Georgia, serif;
        font-style: italic; font-size: 24px; color: #DC2627; font-weight: 500;
      }
      .summary-payment-method {
        text-align: center; margin-top: 14px; padding-top: 14px;
        border-top: 0.5px dashed rgba(184,149,90,0.18);
        font-size: 11px; color: rgba(154,136,128,0.85); font-style: italic;
      }

      .delivery-block {
        width: 100%; margin-bottom: 40px;
        padding: 18px 22px;
        background: rgba(184,149,90,0.04);
        border-left: 2px solid #B8955A;
        border-radius: 0 8px 8px 0;
      }
      .delivery-block-label {
        font-family: 'Montserrat', sans-serif;
        font-size: 9px; letter-spacing: 2.5px; color: #B8955A;
        text-transform: uppercase; margin: 0 0 8px;
      }
      .delivery-block-address {
        font-size: 13px; color: rgba(242,234,224,0.95);
        margin: 0; line-height: 1.6;
      }

      .expectations { width: 100%; margin-bottom: 48px; }
      .expectations-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 20px; color: #F2EAE0; font-weight: 400;
        margin: 0 0 24px; text-align: center;
      }
      .expectations-title em { font-style: italic; color: #B8955A; }
      .expectations-list {
        display: flex; flex-direction: column; gap: 18px;
        margin: 0; padding: 0; list-style: none;
      }
      .expectation-item {
        display: flex; gap: 16px; align-items: flex-start;
        padding: 16px 18px;
        background: #160808;
        border: 0.5px solid rgba(184,149,90,0.15);
        border-radius: 10px;
      }
      .expectation-number {
        font-family: 'Playfair Display', Georgia, serif;
        font-style: italic; color: #B8955A;
        font-size: 22px; line-height: 1; flex-shrink: 0; width: 28px;
      }
      .expectation-content { flex: 1; }
      .expectation-step-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 15px; color: #F2EAE0; font-weight: 400;
        margin: 0 0 4px; line-height: 1.3;
      }
      .expectation-step-desc {
        font-size: 12px; color: rgba(154,136,128,0.9);
        line-height: 1.5; margin: 0;
      }

      .thank-you-cta-section {
        width: 100%; display: flex; flex-direction: column;
        align-items: center; gap: 16px; margin-bottom: 32px;
      }
      .back-home-btn {
        width: 100%; max-width: 280px;
        padding: 16px 32px; background: transparent;
        border: 0.5px solid rgba(184,149,90,0.4); border-radius: 999px;
        color: rgba(242,234,224,0.9);
        font-family: 'Montserrat', sans-serif;
        font-size: 11px; letter-spacing: 2.5px; font-weight: 600;
        text-transform: uppercase; cursor: pointer;
        transition: all 250ms ease; text-decoration: none;
        display: flex; align-items: center; justify-content: center; gap: 8px;
      }
      .back-home-btn:hover {
        border-color: #DC2627; color: #DC2627; background: rgba(220,38,39,0.04);
      }
      .back-home-btn:active { transform: scale(0.98); }

      .support-footer {
        width: 100%; text-align: center;
        margin-top: 24px; padding-top: 24px;
        border-top: 0.5px solid rgba(184,149,90,0.12);
      }
      .support-footer-text {
        font-size: 11px; color: rgba(154,136,128,0.7);
        font-style: italic; margin: 0 0 6px;
      }
      .support-footer-info {
        font-size: 12px; color: #B8955A; margin: 0; letter-spacing: 0.5px;
      }

      @keyframes ty-fade-up {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .thank-you-content > * { animation: ty-fade-up 600ms ease-out backwards; }
      .thank-you-logo { animation-delay: 0ms; }
      .success-badge { animation-delay: 150ms; }
      .thank-you-headline { animation-delay: 300ms; }
      .thank-you-subhead { animation-delay: 450ms; }
      .order-reference { animation-delay: 600ms; }
      .order-summary { animation-delay: 750ms; }
      .delivery-block { animation-delay: 850ms; }
      .expectations { animation-delay: 950ms; }
      .thank-you-cta-section { animation-delay: 1100ms; }
      .support-footer { animation-delay: 1250ms; }

      @media (max-width: 768px) {
        .thank-you-page { padding: 32px 16px 32px; }
        .thank-you-content { max-width: 100%; }
        .thank-you-logo { margin-bottom: 24px; }
        .thank-you-logo img { height: 22px; }
        .success-badge { width: 56px; height: 56px; margin-bottom: 20px; }
        .success-badge svg { width: 22px; height: 22px; }
        .thank-you-headline { font-size: 26px; margin-bottom: 10px; }
        .thank-you-subhead { font-size: 13px; margin-bottom: 28px; max-width: 100%; padding: 0 8px; }
        .order-reference { margin-bottom: 24px; padding: 14px 20px; }
        .order-reference-label { font-size: 9px; margin-bottom: 4px; }
        .order-reference-id { font-size: 16px; }
        .order-summary { padding: 18px 16px; margin-bottom: 24px; }
        .summary-product { padding-bottom: 14px; margin-bottom: 14px; }
        .summary-product-image { width: 44px; height: 44px; }
        .summary-product-name { font-size: 13px; }
        .summary-product-meta { font-size: 10px; }
        .summary-product-price { font-size: 14px; }
        .summary-prices { gap: 8px; margin-bottom: 14px; }
        .summary-price-row { font-size: 12px; }
        .summary-total { padding-top: 12px; }
        .summary-total-label { font-size: 11px; letter-spacing: 2px; }
        .summary-total-value { font-size: 20px; }
        .summary-payment-method { margin-top: 12px; padding-top: 12px; font-size: 10px; }
        .delivery-block { margin-bottom: 24px; padding: 14px 16px; }
        .delivery-block-label { font-size: 9px; margin-bottom: 6px; }
        .delivery-block-address { font-size: 12px; line-height: 1.5; }
        .expectations { margin-bottom: 28px; }
        .expectations-title { font-size: 16px; margin-bottom: 14px; }
        .expectations-list { gap: 10px; }
        .expectation-item { padding: 12px 14px; gap: 10px; }
        .expectation-number { font-size: 16px; width: 20px; }
        .expectation-step-title { font-size: 13px; margin-bottom: 2px; }
        .expectation-step-desc { font-size: 11px; line-height: 1.4; }
        .back-home-btn { max-width: 100%; padding: 13px 24px; font-size: 10px; letter-spacing: 2px; }
        .support-footer { margin-top: 12px; padding-top: 16px; }
        .support-footer-text { font-size: 10px; margin-bottom: 4px; }
        .support-footer-info { font-size: 11px; line-height: 1.5; }

        .thank-you-content > * { animation-duration: 400ms; }
        .success-badge { animation-delay: 100ms; }
        .thank-you-headline { animation-delay: 200ms; }
        .thank-you-subhead { animation-delay: 280ms; }
        .order-reference { animation-delay: 360ms; }
        .order-summary { animation-delay: 440ms; }
        .delivery-block { animation-delay: 520ms; }
        .expectations { animation-delay: 600ms; }
        .thank-you-cta-section { animation-delay: 680ms; }
        .support-footer { animation-delay: 760ms; }
      }

      @media (max-width: 380px) {
        .thank-you-page { padding: 24px 12px 24px; }
        .thank-you-headline { font-size: 24px; }
        .thank-you-subhead { font-size: 12px; }
        .order-reference-id { font-size: 15px; }
        .summary-product-image { width: 40px; height: 40px; }
        .summary-product-name { font-size: 12px; }
        .summary-total-value { font-size: 18px; }
        .expectations-title { font-size: 15px; }
        .bonus-download-section { padding: 24px 16px; margin: 24px 0; }
        .bonus-title { font-size: 22px; }
        .bonus-subtitle { font-size: 12px; }
        .bonus-cover-display { width: 120px; height: 165px; }
        .download-manual-btn { padding: 14px 24px; font-size: 11px; letter-spacing: 1.5px; width: 100%; max-width: 280px; justify-content: center; }
        .bonus-meta { font-size: 10px; }
      }

      /* Bonus download section */
      .bonus-download-section {
        margin: 32px 0;
        padding: 32px 24px;
        background: linear-gradient(180deg, #1F1010 0%, #1A0E0E 100%);
        border: 1px solid rgba(184, 149, 90, 0.4);
        border-radius: 16px;
        text-align: center;
        box-shadow:
          0 1px 0 rgba(242, 234, 224, 0.1) inset,
          0 12px 32px rgba(0, 0, 0, 0.5),
          0 0 64px rgba(184, 149, 90, 0.08);
        animation: ty-fade-up 800ms cubic-bezier(0.4,0,0.2,1) both;
        animation-delay: 900ms;
      }
      .bonus-label {
        font-family: 'Montserrat', sans-serif;
        font-size: 9px;
        letter-spacing: 3px;
        color: #C9A06D;
        text-transform: uppercase;
        display: block;
        margin-bottom: 8px;
      }
      .bonus-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 28px;
        color: #F2EAE0;
        margin: 0 0 6px;
        font-weight: 400;
        line-height: 1.2;
      }
      .bonus-title em {
        font-style: italic;
        color: #DC2627;
      }
      .bonus-subtitle {
        font-size: 13px;
        color: rgba(184, 149, 90, 0.85);
        font-style: italic;
        margin: 0 0 24px;
      }
      .bonus-cover-display {
        width: 160px;
        height: 220px;
        margin: 24px auto;
        background: #0D0606;
        border-radius: 8px;
        border: 0.5px solid rgba(184, 149, 90, 0.3);
        box-shadow:
          0 12px 32px rgba(0, 0, 0, 0.6),
          0 24px 56px rgba(0, 0, 0, 0.4);
        overflow: hidden;
      }
      .bonus-cover-display img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .download-manual-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 16px 32px;
        background: linear-gradient(135deg, #FF3F40, #DC2627);
        border: none;
        border-radius: 999px;
        color: #F2EAE0;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        letter-spacing: 2px;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        margin-top: 16px;
        box-shadow:
          0 8px 24px rgba(220, 38, 39, 0.4),
          0 0 32px rgba(220, 38, 39, 0.15);
        transition: all 250ms ease;
      }
      .download-manual-btn:hover {
        transform: translateY(-2px);
        box-shadow:
          0 12px 32px rgba(220, 38, 39, 0.5),
          0 0 48px rgba(220, 38, 39, 0.2);
      }
      .bonus-meta {
        font-size: 11px;
        color: rgba(154, 136, 128, 0.8);
        font-style: italic;
        margin: 16px 0 0;
        letter-spacing: 0.3px;
      }
      .download-success-message {
        margin-top: 16px;
        padding: 12px 16px;
        background: rgba(31, 187, 123, 0.1);
        border: 0.5px solid rgba(31, 187, 123, 0.4);
        border-radius: 8px;
        color: #1FBB7B;
        font-size: 12px;
        font-style: italic;
      }
    `}</style>
  );
}
