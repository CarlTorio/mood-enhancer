import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import { useIsMobile } from "@/hooks/use-mobile";

type MobileScrollPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  enabled: boolean;
  tabIndex?: number;
  role?: string;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
};

const MobileScrollPanel = forwardRef<HTMLDivElement, MobileScrollPanelProps>(
  function MobileScrollPanel({ enabled, children, ...divProps }, forwardedRef) {
    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement);
    const [inView, setInView] = useState(!enabled);

    useEffect(() => {
      if (!enabled) {
        setInView(true);
        return;
      }
      const el = innerRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.4, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, [enabled]);

    const baseStyle = divProps.style ?? {};
    const baseTransform = (baseStyle.transform as string) ?? "";
    const scrollTransform = enabled
      ? `${baseTransform} scale(${inView ? 1 : 0.86})`.trim()
      : baseTransform;
    const baseTransition = (baseStyle.transition as string) ?? "";
    const mergedTransition = enabled
      ? `transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out${baseTransition ? ", " + baseTransition : ""}`
      : baseTransition;

    const mergedStyle: React.CSSProperties = {
      ...baseStyle,
      transform: scrollTransform,
      opacity: enabled ? (inView ? 1 : 0.5) : (baseStyle.opacity ?? 1),
      transition: mergedTransition,
      transformOrigin: "center center",
      willChange: enabled ? "transform, opacity" : baseStyle.willChange,
    };

    return (
      <div ref={innerRef} {...divProps} style={mergedStyle}>
        {children}
      </div>
    );
  }
);

type Panel = {
  image: string;
  alt: string;
  number: string;
  label: string;
  quote: string;
  description: string;
};

