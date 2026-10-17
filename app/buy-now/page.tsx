import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BuyNow } from "@/components/BuyNow";
import { OG_DEFAULTS } from "@/lib/og";
import { DELIVERY, PRE_SALE, formatPriceShort } from "@/lib/pricing";

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
        intro={
          PRE_SALE.active ? (
            <>
              <strong className="font-bold text-green">Pre-sales open now!</strong>{" "}
              Free delivery on every pre-sale order — order by {PRE_SALE.orderBy}{" "}
              and we will deliver {PRE_SALE.deliveredBy}. Regular delivery is{" "}
              {formatPriceShort(DELIVERY.northIsland)}.
              <br />
              <span className="mt-2 inline-block">
                Our ready-to-go meals come straight from us, snap frozen to lock
                in freshness. Pick a carton of {PRE_SALE.bundle} and fill it with
                whatever you fancy.
              </span>
            </>
          ) : (
            "Our ready-to-go meals come straight from us, snap frozen to lock in freshness. Pick a carton of 12 and fill it with whatever you fancy."
          )
        }
      />
      <BuyNow />
    </main>
  );
}
