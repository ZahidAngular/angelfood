import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { SpinShowcase } from "@/components/SpinShowcase";
import { Story } from "@/components/Story";
import { Values } from "@/components/Values";
import { Recipes } from "@/components/Recipes";
import { Stockists } from "@/components/Stockists";
import { recipeApi, type Recipe } from "@/lib/api";

export default async function Home() {
  const recipes: Recipe[] = await recipeApi.getAll().catch(() => []);

  return (
    <main>
      <Hero />
      <Marquee />
      <CategoryShowcase />
      <SpinShowcase />
      <Story />
      <Values />
      <Recipes recipes={recipes} />
      <Stockists />
    </main>
  );
}
