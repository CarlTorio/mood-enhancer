import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Truck, ShieldCheck, Droplet } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SocialProofToast } from "@/components/SocialProofToast";
import { StickyUrgencyBar } from "@/components/StickyUrgencyBar";
import { Reveal } from "@/components/Reveal";
import { setShopState, type ShopVariant } from "@/lib/shop-store";
import { BundleBonusIndicator, BundleIncludesSection } from "@/components/shop/BundleBonus";

import hero from "@/assets/hero.jpg";
const forher = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/12%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMiAoMSkucG5nIiwiaWF0IjoxNzc3MTMyNzg2LCJleHAiOjE4MDg2Njg3ODZ9.B-AMqN_dXsCpMyXZQlOCFNt-OQtx30ikTNBNvzfd9Kk";
const forhim = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/8.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy84LnBuZyIsImlhdCI6MTc3NzEzMjk5NSwiZXhwIjoxODA4NjY4OTk1fQ.1Ze3vH74IZ_9etm09fJzNhJiP9aT2RlVjrb5rirLhIw";
const bottleHer = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/Vitamin%20B6%20(3).png";
const bottleHim = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/Maca%20root%20(2).png";
const herThumb1 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Magnesium%20Glycinate%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9NYWduZXNpdW0gR2x5Y2luYXRlICgzKS5wbmciLCJpYXQiOjE3NzcxODQyMzksImV4cCI6MTgwODcyMDIzOX0.UkaaTJxm0FjIOST6dsKRBcAPLdSKKpwLAGpyX6YHhrY";
const herThumb2 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/Taurine%20(3).png";
const himThumb1 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/Tongkat%20Ali%20(2).png";
const himThumb2 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/Panax%20Ginseng%20(2).png";

const BOTTLE_HER_URL =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/12.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMi5wbmciLCJpYXQiOjE3NzcwODkxODksImV4cCI6MTgwODYyNTE4OX0.lwk9AUb9CE31IDWqJDTuZOZtmes59bZ4FO-lUxOVd4s";
const BOTTLE_HIM_URL =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/11.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMS5wbmciLCJpYXQiOjE3NzcwODkyNTksImV4cCI6MTgwODYyNTI1OX0.K5QMIKYRD65B8p2BagU6a3SVO0gCmuwFYS78qwdHmPU";

type Variant = ShopVariant;

type ShopSearch = { variant?: Variant };

const META_BY_VARIANT: Record<Variant, { title: string; description: string }> = {
  her: {
    title: "LOVABLE For Her | Mood Enhancer Drops for Women",
    description: "Support natural arousal and intimate wellness. Premium botanicals for women, formulated by hormonal wellness experts.",
  },
  him: {
    title: "LOVABLE For Him | Mood Enhancer Drops for Men",
    description: "Support stamina, focus, and confidence. Premium botanicals for men, formulated by hormonal wellness experts.",
  },
  couples: {
    title: "LOVABLE Couples Bundle | Sync Your Intimacy",
    description: "For couples na pareho ng goal. Synced formulas for Her and Him, designed to be taken together. Free shipping + 30-day guarantee.",
  },
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const v = search.variant;
    if (v === "her" || v === "him" || v === "couples") return { variant: v };
    return {};
  },
  loaderDeps: ({ search }: { search: ShopSearch }) => ({ variant: search.variant ?? "her" as Variant }),
  loader: ({ deps }) => ({ variant: deps.variant }),
  head: ({ loaderData }) => {
    const v: Variant = (loaderData?.variant as Variant) ?? "her";
    const meta = META_BY_VARIANT[v];
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
    };
  },
  component: ShopPage,
});

type Bundle = {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  supply: string;
  perDay: number;
  savePercent?: number;
  badge?: "BEST SELLER" | "BEST VALUE";
};

const herBundles: Bundle[] = [
  { id: "1", label: "1 Bottle", price: 599, originalPrice: 599, supply: "30-day supply", perDay: 20 },
  { id: "2", label: "2 Bottles", price: 899, originalPrice: 1198, supply: "60-day supply", perDay: 15, savePercent: 25, badge: "BEST SELLER" },
  { id: "3", label: "3 Bottles", price: 1199, originalPrice: 1797, supply: "90-day supply", perDay: 13, savePercent: 33, badge: "BEST VALUE" },
];

const himBundles: Bundle[] = [
  { id: "1", label: "1 Bottle", price: 599, originalPrice: 599, supply: "30-day supply", perDay: 20 },
  { id: "2", label: "2 Bottles", price: 899, originalPrice: 1198, supply: "60-day supply", perDay: 15, savePercent: 25, badge: "BEST SELLER" },
  { id: "3", label: "3 Bottles", price: 1199, originalPrice: 1797, supply: "90-day supply", perDay: 13, savePercent: 33, badge: "BEST VALUE" },
];

const couplesBundles: Bundle[] = [
  { id: "1", label: "1 Bottle Men + 1 Bottle Women", price: 899, originalPrice: 3596, supply: "30-day supply", perDay: 30 },
  { id: "2", label: "2 Bottles Men + 2 Bottles Women", price: 1476, originalPrice: 7196, supply: "60-day supply", perDay: 25, savePercent: 22, badge: "BEST SELLER" },
];

function ShopPage() {
  const search = Route.useSearch();
  const variant: Variant = search.variant ?? "her";

  return (
    <div className="min-h-screen bg-[var(--color-noir)] text-[var(--color-ivory)]">
      <AnnouncementBar />
      <Navbar />
      <main>
        <ProductTabs initial={variant} />
        <TrustAssurance />
        <HowToOrder />
        <MobileTestimonials />
        <ComprehensiveFAQ />
        <FinalShopCTA />
      </main>
      <Footer />
      <SocialProofToast />
      <StickyUrgencyBar />
    </div>
  );
}

