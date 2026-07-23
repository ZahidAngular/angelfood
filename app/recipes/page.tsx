import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PublicRecipeCard } from "@/components/PublicRecipeCard";
import { recipeApi, type Recipe } from "@/lib/api";

export const metadata: Metadata = {
  title: "Recipes — Angel Food",
  description:
    "Delicious plant-based recipes for every occasion — cheesecakes, fritters, soups, salads and more, all made with Angel Food vegan cheese.",
};

export default async function RecipesPage() {
  const recipes: Recipe[] = await recipeApi.getAll().catch(() => []);

  return (
    <main>
      <PageHeader
        eyebrow="From our kitchen"
        title="Delicious plant-based recipes."
        intro="From cheesy weeknight wins to show-stopping desserts — every recipe is built around Angel Food."
      />
      <section className="bg-cream pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {recipes.length === 0 ? (
            <p className="py-16 text-center text-ink-soft">
              No recipes yet — check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {recipes.map((r, i) => (
                <PublicRecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
