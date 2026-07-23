import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreLocator } from "@/components/StoreLocator";
import { Stockists } from "@/components/Stockists";
import { getStoreData } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Where to Buy — Angel Food",
  description:
    "Find Angel Food vegan cheese on shelves across Aotearoa — PAK'nSAVE, New World, Woolworths, Four Square and more. Search by town, filter by product, and get directions.",
};

export default async function WhereToBuyPage() {
  const data = await getStoreData();

  return (
    <main>
      <PageHeader
        eyebrow="Where to buy"
        title="Find your nearest stockist."
        intro={
          data.stores.length
            ? `Angel Food is on shelves at ${data.stores.length} stores across Aotearoa. Search your town, filter by the product you're after, and we'll point you to the closest one.`
            : "Stocked in supermarkets and loved by kitchens nationwide — from your weekly shop to your favourite pizza joint."
        }
      />
      <StoreLocator data={data} />
      <Stockists />
    </main>
  );
}
