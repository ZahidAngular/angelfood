import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BuyNow } from "@/components/BuyNow";

export const metadata: Metadata = {
  title: "Buy Now — Angel Food",
  description:
    "Order Angel Food plant-based ready meals online — butter curry, lasagna, korma and tofu rice bowls, by the single pack or by the carton.",
  alternates: { canonical: "/buy-now" },
};

export default function BuyNowPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Buy now"
        title="Meals, by the pack or the carton."
        intro="Our ready-to-go plant-based meals, straight from us. Take a single pack to try, or a carton for the weeks you'd rather not think about dinner."
      />
      <BuyNow />
    </main>
  );
}