function ShopHero() {
  return (
    <section className="relative min-h-[45svh] flex items-center justify-center overflow-hidden">
      <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "blur(2px)" }} />
      <div className="absolute inset-0 bg-[var(--color-noir)]/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-noir)]/40 via-transparent to-[var(--color-noir)]" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center py-20">
        <Reveal>
          <p className="eyebrow mb-5">Choose Your LOVABLE</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-display text-[var(--color-ivory)] text-3xl sm:text-4xl md:text-[48px] leading-[1.1]">
            Start Your Journey <span style={{ color: "#A81716", fontStyle: "italic" }}>Back to Each Other</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 text-[var(--color-ivory)]/75 text-base sm:text-lg max-w-xl mx-auto">
            Natural. Powerful. Built for real couples.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

type VariantConfig = {
  eyebrow: string;
  title: React.ReactNode;
  rating: string;
  reviews: string;
  description: React.ReactNode;
  mainImage: string;
  thumbnails: string[];
  bundles: Bundle[];
  bottleImage: string;
};

const COUPLES_IMG_1 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2029,%202026,%2011_46_31%20PM.png";
const COUPLES_IMG_2 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2028,%202026,%2001_47_05%20AM%20(1).png";
const COUPLES_IMG_3 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2028,%202026,%2002_19_52%20AM%20(1).png";
const COUPLES_IMG_4 = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2029,%202026,%2004_28_13%20PM.png";

function getVariantConfig(v: Variant): VariantConfig {
  if (v === "her") {
    return {
      eyebrow: "LOVABLE Drops For Her",
      title: <>LOVABLE <span style={{ color: "#A81716", fontStyle: "italic" }}>For Women</span></>,
      rating: "4.9",
      reviews: "1,200+",
      description: <>Supports natural arousal, <span style={{ color: "#F2EAE0", fontWeight: 600 }}>mood balance, and intimate wellness</span>, safely and naturally.</>,
      mainImage: forher,
      thumbnails: [forher, herThumb1, herThumb2, bottleHer],
      bundles: herBundles,
      bottleImage: BOTTLE_HER_URL,
    };
  }
  if (v === "him") {
    return {
      eyebrow: "LOVABLE Drops For Him",
      title: <>LOVABLE <span style={{ color: "#A81716", fontStyle: "italic" }}>For Men</span></>,
      rating: "4.8",
      reviews: "980+",
      description: <>Supports natural stamina, mental focus, and the <span style={{ color: "#F2EAE0", fontWeight: 600 }}>quiet confidence that brings her closer to you</span>.</>,
      mainImage: forhim,
      thumbnails: [forhim, himThumb1, himThumb2, bottleHim],
      bundles: himBundles,
      bottleImage: BOTTLE_HIM_URL,
    };
  }
  return {
    eyebrow: "LOVABLE Couples Bundle",
    title: <>The Complete <span style={{ color: "#A81716", fontStyle: "italic" }}>Couples Bundle</span></>,
    rating: "4.9",
    reviews: "2,000+",
    description: <>For couples na pareho ng goal: <span style={{ color: "#F2EAE0", fontWeight: 600 }}>bumalik sa kung sino kayo dati</span>. Synced formulas, designed to be taken together.</>,
    mainImage: COUPLES_IMG_1,
    thumbnails: [COUPLES_IMG_1, COUPLES_IMG_2, COUPLES_IMG_3, COUPLES_IMG_4],
    bundles: couplesBundles,
    bottleImage: BOTTLE_HER_URL,
  };
}

function VenusIcon({ active }: { active: boolean }) {
  const c = active ? "#F2EAE0" : "#B8955A";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v8M9 19h6" />
    </svg>
  );
}
function MarsIcon({ active }: { active: boolean }) {
  const c = active ? "#F2EAE0" : "#B8955A";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="14" r="5" />
      <path d="M14 10l6-6M15 4h5v5" />
    </svg>
  );
}
function HeartIcon({ active }: { active: boolean }) {
  const c = active ? "#F2EAE0" : "#B8955A";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.2">
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}

