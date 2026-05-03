import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";

const BASE = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS";

type Story = {
  src: string;
  alt: string;
  name: string;
  quote: string;
};

// Ordered for emotional arc:
// connection → confession → permission → assurance → male validation → confidence → close
const stories: Story[] = [
  {
    src: `${BASE}/Joan%202.png`,
    alt: "Joan shares her LOVABLE experience",
    name: "Joan",
    quote: "Bumalik yung connection na akala ko wala na.",
  },
  {
    src: `${BASE}/Beth.png`,
    alt: "Beth shares her LOVABLE experience",
    name: "Beth",
    quote: "Sa gabi, pakiramdam ko hindi na ako babae.",
  },
  {
    src: `${BASE}/Geraldine%202.png`,
    alt: "Geraldine shares her LOVABLE experience",
    name: "Geraldine",
    quote: "Hindi mo na kailangang magpanggap.",
  },
  {
    src: `${BASE}/Grace%202.png`,
    alt: "Grace shares her LOVABLE experience",
    name: "Grace",
    quote: "Hindi siya magic, support lang para bumalik.",
  },
  {
    src: `${BASE}/Mark%202.png`,
    alt: "Mark shares his LOVABLE experience",
    name: "Mark",
    quote: "Saan galing yung bagsik na 'to?",
  },
  {
    src: `${BASE}/Luis%202.png`,
    alt: "Luis shares his LOVABLE experience",
    name: "Luis",
    quote: "Feel it before they do.",
  },
  {
    src: `${BASE}/Nicole%202.png`,
    alt: "Nicole shares her LOVABLE experience",
    name: "Nicole",
    quote: "Ibalik ang iyong ningning.",
  },
];

const SLIDE_MS = 4000;
const RESUME_MS = 8000;
const INITIAL_DELAY_MS = 2000;

