import { ChevronDown } from "lucide-react";
import { Reveal } from "../Reveal";
import { HeroFX } from "../HeroFX";

const HERO_IMAGE_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2028,%202026,%2001_47_05%20AM%20(1).png";

function scrollTo(hash: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

export function Hero() {
  return (
    <section
      id="top"
      className="hero-section-root relative md:min-h-[100svh] flex flex-col md:flex-row overflow-hidden"
      style={{
        background: "#0A0606",
        boxShadow: "inset 0 0 240px rgba(0, 0, 0, 0.6)",
      }}
    >
      <style>{`
        .hero-image-container { position: relative; overflow: hidden; }
        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center right;
        }
        /* Inset vignette to feather hero image edges into the dark bg */
        .hero-image-container::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          box-shadow:
            inset 0 60px 80px -20px #0A0606,
            inset 0 -60px 80px -20px #0A0606,
            inset 60px 0 80px -20px #0A0606,
            inset -60px 0 80px -20px #0A0606;
          z-index: 2;
        }
        @media (min-width: 768px) {
          .hero-image {
            width: 115%;
            margin-left: -5%;
            object-position: center center;
            mask-image: linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,0.05) 5%,
              rgba(0,0,0,0.2) 12%,
              rgba(0,0,0,0.5) 22%,
              rgba(0,0,0,0.8) 32%,
              black 42%
            );
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,0.05) 5%,
              rgba(0,0,0,0.2) 12%,
              rgba(0,0,0,0.5) 22%,
              rgba(0,0,0,0.8) 32%,
              black 42%
            );
          }
        }
        /* Press / "As seen in" styles */
        .press-section {
          margin-top: 24px;
          margin-bottom: 24px;
          padding: 18px 0;
          border-top: 0.5px solid rgba(184, 149, 90, 0.18);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .press-label {
          font-family: Montserrat, sans-serif;
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(154, 136, 128, 0.6);
          margin: 0;
          display: block;
        }
        .press-logos {
          display: flex;
          gap: 28px;
          align-items: center;
          flex-wrap: wrap;
          opacity: 0.65;
        }
        .press-logo {
          font-size: 14px;
          color: rgba(242, 234, 224, 0.75);
          transition: color 250ms ease, opacity 250ms ease;
          opacity: 0.9;
        }
        .press-logo:hover { opacity: 1; color: #F2EAE0; }
        .press-logo.vogue {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
          letter-spacing: 1.5px;
        }
        .press-logo.lofficiel {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          letter-spacing: 0.5px;
        }
        .press-logo.metro {
          font-family: Montserrat, sans-serif;
          font-weight: 700;
          letter-spacing: 2px;
          font-size: 13px;
        }
        .press-logo.esquire {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          letter-spacing: 0.5px;
        }
        @media (max-width: 768px) {
          /* Mobile: full-viewport image with text overlay at bottom (magazine cover). */
          .hero-section-root {
            position: relative;
            width: 100%;
            min-height: 0 !important;
            height: 100vh;
            height: 100dvh;
            margin: -70px 0 0 0 !important;
            padding: 0 !important;
            overflow: hidden;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
          }
          .hero-image-container {
            position: absolute !important;
            inset: 0 !important;
            order: 0;
            width: 100% !important;
            height: 100% !important;
            min-height: 0 !important;
            aspect-ratio: auto !important;
            margin: 0 !important;
            border-radius: 0 !important;
            overflow: hidden;
            box-shadow: none !important;
            z-index: 1 !important;
          }
          .hero-image-container::after {
            content: '' !important;
            display: block !important;
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg,
              transparent 0%,
              transparent 35%,
              rgba(10, 6, 6, 0.4) 50%,
              rgba(10, 6, 6, 0.78) 65%,
              rgba(10, 6, 6, 0.94) 80%,
              #0A0606 100%
            ) !important;
            box-shadow: none !important;
            pointer-events: none;
            z-index: 2;
          }
          .hero-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            margin-left: 0;
            object-fit: cover;
            object-position: center 25%;
            mask-image: none !important;
            -webkit-mask-image: none !important;
            background: #0A0606;
          }
          .hero-mobile-overlay { display: none !important; }
          .hero-bridge { display: none !important; }
          .hero-text-col {
            position: relative !important;
            z-index: 3 !important;
            order: 1;
            min-height: 0 !important;
            height: auto !important;
            width: 100%;
            padding: 20px 22px calc(28px + env(safe-area-inset-bottom, 0px)) !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
          }
          .hero-scroll-cue { display: none !important; }

          /* Tighter Press section on mobile overlay */
          .press-section {
            margin-top: 10px !important;
            margin-bottom: 8px !important;
            padding: 10px 0 !important;
            gap: 8px;
            border-top: 0.5px solid rgba(184, 149, 90, 0.25);
          }
          .press-label { font-size: 8px; letter-spacing: 2.5px; color: rgba(184, 149, 90, 0.7); }
          .press-logos { gap: 18px; opacity: 0.85; }
          .press-logo { font-size: 12px; color: rgba(242, 234, 224, 0.85); }
          .press-logo.metro { font-size: 11px; }
        }
        @media (min-width: 769px) {
          .hero-mobile-overlay { display: none; }
        }
        .hero-bridge {
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            to right,
            #0A0606 0%,
            rgba(10, 6, 6, 0.95) 20%,
            rgba(10, 6, 6, 0.7) 40%,
            rgba(10, 6, 6, 0.3) 65%,
            transparent 100%
          );
          z-index: 2;
          pointer-events: none;
        }
      `}</style>
      {/* Warm radial glow behind headline area */}
      <div
        aria-hidden
        className="absolute pointer-events-none hidden md:block"
        style={{
          top: "10%",
          left: 0,
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(220, 38, 39, 0.06) 0%, transparent 50%)",
          zIndex: 3,
        }}
      />
      <HeroFX />
      {/* Mobile: image stacks BELOW text (order-2). Desktop: right side 50% */}
      <div
        className="hero-image-container order-2 md:order-2 w-full md:w-1/2 md:h-auto md:min-h-[100svh] z-[1]"
      >
        <img
          src={HERO_IMAGE_URL}
          alt="Filipino couple in tender embrace holding LOVABLE bottles"
          className="hero-image"
        />
        {/* Mobile overlay to darken image so text overlays cleanly */}
        <div aria-hidden className="hero-mobile-overlay" />
        {/* Bridge gradient that paints over any seam on the left edge (desktop only) */}
        <div aria-hidden className="hero-bridge" />
      </div>

      {/* Left side: text content */}
      <div className="hero-text-col order-1 md:order-1 relative z-[10] w-full md:w-1/2 flex md:items-center justify-center md:px-6 md:py-28 md:min-h-[100svh]">
        <div className="max-w-xl w-full text-left">
          <Reveal>
            <p
              className="uppercase mb-3 md:mb-6"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
                letterSpacing: "4px",
                color: "#DC2627",
                fontWeight: 600,
              }}
            >
              Natural Lovable Drops
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="hero-headline-mobile text-[40px] md:text-[56px] lg:text-[72px] mb-3 md:!mb-5"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F2EAE0",
                lineHeight: 1.1,
                fontWeight: 400,
                letterSpacing: "-0.025em",
              }}
            >
              Feel That{" "}
              <span style={{ color: "#DC2627", fontStyle: "italic" }}>Hunger</span>{" "}
              Again.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="text-[17px] md:text-[20px] lg:text-[22px] mb-5 md:!mb-9"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(242, 234, 224, 0.78)",
                lineHeight: 1.5,
                maxWidth: "540px",
              }}
            >
              A natural blend for couples ready to want each other like the{" "}
              <span style={{ color: "#B8955A", fontStyle: "normal", fontWeight: 400 }}>first time</span>.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="press-section">
              <span className="press-label">As Seen In</span>
              <div className="press-logos">
                <span className="press-logo vogue">VOGUE</span>
                <span className="press-logo lofficiel">L'Officiel</span>
                <span className="press-logo metro">METRO</span>
                <span className="press-logo esquire">Esquire</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-start gap-3 sm:gap-6">
              <div className="flex flex-col items-start">
                <span
                  className="uppercase mb-2 md:!mb-4"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "2.5px",
                    color: "#B8955A",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "9999px",
                      background: "#DC2627",
                      display: "inline-block",
                    }}
                  />
                  For when comfort isn't enough.
                </span>
                <a href="/shop" className="btn-pulse-shine btn-mobile-block">
                  <span>Shop Now</span> <span className="arrow">→</span>
                </a>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <span style={{ color: "#F5C518", fontSize: "13px", letterSpacing: "1px" }}>★★★★<span style={{ color: "#F5C518", opacity: 0.4 }}>★</span></span>
                  <span style={{ color: "#F2EAE0", fontWeight: 600, fontSize: "13px" }}>4.7</span>
                </div>
                <p style={{ color: "#9A8880", fontSize: "10px", marginTop: "2px" }}>
                  Based on 847 verified reviews
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.45}>
            <ul className="mt-5 md:mt-8 flex flex-wrap items-center md:justify-start justify-center gap-x-4 gap-y-2">
              {["30-Day Guarantee", "Free Shipping", "Made in USA"].map((item) => (
                <li key={item} className="flex items-center gap-2" style={{ color: "#9A8880", fontSize: "10px" }}>
                  <span
                    aria-hidden
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "9999px",
                      background: "#A81716",
                      display: "inline-block",
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-7 left-1/2 -translate-x-1/2 z-10 animate-[bounce-slow_2s_ease-in-out_infinite] text-[var(--color-ivory)]/50">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
