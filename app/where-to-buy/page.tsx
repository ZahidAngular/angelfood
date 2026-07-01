import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreLocator } from "@/components/StoreLocator";
import { Stockists } from "@/components/Stockists";

export const metadata: Metadata = {
  title: "Where to Buy — Angel Food",
  description:
    "Find Angel Food vegan cheese on shelves across Aotearoa — PAK'nSAVE, New World, FreshChoice, SuperValue and more.",
};

export default function WhereToBuyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Where to buy"
        title="Find your nearest stockist."
        intro="Stocked in supermarkets and loved by kitchens nationwide — from your weekly shop to your favourite pizza joint."
      />
      <StoreLocator />
      <Stockists />
    </main>
  );
}
