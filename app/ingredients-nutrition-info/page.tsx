import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { NUTRITION_INFO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingredients and nutritional info — Angel Food",
  description:
    "Full ingredients lists and nutrition panels for every Angel Food product.",
  alternates: { canonical: "/ingredients-nutrition-info" },
};

const CATEGORY_ORDER = ["Cheeses", "Meals", "Meats"] as const;

export default function IngredientsNutritionInfoPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Full transparency"
        title="Ingredients and nutritional info."
        intro="Everything that goes into every Angel Food product — pick a product below for its full ingredients list and nutrition panel, straight from the pack."
      />
      <section className="bg-cream pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-5xl space-y-14 px-5 sm:px-8">
          {CATEGORY_ORDER.map((category) => {
            const items = NUTRITION_INFO.filter((n) => n.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <Reveal>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                    ✦ {category}
                  </p>
                </Reveal>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {items.map((entry, i) => (
                    <Reveal key={entry.slug} delay={(i % 4) * 0.05}>
                      <Link
                        href={`/ingredients-nutrition-info/${entry.slug}`}
                        className="group flex items-center justify-between rounded-2xl border border-line bg-paper px-6 py-5 transition-colors hover:border-green"
                      >
                        <span className="font-display text-lg font-bold tracking-tight text-ink">
                          {entry.product}
                        </span>
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-green"
                        />
                      </Link>
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
