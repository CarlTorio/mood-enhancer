import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { SocialProofToast } from "@/components/SocialProofToast";

import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { VSL } from "@/components/sections/VSL";
import { PainPoints } from "@/components/sections/PainPoints";
import { ForHer } from "@/components/sections/ForHer";
import { ForHim } from "@/components/sections/ForHim";
import { SocialProof } from "@/components/sections/SocialProof";
import { Promise } from "@/components/sections/Promise";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOVABLE Mood Drops PH | Bumalik yung kilig, naturally." },
      {
        name: "description",
        content:
          "Natural mood enhancer drops formulated for Filipino couples. FDA-registered, 30-day money-back guarantee. Bumalik yung kilig.",
      },
      { property: "og:title", content: "LOVABLE Mood Drops PH | Bumalik yung kilig, naturally." },
      {
        property: "og:description",
        content:
          "Natural mood enhancer drops formulated for Filipino couples. FDA-registered, 30-day money-back guarantee.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[var(--color-noir)] text-[var(--color-ivory)]">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <VSL />
        <PainPoints />
        <ForHer />
        <ForHim />
        <SocialProof />
        <Promise />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <SocialProofToast />
      
    </div>
  );
}
