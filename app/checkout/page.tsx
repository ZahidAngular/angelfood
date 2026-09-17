import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Angel Food",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="bg-cream pb-24 pt-40 sm:pb-32 sm:pt-52">
      <CheckoutForm />
    </main>
  );
}
