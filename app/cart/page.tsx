import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopping Cart — Angel Food",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <main className="bg-cream pb-24 pt-40 sm:pb-32 sm:pt-52">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-line bg-paper text-ink-soft">
          <ShoppingCart size={26} />
        </div>
        <h1 className="mt-8 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
          Shopping Cart
        </h1>
        <p className="mt-5 text-lg text-ink-soft">
          You have nothing in your shopping cart.
        </p>
        <Link
          href="/products"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-green px-8 py-4 font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.04]"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