export function SocialProof() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showPausedBadge, setShowPausedBadge] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const pausedBadgeTimer = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleCTA = () => {
    const el = document.getElementById("final-cta");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.href = "/shop";
  };

  const goTo = (i: number) => {
    setActive((i + stories.length) % stories.length);
    setProgressKey((k) => k + 1);
  };

  const triggerPausedBadge = () => {
    setShowPausedBadge(true);
    if (pausedBadgeTimer.current) window.clearTimeout(pausedBadgeTimer.current);
    pausedBadgeTimer.current = window.setTimeout(() => setShowPausedBadge(false), 2000);
  };

  const pauseFor = (ms: number) => {
    setPaused(true);
    triggerPausedBadge();
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), ms);
  };

  const userInteract = (i: number) => {
    goTo(i);
    pauseFor(RESUME_MS);
  };

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause when section out of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Preload all testimonial images so transitions are instant
  useEffect(() => {
    if (typeof window === "undefined") return;
    stories.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  // Initial delay before auto-advance starts on load
  useEffect(() => {
    const t = window.setTimeout(() => setHasStarted(true), INITIAL_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused || !inView || reducedMotion || !hasStarted) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % stories.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, inView, reducedMotion, hasStarted]);

  // Keyboard nav when section is in viewport
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!visible) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        userInteract(active - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        userInteract(active + 1);
      } else if (e.code === "Space" && document.activeElement?.tagName !== "BUTTON") {
        e.preventDefault();
        if (paused) {
          if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
          setPaused(false);
        } else {
          pauseFor(RESUME_MS);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, paused]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      if (pausedBadgeTimer.current) window.clearTimeout(pausedBadgeTimer.current);
    };
  }, []);

  // Swipe gestures (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    pauseFor(RESUME_MS);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) userInteract(active + 1);
    else userInteract(active - 1);
  };

  const story = stories[active];

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        setPaused(false);
      }}
      className="bg-tier-3 section-divider relative py-[60px] md:py-[100px] overflow-hidden"
      style={{ background: "#160808" }}
    >
      <style>{`
        @keyframes sp-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes sp-fade-in {
          from { opacity: 0; transform: translateY(6px) scale(1.02); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sp-quote-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-thumb-ring {
          from { --sp-ring: 0%; }
          to { --sp-ring: 100%; }
        }
        .sp-fade { animation: sp-fade-in 350ms ease-out 100ms both; will-change: opacity, transform; }
        .sp-quote, .sp-name, .sp-verified, .sp-divider, .sp-quote-mark {
          animation: sp-quote-in 280ms ease-out 200ms both;
        }
        .sp-thumbs::-webkit-scrollbar { display: none; }
        .sp-thumbs { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .sp-paused-dim { opacity: 0.5 !important; animation-play-state: paused !important; }
        .sp-thumb-ring {
          position: absolute;
          inset: -3px;
          border-radius: 11px;
          padding: 1.5px;
          background: conic-gradient(#B8955A var(--sp-ring, 0%), transparent 0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }
        .sp-thumb-ring.run { animation: sp-thumb-ring 4s linear forwards; }
        .sp-thumb-ring.paused { animation-play-state: paused; opacity: 0.5; }
        @media (prefers-reduced-motion: reduce) {
          .sp-fade, .sp-quote, .sp-name, .sp-verified, .sp-divider, .sp-quote-mark { animation: none !important; }
          .sp-progress-wrap { display: none !important; }
          .sp-thumb-ring { display: none; }
        }

        /* Mobile-first stacking for the featured story */
        .sp-featured { display: block; }
        .sp-image { aspect-ratio: 16 / 9; border-radius: 12px; margin-bottom: 24px; }
        .sp-badge {
          top: 12px; left: 12px;
          padding: 4px 10px;
          font-size: 8px;
          letter-spacing: 2px;
          box-shadow: 0 2px 8px rgba(220, 38, 39, 0.3);
        }
        .sp-content { padding: 0 4px; margin-top: 0; }
        .sp-quote-mark { font-size: 32px; margin-bottom: 12px; }
        .sp-quote { font-size: 22px; line-height: 1.4; margin-bottom: 24px; padding: 0; }
        .sp-divider { width: 40px; margin-bottom: 16px; }
        .sp-name { font-size: 13px; font-weight: 500; }
        .sp-verified {
          display: flex !important;
          margin-top: 6px;
          font-size: 9px;
          letter-spacing: 1.5px;
        }
        .sp-progress-wrap { display: none; }
        .sp-cta-wrap { margin-top: 40px !important; }
        .sp-cta-pre { font-size: 11px !important; }
        .sp-cta-btn { width: 100%; min-height: 52px; }

        @media (min-width: 768px) {
          .sp-featured {
            display: grid;
            grid-template-columns: 60% 40%;
            gap: 48px;
            align-items: center;
          }
          .sp-image { aspect-ratio: 16 / 9; border-radius: 14px; margin-bottom: 0; }
          .sp-badge {
            top: 16px; left: 16px;
            padding: 6px 14px;
            font-size: 9px;
            letter-spacing: 2.5px;
            box-shadow: 0 4px 12px rgba(220, 38, 39, 0.3);
          }
          .sp-content { padding: 0; margin-top: 0; }
          .sp-quote-mark { font-size: 48px; margin-bottom: 16px; }
          .sp-quote { font-size: 26px; line-height: 1.5; margin-bottom: 32px; }
          .sp-divider { width: 60px; margin-bottom: 20px; }
          .sp-name { font-size: 14px; }
          .sp-verified {
            display: inline-flex !important;
            margin-top: 0;
            font-size: 10px;
            letter-spacing: 1.5px;
          }
          .sp-progress-wrap { display: block; }
          .sp-cta-wrap { margin-top: 64px !important; }
          .sp-cta-pre { font-size: 12px !important; }
          .sp-cta-btn { width: auto; min-height: auto; }
        }
      `}</style>

      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <Reveal>
          <p
            className="uppercase mb-5"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#DC2627",
              fontWeight: 600,
            }}
          >
            Real Couples, Real Results
          </p>
          <h2
            className="text-[28px] md:text-[36px] mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#F2EAE0",
              lineHeight: 1.15,
            }}
          >
            In Their{" "}
            <span style={{ fontStyle: "italic", color: "#B8955A" }}>Own Words.</span>
          </h2>
          <p
            className="mx-auto"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              color: "#9A8880",
              maxWidth: "480px",
              marginBottom: "56px",
            }}
          >
            Stories from couples na nagbalik sa bawat isa.
          </p>
        </Reveal>

        {/* Featured story */}
        <Reveal delay={0.15}>
          <div className="text-left">
            <div
              className="sp-featured"
              ref={featuredRef}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Image */}
              <div
                key={`img-${active}`}
                className="sp-fade sp-image relative w-full overflow-hidden"
                style={{
                  border: "0.5px solid rgba(184, 149, 90, 0.22)",
                  boxShadow:
                    "0 1px 0 rgba(242, 234, 224, 0.05) inset, 0 16px 48px rgba(0, 0, 0, 0.5), 0 24px 64px rgba(0, 0, 0, 0.3)",
                  background: "#1A0A0A",
                }}
              >
                <img
                  src={story.src}
                  alt={story.alt}
                  width={1280}
                  height={720}
                  className="block w-full h-full"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <span
                  className="sp-badge absolute uppercase"
                  style={{
                    background: "#DC2627",
                    borderRadius: "999px",
                    fontFamily: "Montserrat, sans-serif",
                    color: "#F2EAE0",
                    fontWeight: 600,
                  }}
                >
                  Featured Story
                </span>
                {/* Paused indicator */}
                <span
                  aria-hidden
                  className="absolute uppercase inline-flex items-center gap-1.5"
                  style={{
                    top: 12,
                    right: 12,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(0,0,0,0.7)",
                    color: "#F2EAE0",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 9,
                    letterSpacing: "1.5px",
                    fontWeight: 600,
                    opacity: showPausedBadge && paused ? 0.85 : 0,
                    transition: "opacity 250ms ease",
                    pointerEvents: "none",
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                    <rect x="1" y="1" width="2" height="6" fill="#F2EAE0" />
                    <rect x="5" y="1" width="2" height="6" fill="#F2EAE0" />
                  </svg>
                  Paused
                </span>
              </div>

              {/* Content */}
              <div key={`content-${active}`} className="sp-fade sp-content">
                <span
                  aria-hidden
                  className="sp-quote-mark"
                  style={{
                    color: "#DC2627",
                    lineHeight: 1,
                    display: "block",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  ❝
                </span>
                <p
                  className="sp-quote"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    color: "#F2EAE0",
                  }}
                >
                  {story.quote}
                </p>
                <div
                  className="sp-divider"
                  style={{
                    height: "0.5px",
                    background: "rgba(184, 149, 90, 0.6)",
                  }}
                />
                <div
                  className="sp-name"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "#F2EAE0",
                    marginBottom: "6px",
                  }}
                >
                  {story.name}
                </div>
                <div
                  className="sp-verified uppercase items-center gap-1.5"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "#B8955A",
                    fontWeight: 500,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M8 1l1.8 1.4 2.3-.2.5 2.2 2 1.2-.8 2.1.8 2.1-2 1.2-.5 2.2-2.3-.2L8 14.6 6.2 13.2l-2.3.2-.5-2.2-2-1.2.8-2.1-.8-2.1 2-1.2.5-2.2 2.3.2L8 1z"
                      fill="#B8955A"
                    />
                    <path
                      d="M5.5 8l1.8 1.8L10.7 6.4"
                      stroke="#160808"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Verified Customer
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Thumbnails */}
        <div
          className="sp-thumbs flex justify-start md:justify-center overflow-x-auto"
          style={{
            marginTop: "32px",
            gap: "var(--sp-thumb-gap, 8px)",
            padding: "var(--sp-thumb-pad, 16px 12px)",
            scrollSnapType: "x mandatory",
          }}
        >
          {stories.map((s, i) => {
            const isActive = i === active;
            return (
              <div
                key={s.src}
                className="shrink-0 relative"
                style={{ width: "var(--sp-thumb-w, 110px)", flexShrink: 0 }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    key={`ring-${progressKey}`}
                    className={`sp-thumb-ring run ${paused ? "paused" : ""}`}
                  />
                )}
                <button
                  onClick={() => userInteract(i)}
                  aria-label={`Show story from ${s.name}`}
                  aria-current={isActive}
                  className="block w-full overflow-hidden focus:outline-none"
                  style={{
                    aspectRatio: "16 / 9",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: isActive
                      ? "1px solid #DC2627"
                      : "0.5px solid rgba(184, 149, 90, 0.22)",
                    opacity: isActive ? 1 : 0.55,
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 8px 20px rgba(220, 38, 39, 0.3)"
                      : "none",
                    transition: "all 300ms ease",
                    scrollSnapAlign: "center",
                    background: "#1A0A0A",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = "0.85";
                      e.currentTarget.style.border = "0.5px solid rgba(184, 149, 90, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = "0.55";
                      e.currentTarget.style.border = "0.5px solid rgba(184, 149, 90, 0.22)";
                    }
                  }}
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    width={220}
                    height={124}
                    className="block w-full h-full"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </button>
              </div>
            );
          })}
          <style>{`
            .sp-thumbs { --sp-thumb-w: 72px; --sp-thumb-gap: 8px; --sp-thumb-pad: 16px 12px; }
            @media (min-width: 768px) and (max-width: 1023px) {
              .sp-thumbs { --sp-thumb-w: 90px; --sp-thumb-gap: 12px; --sp-thumb-pad: 8px 0; }
            }
            @media (min-width: 1024px) {
              .sp-thumbs { --sp-thumb-w: 110px; --sp-thumb-gap: 12px; --sp-thumb-pad: 8px 0; }
            }
          `}</style>
        </div>

        {/* Progress bar */}
        <div
          aria-hidden
          className="sp-progress-wrap"
          style={{
            width: "200px",
            height: "1.5px",
            background: "rgba(154, 136, 128, 0.2)",
            margin: "24px auto 0",
            overflow: "hidden",
            borderRadius: "999px",
            opacity: paused ? 0.5 : 1,
            transition: "opacity 250ms ease",
          }}
        >
          <div
            key={`p-${progressKey}`}
            style={{
              height: "100%",
              background: "#DC2627",
              animation: `sp-progress ${SLIDE_MS}ms linear forwards`,
              animationPlayState: paused || !inView || !hasStarted ? "paused" : "running",
            }}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="sp-cta-wrap flex flex-col items-center px-6">
        <p
          className="sp-cta-pre"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: "#9A8880",
            marginBottom: "20px",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          Join thousands of couples who already feel the difference.
        </p>
        <button onClick={handleCTA} className="btn-primary btn-shine btn-shine-primary sp-cta-btn">
          <span>I've Seen Enough, Order Mine</span>
        </button>
      </div>
    </section>
  );
}
