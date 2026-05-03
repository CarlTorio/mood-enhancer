import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "../Reveal";

const items = [
  { q: "Magkano po ang LOVABLE Drops?", a: "₱599 per bottle (1-month supply). For best value, get 2 bottles for ₱899 (save ₱299) or 3 bottles for ₱1,199 (save ₱598). Our Couples Bundle starts at ₱1,099 and includes one bottle each for him and her, perfect para sa magkasamang biyahe pabalik sa intimacy." },
  { q: "Pwede ba kaming pareho uminom ng mister/misis ko?", a: "Opo! In fact, ito ang most popular setup namin. Hiwalay ang formula for him at for her, kasi iba ang katawan, iba ang chemistry. Pinaka-effective kapag pareho kayong umiinom dahil parehong nag-rereignite ang inyong bodies. Try our Couples Bundle para mas sulit." },
  { q: "Saan ito ginagawa? Legit ba ang LOVABLE?", a: "Made in USA sa FDA-registered facility, third-party tested for purity and potency. Distributed officially in the Philippines. We're a registered business with verified address (12th Floor Paragon Plaza Building) and 1,200+ verified customer reviews. 100% legit, 100% transparent." },
  { q: "Kailan dadating ang order ko? Discreet ba ang packaging?", a: "2-5 business days within Metro Manila, 5-7 days nationwide via J&T, Ninja Van, or Flash Express. Yung packaging namin? 100% discreet, plain brown box, no branding outside, walang label na nagsasabi kung ano laman. Walang makakaalam kundi ikaw." },
  { q: "Paano kung hindi gumana sa akin?", a: "Simple: i-return mo within 30 days at full refund agad, kahit nainom mo na ang buong bottle. Walang tanong, walang hassle. Ito ang LOVABLE Promise. Kung hindi mo madama yung difference, hindi ka magbabayad. That's how confident kami sa product." },
  { q: "How soon will I feel a difference?", a: "Most feel increased energy and mood within 7-14 days. Peak results after 20-30 days of consistent daily use." },
  { q: "Is LOVABLE safe? Any side effects?", a: "Completely safe. Formulated with natural amino acids, minerals, and botanicals. No synthetic drugs, no hormones, no known side effects." },
  { q: "How do I take it?", a: "1/2 dropper under the tongue or mixed in water, coffee, or any drink. 1-2 times daily. Takes 5 seconds." },
  { q: "Is this like a blue pill?", a: "No. LOVABLE nourishes your body's own natural systems over time, not a quick artificial fix. It's wellness, not a drug." },
  { q: "What's your return policy?", a: "30-day full money-back guarantee. Return unused portion for a complete refund, no questions, no hassle." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-tier-3 section-divider relative py-24 md:py-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-5">Questions & Answers</p>
            <h2 className="text-display text-[var(--color-ivory)] text-4xl md:text-[44px] leading-[1.15]">
              <span style={{ color: "#F2EAE0", fontWeight: 600 }}>Everything</span> You Need to Know
            </h2>
          </div>
        </Reveal>

        <div className="border-t border-white/[0.08]">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="border-b border-white/[0.08]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-serif text-[var(--color-ivory)] text-lg sm:text-[20px] leading-snug">{it.q}</h3>
                  <span
                    className={`flex-shrink-0 h-9 w-9 rounded-full border border-[var(--color-brand-red)]/40 text-[var(--color-brand-red)] flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[var(--color-ivory-muted)] text-[15px] leading-[1.85] max-w-2xl">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
