import { useEffect, useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="LOVABLE"
      className={`inline-flex items-center font-extrabold tracking-tight text-[var(--color-brand-red)] leading-none ${className}`}
      style={{ fontFamily: '"Playfair Display", serif', letterSpacing: "-0.02em" }}
    >
      <span>LO</span>
      <Heart
        className="mx-[1px]"
        size="0.95em"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>ABLE</span>
    </span>
  );
}

const links = [
  { label: "Home", hash: "" },
  { label: "For Her", hash: "forher" },
  { label: "For Him", hash: "forhim" },
  { label: "For Couples", hash: "forcouples" },
  { label: "FAQ", hash: "faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Lock body scroll while overlay open (preserve scroll position on iOS)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      return () => {
        const top = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        window.scrollTo(0, Math.abs(parseInt(top || "0", 10)));
      };
    }
  }, [mobileOpen]);

  // ESC to close
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track hero visibility — drives navbar transparency and auto-hide on home.
  // On mobile (<= 768px), never auto-hide: navbar must remain sticky/visible at all times.
  useEffect(() => {
    if (!isHome) {
      setHidden(false);
      setHeroInView(false);
      return;
    }
    const hero = document.getElementById("top");
    if (!hero) return;
    const isMobile = () =>
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(isMobile() ? false : !entry.isIntersecting);
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(hero);
    const onResize = () => {
      if (isMobile()) setHidden(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [isHome]);

  // Track which section is currently in view (for active link highlight)
  useEffect(() => {
    if (!isHome) {
      setActiveHash("");
      return;
    }
    const ids = links.map((l) => l.hash).filter(Boolean);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(visible.target.id);
      },
      { threshold: [0.3, 0.6], rootMargin: "-20% 0px -40% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const handleNav = (hash: string) => (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (!hash) {
      if (isHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      e.preventDefault();
      navigate({ to: "/", hash });
    }
  };

  const transparent = isHome && heroInView && !scrolled && !mobileOpen;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        hidden && !mobileOpen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      } ${
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-[var(--color-noir)]/95 backdrop-blur-md border-b border-white/[0.06]"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-3">
        <Link to="/" onClick={handleNav("")} className="flex items-center relative z-[210]">
          <Wordmark className="text-[22px]" />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.hash ? `#${l.hash}` : "/"}
                onClick={handleNav(l.hash)}
                className="text-[12px] font-medium tracking-[0.18em] uppercase text-[var(--color-ivory)]/85 hover:text-[var(--color-brand-red)] transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link to="/shop" search={{}} className="btn-pulse-shine btn-pulse-navbar">
            <span>Shop Now</span> <span className="arrow">→</span>
          </Link>
        </div>

        {/* Mobile burger — animated to X */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu-overlay"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-[var(--color-ivory)] hover:text-[var(--color-brand-red)] transition-colors relative z-[210]"
        >
          <span className="relative block w-6 h-[18px]">
            <span
              className={`absolute left-0 top-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-[2px] w-full rounded bg-current transition-all duration-200 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-4 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        id="mobile-menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        className={`md:hidden fixed inset-0 z-[200] flex flex-col transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        style={{
          background: "var(--color-noir)",
          height: "100dvh",
        }}
      >
        {/* Spacer to clear the header row (logo + burger live in the header itself) */}
        <div className="h-[60px] flex-shrink-0 border-b border-[color-mix(in_oklab,var(--color-gold)_18%,transparent)]" />

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center px-6 overflow-y-auto">
          <ul className="flex flex-col">
            {links.map((l, i) => {
              const isActive = (l.hash === "" && false) || (l.hash && activeHash === l.hash);
              return (
                <li
                  key={l.label}
                  className={mobileOpen ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both" : ""}
                  style={{
                    animationDelay: `${100 + i * 60}ms`,
                    animationDuration: "500ms",
                  }}
                >
                  <a
                    href={l.hash ? `#${l.hash}` : "/"}
                    onClick={handleNav(l.hash)}
                    className={`group flex items-center justify-between py-5 px-2 border-b border-[color-mix(in_oklab,var(--color-gold)_12%,transparent)] transition-all duration-300 active:pl-4 ${
                      isActive ? "" : ""
                    }`}
                  >
                    <span
                      className={`transition-colors ${
                        isActive
                          ? "text-[var(--color-brand-red)] italic"
                          : "text-[var(--color-ivory)] group-active:text-[var(--color-brand-red)]"
                      }`}
                      style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize: "26px",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {l.label}
                    </span>
                    <ArrowUpRight
                      size={22}
                      className={`transition-all ${
                        isActive
                          ? "opacity-100 text-[var(--color-brand-red)]"
                          : "opacity-50 text-[var(--color-gold)] group-active:opacity-100 group-active:translate-x-1 group-active:text-[var(--color-brand-red)]"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA + trust strip */}
        <div
          className={`flex-shrink-0 px-6 pt-5 pb-7 border-t border-[color-mix(in_oklab,var(--color-gold)_18%,transparent)] ${
            mobileOpen ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both" : ""
          }`}
          style={{ animationDelay: "400ms", animationDuration: "500ms" }}
        >
          <Link
            to="/shop"
            search={{}}
            onClick={() => setMobileOpen(false)}
            className="btn-pulse-shine btn-mobile-block"
          >
            <span>Shop Now</span> <span className="arrow">→</span>
          </Link>
          <div className="mt-4 flex items-center justify-around gap-2 text-[9px] tracking-[0.15em] uppercase text-[var(--color-ivory)]/55">
            <span>Free Shipping Nationwide</span>
            <span className="opacity-40">•</span>
            <span>30-Day Guarantee</span>
            <span className="opacity-40">•</span>
            <span>Discreet</span>
          </div>
        </div>
      </div>
    </header>
  );
}
