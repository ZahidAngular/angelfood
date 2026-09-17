import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart — Angel Food",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <main className="bg-cream pb-24 pt-40 sm:pb-32 sm:pt-52">
      <CartView />
    </main>
  );
}
