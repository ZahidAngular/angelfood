import type { Metadata } from "next";
import { CheckoutSuccess } from "@/components/CheckoutSuccess";

export const metadata: Metadata = {
  title: "Order confirmed — Angel Food",
  alternates: { canonical: "/checkout/success" },
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="bg-cream pb-24 pt-40 sm:pb-32 sm:pt-52">
      <CheckoutSuccess />
    </main>
  );
}
