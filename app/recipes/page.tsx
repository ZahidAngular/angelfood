import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { RecipesGrid } from "@/components/Recipes";

export const metadata: Metadata = {
  title: "Recipes — Angel Food",
  description:
    "Delicious plant-based recipes for every occasion — cheesecakes, fritters, soups, salads and more, all made with Angel Food vegan cheese.",
};

export default function RecipesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="From our kitchen"
        title="Delicious plant-based recipes."
        intro="From cheesy weeknight wins to show-stopping desserts — every recipe is built around Angel Food."
      />
      <RecipesGrid />
    </main>
  );
}
