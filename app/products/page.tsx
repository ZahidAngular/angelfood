import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Products } from "@/components/Products";
import { Meats } from "@/components/Meats";
import { Meals } from "@/components/Meals";
import { HashScroll } from "@/components/HashScroll";
import { ProductCategoryNav } from "@/components/ProductCategoryNav";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema } from "@/lib/schema";
import { PRODUCTS, MEATS, MEALS, getNutritionSlug } from "@/lib/site";

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
  // Cheeses, meats and meals share one listing page, so they share one list —
  // each entry points at its own ingredients page, which is the only per-product
  // URL the range has.
  const allProducts = [...PRODUCTS, ...MEATS, ...MEALS];

  return (
    <main>
      <JsonLd
        data={itemListSchema({
          name: "The Angel Food range",
          url: "/products",
          items: allProducts.flatMap((product) => {
            const slug = getNutritionSlug(product.name);
            return slug
              ? [
                  {
                    name: product.name,
                    path: `/ingredients-nutrition-info/${slug}`,
                  },
                ]
              : [];
          }),
        })}
      />
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
