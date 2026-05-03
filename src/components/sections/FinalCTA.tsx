import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";

const hero = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2028,%202026,%2002_19_52%20AM.png";

export function FinalCTA() {
  return (
    <section id="forcouples" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden section-divider bg-tier-1">
      <img src={hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "blur(2px)" }} />
      <div className="absolute inset-0" style={{ background: "rgba(10, 6, 6, 0.6)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0606 0%, transparent 50%, rgba(10,6,6,0.3) 100%)" }} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center py-24">
        <Reveal>
          <h2 className="text-display text-[var(--color-ivory)] text-4xl sm:text-5xl md:text-[60px] leading-[1.05]">
            Ready to Feel Like <span style={{ color: "#A81716", fontStyle: "italic" }}>Yourselves</span> Again?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 text-[var(--color-ivory)]/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Join thousands of Filipino couples who chose to <span style={{ color: "#F2EAE0", fontWeight: 600 }}>reignite their connection</span>. Naturally.
          </p>
          <p
            className="mt-4 text-[12px] sm:text-[13px] italic max-w-lg mx-auto"
            style={{ color: "rgba(184, 149, 90, 0.85)", letterSpacing: "0.3px" }}
          >
            Bundle orders include <em style={{ color: "#C9A06D", fontStyle: "italic", fontWeight: 500 }}>The Reconnection Manual</em>, our private guide for couples.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="final-cta-buttons-row">
            <Link to="/shop" search={{ variant: "her" }} className="final-cta-btn"><span>Shop For Her</span> <span className="arrow">→</span></Link>
            <Link to="/shop" search={{ variant: "him" }} className="final-cta-btn"><span>Shop For Him</span> <span className="arrow">→</span></Link>
            <Link to="/shop" search={{ variant: "couples" }} className="final-cta-btn"><span>Couples Bundle</span> <span className="arrow">→</span></Link>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-12 text-[12px] tracking-[0.18em] uppercase text-[var(--color-ivory)]/60">
            🔒 Secure Checkout · 🚚 Free Nationwide Shipping · 💳 GCash, Maya, COD
          </p>
          <p className="mt-3 text-[11px] italic text-[var(--color-ivory)]/55">
            Free shipping to anywhere in the Philippines. No minimum.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
