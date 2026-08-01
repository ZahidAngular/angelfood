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
  alternates: { canonical: "/products" },
  openGraph: {
    url: "/products",
    title: "Products — Angel Food Vegan Cheese",
    description:
      "Seven dairy-free cheese heroes, plant-based meats and ready-to-go meals. Grated, cream cheese, sour cream, feta, cheddar, mozza, parmesan and more.",
  },
};

export default function ProductsPage() {
  return (
    <main>
      <HashScroll />
      <PageHeader
        eyebrow="The range"
        title="Your favourite foods, plant-based."
        intro="No FOMO, no compromise — because doing good should taste incredible."
      />
      <ProductCategoryNav />
      <Products />
      <Meats />
      <Meals />
    </main>
  );
}
