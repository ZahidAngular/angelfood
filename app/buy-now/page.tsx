import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BuyNow } from "@/components/BuyNow";

export const metadata: Metadata = {
  title: "Buy Now — Angel Food",
  description:
    "Order Angel Food plant-based meals and meats online — butter curry, lasagna, korma, burgers, meatballs and more, by the single pack or by the carton.",
  alternates: { canonical: "/buy-now" },
};

export default function BuyNowPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Buy now"
        title="By the pack or the carton."
        intro="Our ready-to-go meals and plant-based meats, straight from us. Take a single pack to try, or a carton for the weeks you'd rather not think about dinner."
      />
      <BuyNow />
    </main>
  );
}
