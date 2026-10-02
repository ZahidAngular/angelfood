import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BuyNow } from "@/components/BuyNow";
import { OG_DEFAULTS } from "@/lib/og";

export const metadata: Metadata = {
  title: "Buy Now — Angel Food",
  description:
    "Fill your freezer with Angel Food plant-based ready meals. Cartons of 12, 18 or 24, mixed however you like, delivered across New Zealand.",
  alternates: { canonical: "/buy-now" },
  openGraph: {
    ...OG_DEFAULTS,
    url: "/buy-now",
    title: "Buy Now — Angel Food",
    description:
      "Fill your freezer with Angel Food plant-based ready meals. Cartons of 12, 18 or 24, mixed however you like, delivered across New Zealand.",
  },
};

export default function BuyNowPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Buy now"
        title="Fill your freezer."
        intro="Our ready-to-go meals come straight from us, snap frozen to lock in freshness. Pick a carton of 12, 18 or 24 and fill it with whatever you fancy — free delivery when you take 24."
      />
      <BuyNow />
    </main>
  );
}
