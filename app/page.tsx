import { Hero } from "@/components/Hero";
import { PreSaleHero } from "@/components/PreSaleHero";
import { PRE_SALE } from "@/lib/pricing";
import { Marquee } from "@/components/Marquee";
import { OriginBanner } from "@/components/OriginBanner";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { SpinShowcase } from "@/components/SpinShowcase";
import { Story } from "@/components/Story";
import { Values } from "@/components/Values";
import { Recipes } from "@/components/Recipes";
import { Stockists } from "@/components/Stockists";

export default function Home() {
  return (
    <main>
      {/* Two heroes, not one with a switch in it. The pre-sale has a
          headline, an offer, a paragraph, two dates and two buttons where
          the standing hero has three words — they want different layouts,
          and threading both through one component is what made the last
          few rounds of this fight itself. */}
      {PRE_SALE.active ? <PreSaleHero /> : <Hero />}
      <Marquee />
      <OriginBanner />
      <CategoryShowcase />
      <SpinShowcase />
      <Story />
      <Values />
      <Recipes />
      <Stockists />
    </main>
  );
}
