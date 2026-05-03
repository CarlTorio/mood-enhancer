import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";

const FOR_HIM_IMAGE =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/ChatGPT%20Image%20Apr%2027,%202026,%2012_03_26%20AM.png";

const MACA_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Maca%20root%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9NYWNhIHJvb3QgKDIpLnBuZyIsImlhdCI6MTc3NzE4MzI0OCwiZXhwIjoxODA4NzE5MjQ4fQ.9IwEDDT8IOQnYfO9kAzKTAT2jJjjNGnI7dIOdquXh8Q";
const GINSENG_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Panax%20Ginseng%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9QYW5heCBHaW5zZW5nICgyKS5wbmciLCJpYXQiOjE3NzcxODMyMjYsImV4cCI6MTgwODcxOTIyNn0.hQ9cXMPekLvRiNorfNuQtMSIW-wmqnujImCcwsgBjLY";
const TONGKAT_URL = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/Tongkat%20Ali%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy9Ub25na2F0IEFsaSAoMikucG5nIiwiaWF0IjoxNzc3MTgzMjAxLCJleHAiOjE4MDg3MTkyMDF9.OwK3TML6C-li3GrNnWxGK_ur_t78zM9DRCyxs6iIGpA";

const ingredients = [
  { img: MACA_URL, name: "Maca Root", benefit: "Energy & stamina" },
  { img: GINSENG_URL, name: "Panax Ginseng", benefit: "Endurance & clarity" },
  { img: TONGKAT_URL, name: "Tongkat Ali", benefit: "Testosterone support" },
];

const benefits = [
  "Supports healthy testosterone levels naturally",
  "Boosts stamina, energy, and endurance",
  "Improves circulation and physical response",
  "Enhances mental confidence and clarity",
  "100% natural. No synthetic drugs.",
];

export function ForHim() {
  return (
    <section id="forhim" className="bg-tier-3 section-divider relative">
      <div className="grid lg:grid-cols-2 min-h-[90vh]">
        {/* CONTENT */}
        <div className="order-2 lg:order-1 flex items-center px-6 sm:px-10 lg:px-20 py-20">
          <Reveal>
            <p className="eyebrow mb-5">For Him</p>
            <h2 className="text-display text-[var(--color-ivory)] text-4xl md:text-[48px] leading-[1.15] max-w-md">
              Bring Back the <span style={{ color: "#A81716", fontStyle: "italic" }}>Fire.</span> Reclaim Your <span style={{ color: "#A81716", fontStyle: "italic" }}>Confidence.</span>
            </h2>
            <span className="red-rule mt-7 mb-7" />
            <p className="text-[var(--color-ivory-muted)] text-[16px] leading-[1.9] max-w-md">
              When your mind is ready but your body hesitates, LOVABLE Drops for Men work with your body's natural systems to help you show up <span style={{ color: "#F2EAE0", fontWeight: 600 }}>strong, present, and confident.</span> Backed by nature. Built for real men.
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
              <div className="grid grid-cols-3 gap-3">
                {ingredients.map((ing) => (
                  <div key={ing.name} className="glass-card rounded-xl p-3 flex flex-col items-center text-center overflow-hidden">
                    <div className="w-full aspect-square flex items-center justify-center">
                      <img src={ing.img} alt={ing.name} loading="lazy" className="max-w-full max-h-full w-auto h-auto object-contain" />
                    </div>
                    <p className="font-serif text-[var(--color-ivory)] text-[13px] mt-2 leading-tight">{ing.name}</p>
                    <p className="text-[var(--color-ivory-muted)] text-[11px] mt-1 leading-tight">{ing.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Link to="/shop" search={{ variant: "him" }} className="btn-primary btn-shine btn-shine-primary"><span>Shop For Him →</span></Link>
            </div>
          </Reveal>
        </div>

        {/* SEAMLESS IMAGE: bleeds to edges, fades on left into bg */}
        <div className="order-1 lg:order-2 relative overflow-hidden min-h-[70vh] lg:min-h-0 lift-halo">
          <img
            src={FOR_HIM_IMAGE}
            alt="LOVABLE for Him"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Left-edge fade into the warm tier-3 background */}
          <div
            className="absolute inset-y-0 left-0 w-40 pointer-events-none hidden lg:block"
            style={{
              background:
                "linear-gradient(to right, #160808 0%, rgba(22,8,8,0.6) 40%, rgba(22,8,8,0) 100%)",
            }}
          />
          {/* Mobile: bottom fade */}
          <div
            className="lg:hidden absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(22,8,8,0) 0%, #160808 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
