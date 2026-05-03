import { useState } from "react";
import { Reveal } from "../Reveal";

const MACA_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Maca%20root%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9NYWNhIHJvb3QgKDIpLnBuZyIsImlhdCI6MTc3NzE4MzI0OCwiZXhwIjoxODA4NzE5MjQ4fQ.9IwEDDT8IOQnYfO9kAzKTAT2jJjjNGnI7dIOdquXh8Q";
const GINSENG_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Panax%20Ginseng%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9QYW5heCBHaW5zZW5nICgyKS5wbmciLCJpYXQiOjE3NzcxODMyMjYsImV4cCI6MTgwODcxOTIyNn0.hQ9cXMPekLvRiNorfNuQtMSIW-wmqnujImCcwsgBjLY";
const TONGKAT_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Tongkat%20Ali%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9Ub25na2F0IEFsaSAoMikucG5nIiwiaWF0IjoxNzc3MTgzMjAxLCJleHAiOjE4MDg3MTkyMDF9.OwK3TML6C-li3GrNnWxGK_ur_t78zM9DRCyxs6iIGpA";
const CITRULLINE_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/L-citrulline%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9MLWNpdHJ1bGxpbmUgKDMpLnBuZyIsImlhdCI6MTc3NzE4MzUzOSwiZXhwIjoxODA4NzE5NTM5fQ.SkCLOpUy6t6X8Caq4gpAK03R2QO4XDygkpPYs7H4ri8";
const MAGNESIUM_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Magnesium%20Glycinate%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9NYWduZXNpdW0gR2x5Y2luYXRlICgzKS5wbmciLCJpYXQiOjE3NzcxODM0ODIsImV4cCI6MTgwODcxOTQ4Mn0.ngXdLU22A3MY-ZW24TWKlV45wMgLZikLBWjmQKi4VqI";
const TAURINE_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Taurine%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9UYXVyaW5lICgzKS5wbmciLCJpYXQiOjE3NzcxODM1MDgsImV4cCI6MTgwODcxOTUwOH0.W-WaAuPmoF0etLMZxgAraDTtTOl4rNDjLdOISG2KzJM";
const B6_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Vitamin%20B6%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9WaXRhbWluIEI2ICgzKS5wbmciLCJpYXQiOjE3NzcxODM1MjIsImV4cCI6MTgwODcxOTUyMn0.0fjewp5ehBVAafXhhGaFPPV3NdXt1F1r4CAsZufX9uo";

const him = [
  { img: MACA_URL, name: "Maca Root", desc: "Boosts energy, stamina, and natural drive" },
  { img: GINSENG_URL, name: "Panax Ginseng", desc: "Enhances endurance and mental clarity" },
  { img: TONGKAT_URL, name: "Tongkat Ali", desc: "Supports healthy testosterone levels naturally" },
];

const her = [
  { img: CITRULLINE_URL, name: "L-Citrulline", desc: "Supports healthy blood flow and natural arousal" },
  { img: MAGNESIUM_URL, name: "Magnesium Glycinate", desc: "Calms stress, supports hormonal balance" },
  { img: TAURINE_URL, name: "Taurine", desc: "Boosts energy and emotional wellbeing" },
  { img: B6_URL, name: "Vitamin B6", desc: "Supports mood, energy, and hormonal health" },
];

export function Ingredients() {
  const [tab, setTab] = useState<"him" | "her">("him");
  const items = tab === "him" ? him : her;

  return (
    <section className="bg-tier-2 section-divider relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="eyebrow mb-5">What's Inside</p>
            <h2 className="text-display text-[var(--color-ivory)] text-4xl md:text-[44px] leading-[1.15]">
              Every Drop Backed by Nature and Science
            </h2>
            <p className="mt-5 text-[var(--color-ivory-muted)] text-base leading-relaxed">
              No fillers. No synthetics. Just pure researched ingredients that work with your body.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex p-1 rounded-full border border-white/10 bg-white/[0.03]">
            {(["him", "her"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 sm:px-8 py-2.5 rounded-full text-[11px] tracking-[0.22em] uppercase font-semibold transition-all ${
                  tab === t
                    ? "bg-[var(--color-brand-red)] text-white"
                    : "text-[var(--color-ivory)]/70 hover:text-[var(--color-ivory)]"
                }`}
              >
                For {t === "him" ? "Him" : "Her"}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-14 grid gap-6 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.07}>
              <div className="lift-card overflow-hidden h-full">
                <div className="aspect-square overflow-hidden">
                  <img src={it.img} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-[var(--color-ivory)] text-xl mb-2">{it.name}</h3>
                  <p className="text-[var(--color-ivory-muted)] text-sm leading-relaxed">{it.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
