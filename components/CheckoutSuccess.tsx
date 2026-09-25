"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { clearOrder } from "@/lib/cart";
import { usePaymentReference } from "@/lib/checkout";

/**
 * Where Stripe returns a paying customer.
 *
 * The order is cleared here because this page is only reachable from a
 * completed Stripe session — a cancelled payment goes to the cancel URL
 * instead, which leaves the order untouched. The saved delivery details are
 * deliberately kept: most people order again, and it is their own device.
 */
export function CheckoutSuccess() {
  // Stripe appends its session id when the success URL asks for it — the one
  // thing here that ties back to their payment.
  const reference = usePaymentReference();

  useEffect(() => {
    clearOrder();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green text-cream">
        <Check size={28} />
      </div>

      <h1 className="mt-8 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
        Thank you — your order&apos;s in.
      </h1>

      <p className="mt-5 text-lg text-ink-soft">
        A receipt is on its way to your inbox, and we&apos;ll be in touch as soon
        as your meals are on the road.
      </p>

      {reference && (
        <p className="mt-6 inline-block rounded-full border border-line bg-paper px-5 py-2.5 text-sm text-ink-soft">
          Reference <span className="font-bold text-ink">{reference}</span>
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/buy-now"
          className="inline-flex items-center justify-center rounded-full bg-green px-8 py-4 font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.04]"
        >
          Shop again
        </Link>
        <Link
          href="/recipes"
          className="inline-flex items-center justify-center rounded-full border border-line px-8 py-4 font-semibold uppercase tracking-[0.14em] text-green transition-colors hover:bg-paper"
        >
          Find a recipe
        </Link>
      </div>
    </div>
  );
}
