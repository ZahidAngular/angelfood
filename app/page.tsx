import { Hero } from "@/components/Hero";
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
      <Hero />
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
