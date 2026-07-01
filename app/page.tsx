import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
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
      <SpinShowcase />
      <Story />
      <Values />
      <Recipes />
      <Stockists />
    </main>
  );
}
