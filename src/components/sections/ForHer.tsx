import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";

const FOR_HER_IMAGE =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/12%20(1).png";

const CITRULLINE_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/L-citrulline%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9MLWNpdHJ1bGxpbmUgKDMpLnBuZyIsImlhdCI6MTc3NzE4MzUzOSwiZXhwIjoxODA4NzE5NTM5fQ.SkCLOpUy6t6X8Caq4gpAK03R2QO4XDygkpPYs7H4ri8";
const MAGNESIUM_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Magnesium%20Glycinate%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9NYWduZXNpdW0gR2x5Y2luYXRlICgzKS5wbmciLCJpYXQiOjE3NzcxODM0ODIsImV4cCI6MTgwODcxOTQ4Mn0.ngXdLU22A3MY-ZW24TWKlV45wMgLZikLBWjmQKi4VqI";
const TAURINE_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Taurine%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9UYXVyaW5lICgzKS5wbmciLCJpYXQiOjE3NzcxODM1MDgsImV4cCI6MTgwODcxOTUwOH0.W-WaAuPmoF0etLMZxgAraDTtTOl4rNDjLdOISG2KzJM";
const B6_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Vitamin%20B6%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9WaXRhbWluIEI2ICgzKS5wbmciLCJpYXQiOjE3NzcxODM1MjIsImV4cCI6MTgwODcxOTUyMn0.0fjewp5ehBVAafXhhGaFPPV3NdXt1F1r4CAsZufX9uo";

const ingredients = [
  { img: CITRULLINE_URL, name: "L-Citrulline", benefit: "Blood flow & arousal" },
  { img: MAGNESIUM_URL, name: "Magnesium", benefit: "Mood & balance" },
  { img: TAURINE_URL, name: "Taurine", benefit: "Energy & wellbeing" },
  { img: B6_URL, name: "Vitamin B6", benefit: "Hormonal health" },
];

const benefits = [
  "Supports natural arousal and healthy blood flow",
  "Reduces stress and balances mood naturally",
  "Reconnects you with your body's desires",
  "Boosts energy without artificial stimulants",
  "Helps with dryness and discomfort",
];

export function ForHer() {
  return (
    <section id="forher" className="bg-tier-2 section-divider relative">
      <div className="grid lg:grid-cols-2 min-h-[90vh]">
        {/* SEAMLESS IMAGE: bleeds to edges, fades on right into bg */}
        <div className="relative overflow-hidden min-h-[70vh] lg:min-h-0 lift-halo">
          <img
            src={FOR_HER_IMAGE}
            alt="LOVABLE for Her"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Right-edge fade into the dark background */}
          <div
            className="absolute inset-y-0 right-0 w-40 pointer-events-none hidden lg:block"
            style={{
              background:
                "linear-gradient(to left, var(--color-noir) 0%, rgba(13,13,13,0.6) 40%, rgba(13,13,13,0) 100%)",
            }}
          />
          {/* Mobile: bottom fade */}
          <div
            className="lg:hidden absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,13,13,0) 0%, var(--color-noir) 100%)",
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="flex items-center px-6 sm:px-10 lg:px-20 py-20">
          <Reveal>
            <p className="eyebrow mb-5">For Her</p>
            <h2 className="text-display text-[var(--color-ivory)] text-4xl md:text-[48px] leading-[1.15] max-w-md">
              Feel <span style={{ color: "#A81716", fontStyle: "italic" }}>Balanced, Vibrant,</span> and Alive Again.
            </h2>
            <span className="red-rule mt-7 mb-7" />
            <p className="text-[var(--color-ivory-muted)] text-[16px] leading-[1.9] max-w-md">
              Your body remembers how to feel this way. LOVABLE Drops for Women work <span style={{ color: "#F2EAE0", fontWeight: 600 }}>with your natural chemistry</span>, not against it, to restore what stress, hormones, and time have quietly taken away. No synthetics. No pressure. Just pure support.
            </p>

            <ul className="mt-8 space-y-3 max-w-md">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 items-start text-[var(--color-ivory)]/90 text-[15px]">
                  <span className="mt-2 inline-block w-4 h-px bg-[var(--color-brand-red)] flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 max-w-md">
              <p className="eyebrow mb-4" style={{ color: "var(--color-brand-red)" }}>Key Ingredients</p>
              <div className="grid grid-cols-4 gap-2">
                {ingredients.map((ing) => (
                  <div key={ing.name} className="glass-card rounded-xl p-2 flex flex-col items-center text-center overflow-hidden">
                    <div className="w-full aspect-square flex items-center justify-center">
                      <img src={ing.img} alt={ing.name} loading="lazy" className="max-w-full max-h-full w-auto h-auto object-contain" />
                    </div>
                    <p className="font-serif text-[var(--color-ivory)] text-[12px] mt-1.5 leading-tight">{ing.name}</p>
                    <p className="text-[var(--color-ivory-muted)] text-[10px] mt-0.5 leading-tight">{ing.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Link to="/shop" search={{ variant: "her" }} className="btn-primary btn-shine btn-shine-primary"><span>Shop For Her →</span></Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
