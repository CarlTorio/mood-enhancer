import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, ShieldCheck, BadgeCheck, PackageCheck, Headphones } from "lucide-react";


const logo = "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/Final%20Lovable%20Logo%20copy.png";

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span className="text-[var(--color-gold)]">{icon}</span>
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 10,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(242,234,224,0.85)",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}


export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.06] text-[var(--color-ivory)]">
      {/* Trust signals row */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 grid grid-cols-2 md:grid-cols-4">
          <TrustItem icon={<ShieldCheck size={16} strokeWidth={1.5} />} label="30-Day Guarantee" />
          <TrustItem icon={<BadgeCheck size={16} strokeWidth={1.5} />} label="FDA-Registered" />
          <TrustItem icon={<PackageCheck size={16} strokeWidth={1.5} />} label="Discreet Shipping" />
          <TrustItem icon={<Headphones size={16} strokeWidth={1.5} />} label="24/7 Support" />
        </div>
      </div>

      {/* Main nav columns */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-14 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="LOVABLE" className="h-9 w-auto mb-5" />
          <p className="text-sm leading-relaxed text-[var(--color-ivory-muted)] max-w-xs">
            Feel Normal Again. Live Fully Again. Love Deeply Again.
          </p>
          {/* Social */}
          <div className="mt-6 flex items-center gap-4">
            {[
              { icon: <Facebook size={18} />, label: "Facebook", href: "#" },
              { icon: <Instagram size={18} />, label: "Instagram", href: "#" },
              { icon: <Youtube size={18} />, label: "YouTube", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="social-icon"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: "0.5px solid rgba(184,149,90,0.3)",
                  color: "#B8955A",
                  transition: "all 250ms ease",
                }}
              >
                {s.icon}
              </a>
            ))}
            <a
              href="#"
              aria-label="TikTok"
              className="social-icon"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "0.5px solid rgba(184,149,90,0.3)",
                color: "#B8955A",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: 11,
                transition: "all 250ms ease",
              }}
            >
              TT
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-brand-red)] font-semibold mb-5">Shop</h5>
          <ul className="space-y-3 text-sm text-[var(--color-ivory)]/80">
            <li><Link to="/shop" search={{ variant: "her" }} className="hover:text-[var(--color-brand-red)] transition-colors">For Her</Link></li>
            <li><Link to="/shop" search={{ variant: "him" }} className="hover:text-[var(--color-brand-red)] transition-colors">For Him</Link></li>
            <li><Link to="/shop" search={{ variant: "couples" }} className="hover:text-[var(--color-brand-red)] transition-colors">Couples Bundle</Link></li>
            <li><Link to="/shop" search={{ variant: "couples" }} className="hover:text-[var(--color-brand-red)] transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-brand-red)] font-semibold mb-5">Support</h5>
          <ul className="space-y-3 text-sm text-[var(--color-ivory)]/80">
            <li><Link to="/" hash="story" className="hover:text-[var(--color-brand-red)] transition-colors">Our Story</Link></li>
            <li><Link to="/" hash="faq" className="hover:text-[var(--color-brand-red)] transition-colors">FAQ</Link></li>
            <li><a href="mailto:admin@lovablecouple.shop" className="hover:text-[var(--color-brand-red)] transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-[var(--color-brand-red)] transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-[var(--color-brand-red)] transition-colors">​</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-brand-red)] font-semibold mb-5">Contact</h5>
          <ul className="space-y-3 text-sm text-[var(--color-ivory)]/80">
            <li>admin@lovablecouple.shop</li>
            <li>0935-7314-280</li>
            <li>Lovable Philippines</li>
            <li className="text-[var(--color-ivory-muted)] text-xs">Open hours: Mon-Sat 9am to 6pm PHT</li>
          </ul>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-6">
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 10,
              lineHeight: 1.6,
              color: "rgba(154,136,128,0.7)",
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[var(--color-ivory-muted)] tracking-wider">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
            <span>Payment:</span>
            <span>GCash</span><span>·</span>
            <span>Maya</span><span>·</span>
            <span>Visa</span><span>·</span>
            <span>Mastercard</span><span>·</span>
            <span>COD</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
            <a href="#" className="hover:text-[var(--color-brand-red)] transition-colors">Privacy</a><span>·</span>
            <a href="#" className="hover:text-[var(--color-brand-red)] transition-colors">Terms</a><span>·</span>
            <a href="#" className="hover:text-[var(--color-brand-red)] transition-colors">Shipping</a><span>·</span>
            <a href="#" className="hover:text-[var(--color-brand-red)] transition-colors">Returns</a>
          </div>
          <div>© 2026 LOVABLE Philippines. All rights reserved.</div>
        </div>
      </div>

      <style>{`
        .social-icon:hover {
          color: #DC2627 !important;
          border-color: #DC2627 !important;
          background: rgba(220, 38, 39, 0.06);
        }
      `}</style>
    </footer>
  );
}
