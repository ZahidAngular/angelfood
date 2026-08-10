import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { NutritionCard } from "@/components/NutritionCard";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema } from "@/lib/schema";
import { NUTRITION_INFO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingredients and nutritional info — Angel Food",
  description:
    "Full ingredients lists and nutrition panels for every Angel Food product.",
  alternates: { canonical: "/ingredients-nutrition-info" },
};

const CATEGORY_ORDER = ["Cheeses", "Meals", "Meats"] as const;

const CATEGORY_INTRO: Record<(typeof CATEGORY_ORDER)[number], string> = {
  Cheeses: "Our dairy-free cheese range — blocks, grated, spreads and crumbles.",
  Meals: "Ready-to-heat plant-based meals, made with real ingredients.",
  Meats: "Plant-based proteins for the grill, the pan and the oven.",
};

export default function IngredientsNutritionInfoPage() {
  return (
    <main>
      <JsonLd
        data={itemListSchema({
          name: "Ingredients and nutritional info",
          url: "/ingredients-nutrition-info",
          items: NUTRITION_INFO.map((entry) => ({
            name: entry.product,
            path: `/ingredients-nutrition-info/${entry.slug}`,
          })),
        })}
      />
      <PageHeader
        eyebrow="Full transparency"
        title="Ingredients and nutritional info."
        intro="Everything that goes into every Angel Food product — pick a product below for its full ingredients list and nutrition panel, straight from the pack."
      />
      <section className="bg-cream pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-5xl space-y-16 px-5 sm:px-8">
          {CATEGORY_ORDER.map((category) => {
            const items = NUTRITION_INFO.filter((n) => n.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <Reveal>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                    ✦ {category}
                  </p>
                  <p className="mt-2.5 max-w-xl text-ink-soft">
                    {CATEGORY_INTRO[category]}
                  </p>
                </Reveal>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {items.map((entry, i) => (
                    <Reveal key={entry.slug} delay={(i % 4) * 0.05}>
                      <NutritionCard entry={entry} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
