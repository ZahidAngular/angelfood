import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Products } from "@/components/Products";
import { Meats } from "@/components/Meats";
import { Meals } from "@/components/Meals";
import { HashScroll } from "@/components/HashScroll";
import { ProductCategoryNav } from "@/components/ProductCategoryNav";

export const metadata: Metadata = {
  title: "Products — Angel Food Vegan Cheese",
  description:
    "Seven dairy-free cheese heroes, plant-based meats and ready-to-go meals. Grated, cream cheese, sour cream, feta, cheddar, mozza, parmesan and more.",
};

export default function ProductsPage() {
  return (
    <main>
      <HashScroll />
      <PageHeader
        eyebrow="The range"
        title="Cheese for every craving."
        intro="Seven dairy-free heroes built for real life — pizza nights, cheeseboards, toasties and everything in between."
      />
      <ProductCategoryNav />
      <Products />
      <Meats />
      <Meals />
    </main>
  );
}
