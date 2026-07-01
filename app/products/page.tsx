import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Products } from "@/components/Products";
import { Meals } from "@/components/Meals";

export const metadata: Metadata = {
  title: "Products — Angel Food Vegan Cheese",
  description:
    "Seven dairy-free cheese heroes plus ready-to-go plant-based meals. Grated, cream cheese, sour cream, feta, cheddar, mozza and parmesan.",
};

export default function ProductsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="The range"
        title="Cheese for every craving."
        intro="Seven dairy-free heroes built for real life — pizza nights, cheeseboards, toasties and everything in between."
      />
      <Products />
      <Meals />
    </main>
  );
}
