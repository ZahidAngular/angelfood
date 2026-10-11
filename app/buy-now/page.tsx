import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BuyNow } from "@/components/BuyNow";
import { OG_DEFAULTS } from "@/lib/og";

// The 18 and 24 cartons are not on sale at the moment (see BUNDLE_SIZES in
// lib/pricing.ts), so the wording here and in the header below describes the
// 12 and makes no free-delivery promise. Both want putting back when those
// cartons are.
const DESCRIPTION =
  "Fill your freezer with Angel Food plant-based ready meals. A carton of 12, mixed however you like, delivered across New Zealand.";

export const metadata: Metadata = {
  title: "Buy Now — Angel Food",
  description: DESCRIPTION,
  alternates: { canonical: "/buy-now" },
  openGraph: {
    ...OG_DEFAULTS,
    url: "/buy-now",
    title: "Buy Now — Angel Food",
    description: DESCRIPTION,
  },
};

export default function BuyNowPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Buy now"
        title="Fill your freezer."
        intro="Our ready-to-go meals come straight from us, snap frozen to lock in freshness. Pick a carton of 12 and fill it with whatever you fancy."
      />
      <BuyNow />
    </main>
  );
}
