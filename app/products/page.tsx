import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Products } from "@/components/Products";
import { Meats } from "@/components/Meats";
import { Meals } from "@/components/Meals";

export const metadata: Metadata = {
  title: "Products — Angel Food Vegan Cheese",
  description:
    "Seven dairy-free cheese heroes, plant-based meats and ready-to-go meals. Grated, cream cheese, sour cream, feta, cheddar, mozza, parmesan and more.",
};

const CATEGORIES = [
  { label: "Cheeses", href: "#cheeses" },
  { label: "Meats", href: "#meats" },
  { label: "Meals", href: "#meals" },
];

export default function ProductsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="The range"
        title="Cheese for every craving."
        intro="Seven dairy-free heroes built for real life — pizza nights, cheeseboards, toasties and everything in between."
      />
      <nav
        aria-label="Product categories"
        className="sticky top-24 z-30 flex justify-center gap-3 py-4"
      >
        {CATEGORIES.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            {c.label}
          </a>
        ))}
      </nav>
      <Products />
      <Meats />
      <Meals />
    </main>
  );
}