const panels: Panel[] = [
  {
    image:
      "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20May%202,%202026,%2012_55_06%20AM.png",
    alt: "Couple drifting apart",
    number: "01",
    label: "DRIFTING",
    quote:
      "It's been weeks since we last <span style='color:#DC2627; font-style:italic;'>touched</span> without it being routine.",
    description: "When intimacy becomes habit, you stop feeling each other.",
  },
  {
    image:
      "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20May%202,%202026,%2001_01_54%20AM.png",
    alt: "Distance in bed",
    number: "02",
    label: "DISTANCE",
    quote:
      "The distance in bed feels <span style='color:#DC2627; font-style:italic;'>wider every night</span>, and neither of you knows how to close it.",
    description: "Same bed. Same house. But miles between you.",
  },
  {
    image:
      "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20May%202,%202026,%2001_05_12%20AM.png",
    alt: "Together but worlds apart",
    number: "03",
    label: "APART",
    quote:
      "Together physically. <span style='color:#DC2627; font-style:italic;'>Worlds apart</span> emotionally.",
    description:
      "The connection that used to come naturally. It's just not there anymore.",
  },
  {
    image:
      "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20May%202,%202026,%2001_09_39%20AM.png",
    alt: "Drained energy",
    number: "04",
    label: "DRAINED",
    quote:
      "Stress and the years have <span style='color:#DC2627; font-style:italic;'>quietly drained</span> the energy you used to share.",
    description: "Your body remembers. But your energy doesn't keep up anymore.",
  },
  {
    image:
      "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20May%202,%202026,%2001_11_25%20AM.png",
    alt: "Missing the past",
    number: "05",
    label: "MISSING",
    quote:
      "You remember how it used to feel. <span style='color:#DC2627; font-style:italic;'>And you miss it.</span>",
    description: "The energy. The wanting. The spontaneity. Where did it go?",
  },
  {
    image:
      "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20May%202,%202026,%2001_15_06%20AM.png",
    alt: "Silent struggle",
    number: "06",
    label: "SILENT",
    quote:
      "Neither of you talks about it. <span style='color:#DC2627; font-style:italic;'>But you both feel it.</span>",
    description:
      "An unspoken weight. You miss each other, even in the same room.",
  },
];

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export function PainPoints() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const check = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile: auto-activate the panel whose center is closest to viewport center
  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const viewportCenter = window.innerHeight / 2;
      let closestIdx = -1;
      let closestDist = Infinity;
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Skip if completely off-screen
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });
      if (closestIdx !== -1) {
        setActive((prev) => (prev === closestIdx ? prev : closestIdx));
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  const useTap = isMobile || isTablet;

  const handleEnter = (i: number) => {
    setHovered(i);
    if (!useTap) setActive(i);
  };

  const handleLeave = () => setHovered(null);

  const handleClick = (i: number) => {
    if (useTap) {
      setActive((prev) => (prev === i && isMobile ? -1 : i));
    }
  };

  const handleKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive((prev) => (prev === i && isMobile ? -1 : i));
    }
  };

  return (
    <section
      id="pain-points"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #1A0A0A 0%, #0E0606 50%, #060303 100%)",
      }}
      className="section-divider relative w-full py-[60px] md:py-20"
    >
      <div className="mx-auto px-4 md:px-6" style={{ maxWidth: "1400px" }}>
        <Reveal>
          <div
            className="text-center mx-auto"
            style={{ maxWidth: "720px", marginBottom: "64px" }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#DC2627",
                marginBottom: "16px",
              }}
            >
              Does This Sound Familiar?
            </p>
            <h2
              className="section-headline-mobile text-[26px] md:text-[44px] lg:text-[56px]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                color: "#F2EAE0",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                textAlign: "center",
                marginBottom: "32px",
              }}
            >
              You Still Love Each Other. But{" "}
              <span style={{ color: "#DC2627", fontStyle: "italic" }}>
                Something&rsquo;s Missing.
              </span>
            </h2>
            <p
              className="text-[15px] md:text-[18px]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "rgba(242, 234, 224, 0.7)",
                lineHeight: 1.5,
                textAlign: "center",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              And no one wants to say it out loud.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div
            className={isMobile ? "flex flex-col" : "flex flex-row"}
            style={{
              gap: "12px",
              maxWidth: "1400px",
              margin: "0 auto",
              height: isMobile ? "auto" : isTablet ? "380px" : "420px",
            }}
          >
            {panels.map((p, i) => {
              const isActive = active === i;
              const isHover = hovered === i;
              const flex = isActive ? 4 : 1;
              const mobileHeight = isActive ? "400px" : "200px";

              const imageFilter = isActive
                ? "brightness(0.95) contrast(1.15) saturate(0.95) sepia(0.05) hue-rotate(-5deg)"
                : isHover
                  ? "brightness(0.9) contrast(1.12) saturate(0.93) sepia(0.05) hue-rotate(-5deg)"
                  : "brightness(0.85) contrast(1.1) saturate(0.92) sepia(0.05) hue-rotate(-5deg)";

              const imageTransform =
                isHover && !isActive ? "scale(1.02)" : "scale(1)";

              const border = isActive
                ? "1px solid rgba(220, 38, 39, 0.4)"
                : "1px solid rgba(184, 149, 90, 0.18)";

              const boxShadow = isActive
                ? "0 1px 0 rgba(242, 234, 224, 0.15) inset, 0 0 0 1px rgba(220, 38, 39, 0.4), 0 16px 32px rgba(0,0,0,0.7), 0 32px 64px rgba(0,0,0,0.6), 0 48px 96px rgba(220,38,39,0.18)"
                : isHover
                  ? "0 1px 0 rgba(242, 234, 224, 0.12) inset, 0 0 0 0.5px rgba(220, 38, 39, 0.4), 0 8px 16px rgba(0,0,0,0.7), 0 24px 48px rgba(0,0,0,0.6), 0 40px 80px rgba(220,38,39,0.15)"
                  : "0 1px 0 rgba(242, 234, 224, 0.08) inset, 0 0 0 0.5px rgba(184, 149, 90, 0.15), 0 4px 12px rgba(0,0,0,0.6), 0 16px 32px rgba(0,0,0,0.5), 0 32px 64px rgba(0,0,0,0.4)";

              const liftTransform =
                isHover && !isActive ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)";

              return (
                <MobileScrollPanel
                  key={i}
                  ref={(el) => { panelRefs.current[i] = el; }}
                  enabled={isMobile}
                  role="button"
                  tabIndex={0}
                  aria-label={p.label}
                  aria-expanded={isActive}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                  onClick={() => handleClick(i)}
                  onKeyDown={(e) => handleKey(e, i)}
                  className="relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2627]"
                  style={{
                    flex: isMobile ? "0 0 auto" : flex,
                    height: isMobile ? mobileHeight : "100%",
                    width: isMobile ? "100%" : "auto",
                    transform: liftTransform,
                    zIndex: isActive ? 10 : isHover ? 5 : 1,
                    transition: `flex 500ms ${EASE}, height 500ms ${EASE}, border 500ms ${EASE}, box-shadow 500ms ${EASE}, transform 400ms ${EASE}`,
                    minWidth: 0,
                    background: "#1F0F0C",
                    border,
                    borderRadius: "14px",
                    boxShadow,
                  }}
                >
                  {/* Background image */}
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: imageFilter,
                      transform: imageTransform,
                      transition: `filter 400ms ease-out, transform 500ms ${EASE}`,
                    }}
                  />

                  {/* Candlelight glow band — bottom warm light, only when collapsed */}
                  {!isActive && (
                    <div
                      aria-hidden
                      className="absolute left-0 right-0 bottom-0 pointer-events-none"
                      style={{
                        height: "30%",
                        background:
                          "linear-gradient(to top, rgba(220, 38, 39, 0.12) 0%, rgba(220, 38, 39, 0.04) 40%, transparent 100%)",
                        borderRadius: "0 0 14px 14px",
                        zIndex: 2,
                      }}
                    />
                  )}
                  {/* Warm top light */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at top, rgba(184,149,90,0.08), transparent 60%)",
                    }}
                  />

                  {/* Cinematic vignette + bottom gradient for legibility */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 80px rgba(0,0,0,0.45)",
                      background: isActive
                        ? "linear-gradient(180deg, rgba(13,13,13,0.10) 0%, rgba(13,13,13,0.25) 60%, rgba(13,13,13,0.45) 100%)"
                        : "linear-gradient(180deg, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.35) 60%, rgba(13,13,13,0.55) 100%)",
                      transition: `background 500ms ${EASE}`,
                    }}
                  />

                  {/* Number */}
                  <span
                    style={{
                      position: "absolute",
                      top: "24px",
                      left: isActive ? "32px" : "50%",
                      transform: isActive
                        ? "translateX(0)"
                        : "translateX(-50%)",
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#DC2627",
                      textShadow: isActive
                        ? "0 2px 8px rgba(0, 0, 0, 0.6)"
                        : "0 0 24px rgba(220, 38, 39, 0.6), 0 0 8px rgba(220, 38, 39, 0.4), 0 2px 8px rgba(0, 0, 0, 0.6)",
                      transition: `all 500ms ${EASE}`,
                      zIndex: 5,
                    }}
                  >
                    {p.number}
                  </span>

                  {/* Collapsed vertical label */}
                  {!isMobile && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "50%",
                        transform: "translateX(-50%) rotate(-90deg)",
                        transformOrigin: "center",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: "rgba(184, 149, 90, 0.85)",
                        textShadow: "0 0 16px rgba(0, 0, 0, 0.6)",
                        whiteSpace: "nowrap",
                        opacity: isActive ? 0 : 1,
                        transition: `opacity 400ms ${EASE}`,
                        pointerEvents: "none",
                        zIndex: 3,
                      }}
                    >
                      {p.label}
                    </span>
                  )}

                  {/* Mobile collapsed: small horizontal "01 · DRIFTING" label */}
                  {isMobile && !isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "72px",
                        left: "24px",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "rgba(242,234,224,0.6)",
                      }}
                    >
                      {p.number} · {p.label}
                    </span>
                  )}

                  {/* Mobile collapsed: 2-line quote teaser */}
                  {isMobile && !isActive && (
                    <p
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "24px",
                        right: "24px",
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#F2EAE0",
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      dangerouslySetInnerHTML={{ __html: p.quote }}
                    />
                  )}

                  {/* Expanded content */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: isMobile ? "24px" : "32px",
                      left: isMobile ? "24px" : "32px",
                      right: isMobile ? "24px" : "32px",
                      opacity: isActive ? 1 : 0,
                      transition: isActive
                        ? `opacity 400ms ${EASE} 200ms`
                        : `opacity 200ms ${EASE}`,
                      pointerEvents: isActive ? "auto" : "none",
                      backdropFilter: isActive ? "blur(3px)" : "none",
                      WebkitBackdropFilter: isActive ? "blur(3px)" : "none",
                      padding: "12px 14px",
                      borderRadius: "6px",
                      background: isActive
                        ? "rgba(13,13,13,0.15)"
                        : "transparent",
                    }}
                  >
                    <p
                      className="text-[20px] md:text-[26px]"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: "#F2EAE0",
                        lineHeight: 1.3,
                      }}
                      dangerouslySetInnerHTML={{ __html: p.quote }}
                    />
                    <p
                      className="text-[12px] md:text-[13px]"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 300,
                        fontStyle: "italic",
                        color: "#B8955A",
                        lineHeight: 1.6,
                        marginTop: "12px",
                      }}
                    >
                      {p.description}
                    </p>
                  </div>
                </MobileScrollPanel>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div className="text-center" style={{ marginTop: "56px" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "22px",
                color: "#9A8880",
                marginBottom: "24px",
              }}
            >
              If even ONE of these felt familiar...
            </p>
            <Link
              to="/shop"
              className="inline-block"
              style={{
                background: "#DC2627",
                color: "#FFFFFF",
                padding: "16px 38px",
                borderRadius: "8px",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#B8221F";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#DC2627";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              See How LOVABLE Brings It Back →
            </Link>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "11px",
                color: "#9A8880",
                fontWeight: 400,
                letterSpacing: "1px",
                marginTop: "18px",
              }}
            >
              30-Day Money Back{" "}
              <span style={{ color: "#DC2627" }}>•</span> 1,200+ Filipino Couples{" "}
              <span style={{ color: "#DC2627" }}>•</span> Discreet Shipping
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
