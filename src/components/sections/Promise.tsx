import { useEffect, useRef, useState } from "react";

type Item = {
  number: string;
  title: string;
  accent: string;
  description: string;
  badge?: boolean;
};

const items: Item[] = [
  {
    number: "01",
    title: "Backed by",
    accent: "Science",
    description:
      "Studied in British Journal of Nutrition, Journal of Sexual Medicine, and Fertility & Sterility Journal.",
  },
  {
    number: "02",
    title: "Pure",
    accent: "Botanicals",
    description:
      "No synthetic hormones, no dangerous chemicals. Only clinically-researched ingredients.",
  },
  {
    number: "03",
    title: "Couple-",
    accent: "Formulated",
    description:
      "Separate precision formulas for Him and Her. Designed by hormonal wellness experts.",
  },
  {
    number: "04",
    title: "Built for",
    accent: "Daily Use",
    description:
      "Safe for consistent, long-term use with cumulative benefits. No tolerance buildup, no dependency.",
  },
  {
    number: "05",
    title: "Third-Party",
    accent: "Tested",
    description:
      "Every batch verified for purity and potency. Certificate of Analysis available upon request.",
  },
  {
    number: "06",
    title: "Made in",
    accent: "USA",
    description:
      "Manufactured in FDA-registered, GMP-certified USA facility with verified safety standards.",
    badge: true,
  },
];

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export function Promise() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(220,38,39,0.05), transparent 60%), #160808",
      }}
      className="section-divider relative w-full py-[60px] md:py-[100px]"
    >
      <div className="mx-auto" style={{ maxWidth: "1000px", padding: "0 24px" }}>
        {/* Header */}
        <div
          className="text-center mx-auto"
          style={{
            marginBottom: "64px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 500ms ${EASE}, transform 500ms ${EASE}`,
          }}
        >
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#DC2627",
              marginBottom: "20px",
            }}
          >
            The Lovable Promise
          </p>
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              color: "#F2EAE0",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            We Stand Behind{" "}
            <span style={{ color: "#B8955A", fontStyle: "italic" }}>
              Every Drop.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              color: "#9A8880",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Six commitments behind every bottle. No exceptions, no fine print.
          </p>
        </div>

        {/* Manifesto grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 mx-auto"
          style={{ gap: 0, maxWidth: "900px" }}
        >
          {items.map((item, i) => {
            const isLeftCol = i % 2 === 0;
            const isTopFour = i < 4;
            const isHovered = hovered === i;

            const borderRight =
              !isMobile && isLeftCol
                ? "0.5px solid rgba(184, 149, 90, 0.18)"
                : "none";
            const borderBottom = isMobile
              ? i < items.length - 1
                ? "0.5px solid rgba(184, 149, 90, 0.18)"
                : "none"
              : isTopFour
                ? "0.5px solid rgba(184, 149, 90, 0.18)"
                : "none";

            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative"
                style={{
                  padding: isMobile
                    ? "24px 20px"
                    : "clamp(28px, 3vw, 36px) clamp(24px, 2.5vw, 32px)",
                  borderRight,
                  borderBottom,
                  background: isHovered
                    ? "rgba(184, 149, 90, 0.04)"
                    : "transparent",
                  cursor: "default",
                  transition: `all 350ms ${EASE}`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: visible ? `${i * 80 + 200}ms` : "0ms",
                }}
              >
                {/* Gold accent slide-in */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: isHovered ? "4px" : "0px",
                    height: "40px",
                    background: "#B8955A",
                    transform: "translateY(-50%)",
                    transition: `width 400ms ${EASE}`,
                  }}
                />

                <span
                  style={{
                    display: "block",
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    color: isHovered ? "#D4B27A" : "#B8955A",
                    fontSize: isMobile ? "32px" : "40px",
                    lineHeight: 1,
                    marginBottom: "16px",
                    transition: `color 350ms ${EASE}`,
                  }}
                >
                  {item.number}
                </span>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#F2EAE0",
                    fontSize: "19px",
                    fontWeight: 400,
                    lineHeight: 1.3,
                    marginBottom: "8px",
                    letterSpacing: isHovered ? "0.01em" : "0",
                    transition: `letter-spacing 350ms ${EASE}`,
                  }}
                >
                  {item.title}{" "}
                  <span style={{ color: "#DC2627", fontStyle: "italic" }}>
                    {item.accent}
                  </span>
                </h3>

                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "rgba(154, 136, 128, 0.85)",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>

                {item.badge && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(184, 149, 90, 0.1)",
                      border: "0.5px solid rgba(184, 149, 90, 0.3)",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      marginTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "#DC2627",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "9px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#B8955A",
                        fontWeight: 600,
                      }}
                    >
                      FDA-Registered · GMP-Certified
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing CTA */}
        <div
          className="text-center"
          style={{
            marginTop: "60px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 500ms ${EASE}, transform 500ms ${EASE}`,
            transitionDelay: visible ? `${items.length * 80 + 300}ms` : "0ms",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: "#F2EAE0",
              marginBottom: "24px",
            }}
          >
            Ready to feel it again?
          </p>
          <a href="/shop" className="btn-primary btn-shine btn-shine-primary inline-block">
            <span>SHOP NOW</span>
          </a>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "11px",
              color: "#9A8880",
              letterSpacing: "1px",
              marginTop: "16px",
            }}
          >
            Free nationwide shipping · 100% money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
