import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BuyNow } from "@/components/BuyNow";

export const metadata: Metadata = {
  title: "Buy Now — Angel Food",
  description:
    "Fill your freezer with Angel Food plant-based ready meals — butter curry, lasagna, korma and tofu rice bowls. Cartons of 12, 18 or 24, mixed however you like, delivered across New Zealand.",
  alternates: { canonical: "/buy-now" },
  openGraph: {
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
        intro="Our ready-to-go meals, straight from us. Pick a carton of 12, 18 or 24 and fill it with whatever you fancy — free delivery when you take 24."
      />
      <BuyNow />
    </main>
  );
}
