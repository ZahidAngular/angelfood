import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { NUTRITION_INFO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingredients and nutritional info — Angel Food",
  description:
    "Full ingredients lists and nutrition panels for every Angel Food product.",
  alternates: { canonical: "/ingredients-nutrition-info" },
};

export default function IngredientsNutritionInfoPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Full transparency"
        title="Ingredients and nutritional info."
        intro="Everything that goes into every Angel Food product — ingredients and nutrition panels, straight from the pack."
      />
      <section className="bg-cream pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-5xl divide-y divide-line px-5 sm:px-8">
          {NUTRITION_INFO.map((entry, i) => (
            <div key={entry.slug} id={entry.slug} className="scroll-mt-28 py-10 first:pt-0 sm:py-14">
              <Reveal>
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                      {entry.product}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                      {entry.ingredients}
                    </p>
                  </div>
                  {entry.nutritionImage && (
                    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
                      <Image
                        src={entry.nutritionImage}
                        alt={`${entry.product} nutrition panel`}
                        width={640}
                        height={480}
                        className="h-auto w-full"
                      />
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
