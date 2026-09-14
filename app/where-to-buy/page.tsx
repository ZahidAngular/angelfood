import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreLocator } from "@/components/StoreLocator";
import { Stockists } from "@/components/Stockists";

export const metadata: Metadata = {
  title: "Where to Buy — Angel Food",
  description:
    "Find Angel Food vegan cheese on shelves across Aotearoa — PAK'nSAVE, New World, Woolworths, Four Square and more. Search by town, filter by product, and get directions.",
  alternates: { canonical: "/where-to-buy" },
};

export default function WhereToBuyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Where to buy"
        title="Find your nearest stockist."
        intro="Stocked in supermarkets and loved by kitchens nationwide — from your weekly shop to your favourite pizza joint. Search your town below, filter by the product you're after, and we'll point you to the closest one."
      />
      <StoreLocator />
      <Stockists />
    </main>
  );
}