function SectionHeader({ num, label }: { num: number; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span
        style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "linear-gradient(135deg, #DC2627, #C61F20)",
          color: "#F2EAE0",
          fontFamily: '"Playfair Display", Georgia, serif',
          fontStyle: "italic", fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 1px 0 rgba(242,234,224,0.2) inset, 0 4px 10px rgba(220,38,39,0.35)",
        }}
      >
        {num}
      </span>
      <span
        style={{
          fontFamily: "Montserrat, sans-serif", fontSize: 11, letterSpacing: 2.5,
          textTransform: "uppercase", color: "#F2EAE0", fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ProductTabs({ initial }: { initial: Variant }) {
  const [tab, setTab] = useState<Variant>(initial);

  useEffect(() => { setTab(initial); }, [initial]);

  const handleTabClick = (id: Variant) => {
    setTab(id);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        const target = document.querySelector(".product-display") as HTMLElement | null;
        if (target) {
          const rect = target.getBoundingClientRect();
          const top = rect.top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    }
  };

  return (
    <section className="bg-[var(--color-noir)] pt-6 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 product-display">
        <ProductDetail key={tab} variant={tab} setTab={handleTabClick} />
      </div>
    </section>
  );
}


function BottleStack({ src, count }: { src: string; count: number }) {
  const items = Array.from({ length: Math.max(1, Math.min(count, 3)) });
  return (
    <div className="relative flex-shrink-0 h-[65px] w-[88px] flex items-center justify-center">
      {items.map((_, i) => {
        const offset = (i - (items.length - 1) / 2) * 16;
        const z = items.length - i;
        return (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            aria-hidden={i > 0}
            className="absolute h-[65px] w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            style={{ transform: `translateX(${offset}px)`, zIndex: z }}
          />
        );
      })}
    </div>
  );
}

function ProductDetail({ variant, setTab }: { variant: Variant; setTab: (v: Variant) => void }) {
  const cfg = getVariantConfig(variant);
  const { eyebrow, title, rating, reviews, description, mainImage, thumbnails, bundles, bottleImage } = cfg;

  const [active, setActive] = useState(mainImage);
  const defaultBundle = bundles.find((b) => b.badge === "BEST SELLER") ?? bundles[0];
  const [selected, setSelected] = useState<string>(defaultBundle.id);

  useEffect(() => {
    setActive(mainImage);
    setSelected(defaultBundle.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const selectedBundle = bundles.find((b) => b.id === selected) ?? defaultBundle;

  useEffect(() => {
    setShopState({ variant, price: selectedBundle.price, bundleLabel: selectedBundle.label });
  }, [variant, selectedBundle.price, selectedBundle.label]);

  const variantTabs: { id: Variant; label: string; Icon: typeof VenusIcon }[] = [
    { id: "her", label: "FOR HER", Icon: VenusIcon },
    { id: "him", label: "FOR HIM", Icon: MarsIcon },
    { id: "couples", label: "COUPLES", Icon: HeartIcon },
  ];

  return (
    <>
      <style>{`
        .lvb-variant-container {
          display: flex;
          background: #1A0E0E;
          border: 0.5px solid rgba(184, 149, 90, 0.3);
          border-radius: 14px;
          padding: 6px;
          gap: 4px;
          margin-bottom: 28px;
          box-shadow: 0 1px 0 rgba(242,234,224,0.05) inset, 0 8px 24px rgba(0,0,0,0.3);
        }
        .lvb-variant-pill {
          flex: 1;
          padding: 14px 6px;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          color: rgba(242, 234, 224, 0.7);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
        }
        @media (min-width: 640px) { .lvb-variant-pill { padding: 16px 8px; font-size: 12px; } }
        .lvb-variant-pill:hover:not(.active) { background: rgba(184,149,90,0.06); color: #F2EAE0; }
        .lvb-variant-pill.active {
          background: linear-gradient(135deg, #DC2627, #C61F20);
          color: #F2EAE0;
          box-shadow: 0 1px 0 rgba(242,234,224,0.2) inset, 0 6px 14px rgba(220,38,39,0.4);
        }
        .lvb-section-divider {
          width: 100%;
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(184,149,90,0.25) 30%, rgba(184,149,90,0.25) 70%, transparent);
          margin: 28px 0;
        }
        .lvb-bundle-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #160808;
          border: 0.5px solid rgba(184,149,90,0.25);
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 300ms cubic-bezier(0.4,0,0.2,1);
        }
        @media (min-width: 640px) { .lvb-bundle-card { padding: 18px 20px; gap: 16px; } }
        .lvb-bundle-card:hover:not(.selected) {
          border-color: rgba(184,149,90,0.5);
          background: #1A0E0E;
        }
        .lvb-bundle-card.selected {
          border: 1px solid #DC2627;
          background: rgba(220,38,39,0.06);
          box-shadow: 0 1px 0 rgba(242,234,224,0.06) inset, 0 8px 24px rgba(220,38,39,0.2), 0 0 0 4px rgba(220,38,39,0.08);
        }
        .lvb-bundle-radio {
          width: 22px; height: 22px; border-radius: 50%;
          border: 1.5px solid rgba(184,149,90,0.5);
          flex-shrink: 0; position: relative;
          transition: all 250ms ease;
        }
        .lvb-bundle-card.selected .lvb-bundle-radio { border-color: #DC2627; background: #DC2627; }
        .lvb-bundle-card.selected .lvb-bundle-radio::after {
          content: ''; position: absolute; inset: 4px; background: #F2EAE0; border-radius: 50%;
        }
        .lvb-checkout-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #FF3F40, #DC2627);
          border: none;
          border-radius: 999px;
          color: #F2EAE0;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          box-shadow: 0 1px 0 rgba(242,234,224,0.2) inset, 0 8px 24px rgba(220,38,39,0.45), 0 16px 40px rgba(0,0,0,0.4), 0 0 32px rgba(220,38,39,0.1);
          transition: all 300ms cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }
        @media (min-width: 640px) { .lvb-checkout-btn { padding: 18px 32px; font-size: 14px; letter-spacing: 3px; } }
        .lvb-checkout-btn:hover { transform: translateY(-2px); }
        .lvb-trust-pills {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px;
        }
        .lvb-trust-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          background: rgba(184,149,90,0.06);
          border: 0.5px solid rgba(184,149,90,0.3);
          border-radius: 999px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.5px;
          color: rgba(242,234,224,0.85);
          white-space: nowrap;
        }
        @media (min-width: 640px) { .lvb-trust-pill { font-size: 11px; padding: 8px 14px; } }
      `}</style>
      <div className="grid gap-6 md:gap-8 lg:gap-12 lg:grid-cols-2 items-start">
        {/* LEFT */}
        <Reveal>
          <div
            className="relative w-full overflow-hidden group lift-image lift-halo"
            style={{ aspectRatio: "1 / 1", border: "0.5px solid rgba(184,149,90,0.22)", background: "transparent" }}
          >
            <img
              src={active}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full block object-cover"
              style={{ objectPosition: variant === "couples" ? "center 35%" : "center 30%" }}
            />
            <GalleryArrows images={thumbnails} active={active} setActive={setActive} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {thumbnails.slice(1, 4).map((thumb, i) => (
              <button
                key={i}
                onClick={() => setActive(thumb)}
                className={`aspect-square rounded-xl overflow-hidden ring-1 transition-all ${
                  active === thumb ? "ring-[var(--color-brand-red)]" : "ring-white/10 hover:ring-white/30"
                }`}
              >
                <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </Reveal>

        {/* RIGHT */}
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-display text-[var(--color-ivory)] text-[28px] md:text-[36px] leading-[1.15]">
            {title}
          </h2>
          <div className="mt-3 flex items-center gap-3 text-sm text-[var(--color-ivory)]/85">
            <span className="text-[var(--color-gold)] tracking-wider">★★★★★</span>
            <span>{rating} · {reviews} reviews</span>
          </div>
          <p className="mt-4 mb-7 text-[var(--color-ivory-muted)] text-[15px] leading-[1.7]">
            {description}
          </p>

          {/* SECTION 1 */}
          <SectionHeader num={1} label="PICK YOUR VARIANT" />
          <div className="lvb-variant-container">
            {variantTabs.map((t) => {
              const isActive = variant === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`lvb-variant-pill ${isActive ? "active" : ""}`}
                  aria-pressed={isActive}
                >
                  <t.Icon active={isActive} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="lvb-section-divider" />

          {/* SECTION 2 */}
          <SectionHeader num={2} label="CHOOSE YOUR BUNDLE" />
          <div className="flex flex-col gap-2.5 mb-7">
            {bundles.map((b) => {
              const isSelected = selected === b.id;
              return (
                <div key={b.id} className="relative">
                  {b.savePercent && (
                    <div
                      style={{
                        position: "absolute", top: -8, right: 16, zIndex: 2,
                        padding: "4px 10px",
                        background: "#0D0606",
                        border: "0.5px solid #B8955A",
                        borderRadius: 999,
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 9,
                        letterSpacing: 1.5,
                        color: "#B8955A",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span style={{ color: "#B8955A" }}>★</span> SAVE {b.savePercent}%
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelected(b.id)}
                    className={`lvb-bundle-card ${isSelected ? "selected" : ""}`}
                  >
                    <span className="lvb-bundle-radio" />
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          color: "#F2EAE0", fontWeight: 400,
                          lineHeight: 1.2,
                        }}
                        className="text-[14px] sm:text-[16px]"
                      >
                        {b.label}
                      </div>
                      <div className="mt-1 flex items-center gap-2 flex-wrap text-[10px] sm:text-[11px]">
                        {b.originalPrice > b.price && (
                          <span style={{ color: "rgba(154,136,128,0.65)", textDecoration: "line-through" }}>
                            ₱{b.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span style={{ color: "rgba(154,136,128,0.85)" }}>{b.supply}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <div
                        style={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          fontStyle: "italic",
                          color: "#DC2627",
                          fontWeight: 500,
                          lineHeight: 1,
                        }}
                        className="text-[19px] sm:text-[22px]"
                      >
                        ₱{b.price.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 10,
                          color: "rgba(184,149,90,0.85)",
                          fontStyle: "italic",
                          textDecoration: b.originalPrice > b.price ? "line-through" : "none",
                        }}
                      >
                        ₱{b.perDay}/day
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <p
            style={{
              margin: "4px 0 16px",
              fontFamily: "Montserrat, sans-serif",
              fontStyle: "italic",
              fontSize: 9,
              color: "rgba(154,136,128,0.5)",
              textAlign: "center",
              letterSpacing: 0.3,
              lineHeight: 1.4,
            }}
          >
            Strikethrough prices indicate suggested retail price. Actual savings may vary based on individual product purchase price.
          </p>

          {/* What's included (bonus + product) for tiers 2/3 */}
          {selectedBundle.id !== "1" && (
            <BundleIncludesSection
              productImage={bottleImage}
              productName={`${variant === "couples" ? "LOVABLE Couples Bundle" : `LOVABLE for ${variant === "her" ? "Her" : "Him"}`} — ${selectedBundle.label}`}
              tier={selectedBundle.id as "2" | "3"}
            />
          )}

          {/* CHECK OUT */}
          <Link
            to="/checkout"
            search={{ variant, bundle: (selectedBundle.id as "1" | "2" | "3") }}
            className="lvb-checkout-btn btn-shine mt-6"
          >
            <span>CHECK OUT</span>
            <span aria-hidden>🛒</span>
          </Link>

          {/* Trust pills */}
          <div className="lvb-trust-pills">
            <span className="lvb-trust-pill"><span style={{ color: "#B8955A" }}>💵</span> COD Available</span>
            <span className="lvb-trust-pill"><span style={{ color: "#B8955A" }}>↻</span> 30-Day Money-Back</span>
            <span className="lvb-trust-pill"><span style={{ color: "#B8955A" }}>⚕</span> Doctor-Formulated</span>
          </div>

          {variant === "couples" && <WhatsInsideCard />}
        </Reveal>
      </div>
    </>
  );
}


function GalleryArrows({
  images,
  active,
  setActive,
}: {
  images: string[];
  active: string;
  setActive: (s: string) => void;
}) {
  const idx = Math.max(0, images.indexOf(active));
  const go = (dir: -1 | 1) => {
    const next = (idx + dir + images.length) % images.length;
    setActive(images[next]);
  };
  const btn =
    "absolute top-1/2 -translate-y-1/2 z-[5] h-10 w-10 rounded-full flex items-center justify-center transition-all duration-[250ms] text-[#B8955A] hover:text-[#DC2627] hover:scale-[1.08]";
  const arrowStyle: React.CSSProperties = {
    background: "rgba(13, 13, 13, 0.7)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "0.5px solid rgba(184, 149, 90, 0.4)",
  };
  return (
    <>
      <button
        type="button"
        aria-label="Previous image"
        onClick={() => go(-1)}
        className={`${btn} left-4`}
        style={arrowStyle}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={() => go(1)}
        className={`${btn} right-4`}
        style={arrowStyle}
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
}

function MiniFaq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.08]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[var(--color-ivory)] text-[15px] font-medium">{q}</span>
        <Plus
          size={18}
          className={`text-[var(--color-brand-red)] transition-transform ${open ? "rotate-45" : ""}`}
        />
      </button>
      {open && <p className="pb-4 pr-8 text-[14px] text-[var(--color-ivory-muted)] leading-relaxed">{a}</p>}
    </div>
  );
}


function WhatsInsideCard() {
  const items: {
    icon: React.ReactNode;
    title: string;
    sub: string;
    free?: boolean;
  }[] = [
    {
      icon: <Droplet size={22} className="text-[#B8955A]" strokeWidth={1.4} style={{ transform: "rotate(-8deg)" }} />,
      title: "LOVABLE For Her",
      sub: "30ml · 1-month supply",
    },
    {
      icon: <Droplet size={22} className="text-[#B8955A]" strokeWidth={1.4} style={{ transform: "rotate(8deg)" }} />,
      title: "LOVABLE For Him",
      sub: "30ml · 1-month supply",
    },
    {
      icon: <Truck size={22} className="text-[#B8955A]" strokeWidth={1.4} />,
      title: "FREE Nationwide Shipping",
      sub: "Discreet packaging via J&T, Ninja Van, or Flash",
    },
    {
      icon: <ShieldCheck size={22} className="text-[#B8955A]" strokeWidth={1.4} />,
      title: "30-Day Money-Back Guarantee",
      sub: "Full refund. No questions asked.",
    },
  ];

  return (
    <div
      className="mt-7 rounded-2xl p-6 md:p-7"
      style={{
        background: "linear-gradient(180deg, #1A0A0A 0%, #110707 100%)",
        border: "0.5px solid rgba(184, 149, 90, 0.3)",
        boxShadow: "0 1px 0 rgba(242,234,224,0.05) inset, 0 16px 36px rgba(0,0,0,0.4)",
      }}
    >
      <h3
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 11,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#B8955A",
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        What's Inside the Bundle
      </h3>
      <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((it, i) => (
          <li
            key={it.title}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              paddingBottom: i === items.length - 1 ? 0 : 16,
              borderBottom: i === items.length - 1 ? "none" : "0.5px solid rgba(184, 149, 90, 0.15)",
            }}
          >
            <span style={{ flexShrink: 0, marginTop: 2 }}>{it.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: 14,
                    color: "#F2EAE0",
                    fontWeight: 500,
                  }}
                >
                  {it.title}
                </span>
                {it.free && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "rgba(184, 149, 90, 0.15)",
                      border: "0.5px solid rgba(184, 149, 90, 0.4)",
                      color: "#B8955A",
                      fontSize: 9,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 999,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#DC2627" }} />
                    Free
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  color: "rgba(154, 136, 128, 0.85)",
                  marginTop: 3,
                  lineHeight: 1.5,
                }}
              >
                {it.sub}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "0.5px solid rgba(184, 149, 90, 0.3)",
          fontFamily: "Montserrat, sans-serif",
          fontStyle: "italic",
          fontSize: 12,
          color: "#B8955A",
          textAlign: "center",
        }}
      >
        You save ₱398 vs buying separately.
      </div>
    </div>
  );
}

function TrustAssurance() {
  const items = [
    {
      num: "01",
      head: "Try it",
      accent: "risk-free",
      desc: "30-day full refund. No questions, no awkwardness.",
    },
    {
      num: "02",
      head: "Shipped",
      accent: "discreetly",
      desc: "Plain unmarked packaging via J&T, Ninja Van, or Flash.",
    },
    {
      num: "03",
      head: "Backed by",
      accent: "the FDA",
      desc: "FDA-registered, GMP-certified USA facility.",
    },
  ];

  return (
    <section className="bg-[#0D0D0D] py-[40px] md:py-[60px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <p
          className="text-center mb-8"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#B8955A",
          }}
        >
          Why Couples Trust LOVABLE
        </p>
        <div className="mx-auto max-w-[900px] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 py-6">
          {items.map((it, i) => (
            <Reveal key={it.num} delay={i * 0.08}>
              <div className="trust-item h-full">
                <span className="trust-num">{it.num}</span>
                <h3 className="trust-head">
                  {it.head}{" "}
                  <span className="trust-accent">{it.accent}</span>
                </h3>
                <p className="trust-desc">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        .trust-item {
          padding: 0 0 0 20px;
          border-left: 1px solid rgba(184, 149, 90, 0.3);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .trust-item:hover {
          padding-left: 24px;
          border-left: 2px solid rgba(220, 38, 39, 0.5);
        }
        .trust-item:hover .trust-num { color: #D4B27A; }
        .trust-num {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          color: #B8955A;
          font-size: 13px;
          letter-spacing: 2px;
          margin-bottom: 8px;
          transition: color 300ms ease;
        }
        .trust-head {
          font-family: 'Playfair Display', Georgia, serif;
          color: #F2EAE0;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.3;
          margin-bottom: 6px;
        }
        .trust-accent {
          color: #DC2627;
          font-style: italic;
        }
        .trust-desc {
          font-family: 'Montserrat', sans-serif;
          color: rgba(154, 136, 128, 0.85);
          font-size: 12px;
          line-height: 1.5;
          margin: 0;
        }
        @media (max-width: 767px) {
          .trust-item { border-left-width: 2px; }
        }
      `}</style>
    </section>
  );
}

function HowToOrder() {
  const steps = [
    {
      n: "01",
      titleBefore: "Half a dropper, ",
      accent: "sublingual",
      titleAfter: ".",
      desc: "Place half a dropper (about 0.5 ml) under your tongue. Hold for 30 seconds before swallowing for best absorption.",
    },
    {
      n: "02",
      titleBefore: "Once or twice ",
      accent: "daily",
      titleAfter: ".",
      desc: "Take in the morning to start your day, or about 30 minutes before intimacy. Pick the rhythm that fits your day.",
    },
    {
      n: "03",
      titleBefore: "Stay ",
      accent: "consistent",
      titleAfter: ".",
      desc: "Effects build gradually over 2 to 3 weeks. Most couples feel a noticeable shift by week 2. The longer you stay on, the deeper the effect.",
    },
  ];

  return (
    <section className="howuse-section">
      <div className="howuse-container">
        <Reveal>
          <div className="howuse-header">
            <p className="howuse-eyebrow">HOW TO USE LOVABLE</p>
            <h2 className="howuse-headline">
              Simple as <span className="howuse-headline-accent">one drop a day.</span>
            </h2>
            <p className="howuse-subtitle">No prep, no rituals. Just consistency.</p>
          </div>
        </Reveal>

        <div className="howuse-grid">
          <Reveal delay={0.2} className="howuse-anchor-wrap">
            <div className="howuse-anchor">
              <div className="howuse-bottles">
                <img
                  src={BOTTLE_HIM_URL}
                  alt="LOVABLE For Him bottle"
                  className="howuse-bottle howuse-bottle-him"
                  loading="lazy"
                />
                <img
                  src={BOTTLE_HER_URL}
                  alt="LOVABLE For Her bottle"
                  className="howuse-bottle howuse-bottle-her"
                  loading="lazy"
                />
              </div>
              <p className="howuse-dose">0.5 ml</p>
              <p className="howuse-dose-unit">PER DROP</p>
              <span className="howuse-divider" />
              <p className="howuse-dose-detail">
                Half a dropper sublingually. 1 to 2 times daily. Effects build over 2 to 3 weeks.
              </p>
            </div>
          </Reveal>

          <div className="howuse-steps">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={0.3 + i * 0.1}>
                <div className="howuse-step">
                  <div className="howuse-step-num">{s.n}</div>
                  <div>
                    <h3 className="howuse-step-title">
                      {s.titleBefore}
                      <em className="howuse-step-accent">{s.accent}</em>
                      {s.titleAfter}
                    </h3>
                    <p className="howuse-step-desc">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.7}>
          <div className="howuse-tip">
            <span className="howuse-tip-icon">i</span>
            <p className="howuse-tip-text">
              For best results, take LOVABLE on an empty stomach or 30 minutes before meals. Store in a cool, dry place.
            </p>
          </div>
        </Reveal>
      </div>

      <style>{`
        .howuse-section {
          background: #160808;
          padding: 100px 0;
        }
        .howuse-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .howuse-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .howuse-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #DC2627;
          margin: 0 0 20px;
          font-weight: 600;
        }
        .howuse-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 36px;
          color: #F2EAE0;
          margin: 0 0 16px;
          font-weight: 500;
          line-height: 1.15;
        }
        .howuse-headline-accent {
          font-style: italic;
          color: #B8955A;
        }
        .howuse-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #9A8880;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .howuse-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 48px;
          max-width: 960px;
          margin: 0 auto;
          align-items: start;
        }
        .howuse-anchor-wrap {
          position: sticky;
          top: 80px;
        }
        .howuse-anchor {
          position: relative;
          background: linear-gradient(180deg, #1F0F0C 0%, #0D0606 100%);
          border: 0.5px solid rgba(184, 149, 90, 0.3);
          border-radius: 14px;
          padding: 36px 24px;
          text-align: center;
          box-shadow:
            0 1px 0 rgba(242, 234, 224, 0.06) inset,
            0 16px 48px rgba(0, 0, 0, 0.5);
        }
        .howuse-bottles {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 0;
          margin: 0 auto 24px;
          width: 250px;
        }
        .howuse-bottles::before {
          content: '';
          position: absolute;
          inset: -10% -10% -10% -10%;
          background: radial-gradient(circle, rgba(220, 38, 39, 0.18) 0%, transparent 60%);
          filter: blur(20px);
          z-index: 0;
          pointer-events: none;
        }
        .howuse-bottle {
          width: 120px;
          height: auto;
          position: relative;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5))
                  drop-shadow(0 4px 8px rgba(220, 38, 39, 0.15));
        }
        .howuse-bottle-him {
          transform: rotate(-4deg);
          z-index: 1;
          margin-right: -20px;
        }
        .howuse-bottle-her {
          transform: rotate(4deg);
          z-index: 2;
        }
        .howuse-dose {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          color: #F2EAE0;
          font-size: 36px;
          font-weight: 400;
          line-height: 1;
          margin: 0;
        }
        .howuse-dose-unit {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #B8955A;
          margin: 8px 0 0;
        }
        .howuse-divider {
          display: block;
          width: 30px;
          height: 0.5px;
          background: rgba(184, 149, 90, 0.5);
          margin: 18px auto;
        }
        .howuse-dose-detail {
          font-family: 'Montserrat', sans-serif;
          font-style: italic;
          font-size: 11px;
          color: rgba(154, 136, 128, 0.85);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 220px;
        }
        .howuse-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .howuse-step {
          display: grid;
          grid-template-columns: 50px 1fr;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 0.5px solid rgba(184, 149, 90, 0.18);
          align-items: start;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .howuse-steps > div:last-child .howuse-step {
          border-bottom: none;
        }
        .howuse-step:hover {
          padding-left: 8px;
          border-bottom-color: rgba(220, 38, 39, 0.3);
        }
        .howuse-step:hover .howuse-step-num {
          color: #D4B27A;
        }
        .howuse-step-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          color: #B8955A;
          font-size: 36px;
          line-height: 1;
          transition: color 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .howuse-step-title {
          font-family: 'Playfair Display', Georgia, serif;
          color: #F2EAE0;
          font-size: 19px;
          font-weight: 400;
          line-height: 1.3;
          margin: 0 0 8px;
        }
        .howuse-step-accent {
          font-style: italic;
          color: #DC2627;
        }
        .howuse-step-desc {
          font-family: 'Montserrat', sans-serif;
          color: rgba(154, 136, 128, 0.85);
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
        }
        .howuse-tip {
          margin: 40px auto 0;
          max-width: 960px;
          padding: 18px 24px;
          background: rgba(184, 149, 90, 0.06);
          border: 0.5px solid rgba(184, 149, 90, 0.22);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .howuse-tip-icon {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          border: 0.5px solid #B8955A;
          color: #B8955A;
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .howuse-tip-text {
          font-family: 'Montserrat', sans-serif;
          font-style: italic;
          font-size: 12px;
          color: rgba(242, 234, 224, 0.7);
          margin: 0;
          line-height: 1.5;
        }
        @media (max-width: 1023px) {
          .howuse-grid {
            grid-template-columns: 280px 1fr;
            gap: 36px;
          }
        }
        @media (max-width: 767px) {
          .howuse-section {
            padding: 60px 0;
          }
          .howuse-headline {
            font-size: 28px;
          }
          .howuse-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .howuse-anchor-wrap {
            position: static;
          }
          .howuse-bottles {
            width: 220px;
          }
          .howuse-bottle {
            width: 105px;
          }
          .howuse-step-num {
            font-size: 30px;
          }
          .howuse-step-title {
            font-size: 17px;
          }
        }
      `}</style>
    </section>
  );
}

function FinalShopCTA() {
  return (
    <section className="relative min-h-[50svh] flex items-center justify-center overflow-hidden">
      <img src={hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "blur(2px)" }} />
      <div className="absolute inset-0 bg-[var(--color-noir)]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-noir)] via-transparent to-[var(--color-noir)]/30" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center py-24">
        <Reveal>
          <h2 className="text-display text-[var(--color-ivory)] text-4xl sm:text-5xl md:text-[52px] leading-[1.05]">
            You've Read Enough. <span style={{ color: "#A81716", fontStyle: "italic" }}>Now Feel It.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-[var(--color-ivory)]/80 text-base sm:text-lg max-w-xl mx-auto">
            The connection you're looking for is one decision away.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 btn-shine-group">
            <Link to="/shop" search={{ variant: "her" }} className="btn-primary btn-shine btn-shine-primary"><span>Shop For Her →</span></Link>
            <Link to="/shop" search={{ variant: "him" }} className="btn-secondary btn-shine btn-shine-glass"><span>Shop For Him →</span></Link>
            <Link to="/shop" search={{ variant: "couples" }} className="btn-secondary btn-shine btn-shine-glass"><span>Couples Bundle →</span></Link>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <ChevronDown className="mt-12 mx-auto text-[var(--color-ivory)]/40" size={22} />
        </Reveal>
      </div>
    </section>
  );
}

function _CrossTabNav({ active, setTab }: { active: Variant; setTab: (v: Variant) => void }) {
  const tabs: { id: Variant; label: string }[] = [
    { id: "her", label: "For Her" },
    { id: "him", label: "For Him" },
    { id: "couples", label: "Couples Bundle" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
        fontFamily: "Montserrat, sans-serif",
        fontSize: 10,
        letterSpacing: "1.8px",
        textTransform: "uppercase",
      }}
    >
      {tabs.map((t, i) => {
        const isActive = active === t.id;
        return (
          <span key={t.id} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setTab(t.id)}
              className="cross-tab-link"
              data-active={isActive}
              style={{
                background: "transparent",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#DC2627" : "rgba(154,136,128,0.85)",
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: 4,
                letterSpacing: "1.8px",
                transition: "color 200ms ease",
              }}
            >
              {t.label}
            </button>
            {i < tabs.length - 1 && (
              <span style={{ color: "rgba(184,149,90,0.4)" }}>·</span>
            )}
          </span>
        );
      })}
      <style>{`
        .cross-tab-link[data-active="false"]:hover {
          color: #B8955A !important;
        }
      `}</style>
    </div>
  );
}

function ComprehensiveFAQ() {
  const faqs: { q: string; a: string }[] = [
    {
      q: "How do I use it?",
      a: "Place half a dropper (about 0.5 ml) under your tongue. Hold for 30 seconds before swallowing. Take 1 to 2 times daily.",
    },
    {
      q: "When will I feel the difference?",
      a: "Most couples report a noticeable shift within 7 to 14 days. Effects build gradually and peak around week 3.",
    },
    {
      q: "Is this safe for daily use?",
      a: "Yes. LOVABLE is formulated with clinically-researched botanicals and contains no synthetic hormones. Safe for long-term consistent use.",
    },
    {
      q: "Are For Him and For Her different formulas?",
      a: "Yes. Each formula is precision-built for hormonal differences. For Her focuses on mood balance and arousal. For Him supports stamina and mental focus.",
    },
    {
      q: "Will my partner know I'm taking it?",
      a: "That's your choice. LOVABLE has no taste and no scent. The packaging arrives in plain unmarked boxes via J&T, Ninja Van, or Flash. Many couples take it together as a shared ritual, others use it privately.",
    },
    {
      q: "What if it doesn't work for me?",
      a: "Try LOVABLE for 30 days risk-free. If you don't feel the difference, we refund every peso. No questions, no awkwardness.",
    },
    {
      q: "How do I pay? Pwede ba COD?",
      a: "Pwede COD nationwide. Pwede din via GCash, Maya, Visa, or Mastercard. Choose what's easiest for you at checkout.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-[#0A0606] section-divider py-[80px] md:py-[110px]">
      <div className="mx-auto max-w-[820px] px-6">
        <Reveal>
          <p className="eyebrow text-center mb-4">Frequently Asked</p>
          <h2 className="text-display text-center text-[var(--color-ivory)] text-[32px] md:text-[44px] leading-[1.1] mb-12">
            Questions, <span style={{ color: "#B8955A", fontStyle: "italic" }}>Answered.</span>
          </h2>
        </Reveal>
        <div
          style={{
            border: "0.5px solid rgba(184, 149, 90, 0.2)",
            borderRadius: 14,
            background: "linear-gradient(180deg, rgba(26,10,10,0.6) 0%, rgba(13,6,6,0.6) 100%)",
            overflow: "hidden",
          }}
        >
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={f.q}
                style={{
                  borderBottom: i === faqs.length - 1 ? "none" : "0.5px solid rgba(184, 149, 90, 0.2)",
                  background: isOpen ? "rgba(220, 38, 39, 0.04)" : "transparent",
                  transition: "background 250ms ease",
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 24px",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#F2EAE0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {f.q}
                  </span>
                  <Plus
                    size={16}
                    color="#B8955A"
                    style={{
                      flexShrink: 0,
                      transition: "transform 300ms ease",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    overflow: "hidden",
                    transition: "max-height 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <p
                    style={{
                      padding: "0 24px 20px",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "rgba(154, 136, 128, 0.95)",
                      margin: 0,
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIAL_BASE = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS";
const mobileTestimonials = [
  { img: `${TESTIMONIAL_BASE}/Joan%202.png`, quote: "Bumalik yung connection na akala ko wala na.", name: "Joan" },
  { img: `${TESTIMONIAL_BASE}/Beth.png`, quote: "Naging mas malapit kami na hindi ko ineexpect.", name: "Beth" },
  { img: `${TESTIMONIAL_BASE}/Mark%202.png`, quote: "For the first time in years, may control ako.", name: "Mark" },
  { img: `${TESTIMONIAL_BASE}/Geraldine%202.png`, quote: "Naramdaman namin yung pagbabago pareho.", name: "Geraldine" },
  { img: `${TESTIMONIAL_BASE}/Luis%202.png`, quote: "Mas nagiging present ako sa aming relasyon.", name: "Luis" },
  { img: `${TESTIMONIAL_BASE}/Grace%202.png`, quote: "Sulit talaga, balik yung kilig na nawala.", name: "Grace" },
];

function MobileTestimonials() {
  return (
    <section className="shop-testimonial-mobile">
      <style>{`
        .shop-testimonial-mobile {
          padding: 48px 16px 40px;
          background: #0F0808;
        }
        @media (min-width: 769px) {
          .shop-testimonial-mobile { display: none; }
        }
        .shop-testimonial-mobile .eyebrow-tm {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
          color: #DC2627; text-align: center; margin: 0 0 10px; font-weight: 600;
        }
        .shop-testimonial-mobile .headline-tm {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px; color: #F2EAE0; text-align: center;
          font-weight: 400; margin: 0 0 8px; line-height: 1.15;
        }
        .shop-testimonial-mobile .headline-tm em { font-style: italic; color: #B8955A; }
        .shop-testimonial-mobile .sub-tm {
          font-size: 12px; color: rgba(154, 136, 128, 0.85);
          text-align: center; font-style: italic; margin: 0 0 28px;
        }
        .quote-wall { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 480px) and (max-width: 768px) {
          .quote-wall { grid-template-columns: repeat(2, 1fr); }
        }
        .quote-card {
          background: #160808;
          border: 0.5px solid rgba(184, 149, 90, 0.22);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 1px 0 rgba(242, 234, 224, 0.04) inset, 0 8px 20px rgba(0, 0, 0, 0.3);
          animation: fade-up-card 500ms ease-out backwards;
        }
        .quote-card:nth-child(1) { animation-delay: 50ms; }
        .quote-card:nth-child(2) { animation-delay: 150ms; }
        .quote-card:nth-child(3) { animation-delay: 250ms; }
        .quote-card:nth-child(4) { animation-delay: 350ms; }
        .quote-card:nth-child(5) { animation-delay: 450ms; }
        .quote-card:nth-child(6) { animation-delay: 550ms; }
        @keyframes fade-up-card {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .quote-image-wrap {
          width: 100%; aspect-ratio: 16 / 10; position: relative; overflow: hidden;
        }
        .quote-image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .quote-image-wrap::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(13, 13, 13, 0.3) 100%);
          pointer-events: none;
        }
        .quote-content { padding: 14px 14px 16px; }
        .quote-stars { color: #B8955A; font-size: 11px; letter-spacing: 2px; margin-bottom: 8px; }
        .quote-text {
          font-family: 'Playfair Display', Georgia, serif; font-style: italic;
          font-size: 12px; color: #F2EAE0; line-height: 1.4;
          margin: 0 0 12px; min-height: 50px;
        }
        .quote-meta {
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 1.5px; color: #B8955A; text-transform: uppercase;
          display: flex; align-items: center; gap: 6px;
        }
        .quote-meta::before { content: '◆'; color: #DC2627; font-size: 7px; }
      `}</style>
      <p className="eyebrow-tm">Real Couples, Real Results</p>
      <h2 className="headline-tm">In Their <em>Own Words.</em></h2>
      <p className="sub-tm">Stories from couples na nagbalik sa bawat isa.</p>
      <div className="quote-wall">
        {mobileTestimonials.map((t) => (
          <div key={t.name} className="quote-card">
            <div className="quote-image-wrap">
              <img src={t.img} alt={`${t.name} testimonial`} loading="lazy" />
            </div>
            <div className="quote-content">
              <div className="quote-stars">★★★★★</div>
              <p className="quote-text">"{t.quote}"</p>
              <div className="quote-meta">{t.name} · Verified Customer</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
