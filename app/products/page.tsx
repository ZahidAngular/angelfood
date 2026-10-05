import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Products } from "@/components/Products";
import { Meats } from "@/components/Meats";
import { Meals } from "@/components/Meals";
import { WhyChooseRange } from "@/components/WhyChooseRange";
import { ProductsHeaderArt } from "@/components/ProductsHeaderArt";
import { HashScroll } from "@/components/HashScroll";
import { ProductCategoryNav } from "@/components/ProductCategoryNav";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema, productSchema } from "@/lib/schema";
import { PRODUCTS, MEATS, MEALS, getNutritionSlug } from "@/lib/site";
import { OG_DEFAULTS } from "@/lib/og";

const TITLE = "Plant Based Food NZ | Vegan Cheese, Meat & Meals";
const DESCRIPTION =
  "Shop plant based food NZ-wide dairy free cheese, plant-based meats & ready meals from Aotearoa's original vegan food company since 2006.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/products" },
  openGraph: {
    ...OG_DEFAULTS,
    url: "/products",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ProductsPage() {
  // Cheeses, meats and meals share one listing page, so they share one list —
  // each entry points at its own ingredients page, which is the only per-product
  // URL the range has.
  const allProducts = [
    ...PRODUCTS.map((product) => ({ product, category: "Vegan cheese" })),
    ...MEATS.map((product) => ({ product, category: "Plant-based meat" })),
    ...MEALS.map((product) => ({ product, category: "Plant-based ready meal" })),
  ];

  // Where a product has an ingredients page, that page is its canonical URL;
  // the rest are only ever shown here, so they point back at this listing.
  const productUrl = (name: string) => {
    const slug = getNutritionSlug(name);
    return slug ? `/ingredients-nutrition-info/${slug}` : "/products";
  };

  return (
    <main>
      <JsonLd
        data={itemListSchema({
          name: "The Angel Food range",
          url: "/products",
          items: allProducts.flatMap(({ product }) => {
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
      {/* One Product block per item in the range, so each can earn its own
          rich result rather than the page being read as a single thing. */}
      {allProducts.map(({ product, category }) => (
        <JsonLd
          key={product.name}
          data={productSchema({
            name: product.name,
            description: product.blurb,
            image: product.image,
            url: productUrl(product.name),
            category,
          })}
        />
      ))}
      <HashScroll />
      <PageHeader
        eyebrow="The range"
        title="Plant Based Food NZ; Your Favourite Foods, Reimagined."
        intro="Angel Food makes the plant based food New Zealanders actually crave no FOMO, no compromise. From dairy free cheese that melts and stretches like the real thing, to plant-based meat and ready to-go meals, our range covers every craving, every night of the week. 100% plant-based, proudly made with Aotearoa in mind."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ]}
        media={<ProductsHeaderArt />}
      />
      <ProductCategoryNav />
      <Products />
      <Meats />
      <Meals />
      <WhyChooseRange />
    </main>
  );
}
