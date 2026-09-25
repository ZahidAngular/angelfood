"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Check, Truck } from "lucide-react";
import { clearOrder } from "@/lib/cart";
import { readReceipt, trackingPath } from "@/lib/orders";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Where a placed order lands.
 *
 * The order number and tracking token arrive in the URL, because that is what
 * the checkout was holding when it redirected. They are read from storage as
 * well: a customer who reloads this page an hour later, or opens it from
 * history, should still see their receipt rather than a blank thank-you.
 *
 * The saved delivery details are deliberately kept — most people order again,
 * and it is their own device.
 */
export function CheckoutSuccess() {
  // Both the query string and the stored receipt are browser-only, so they
  // are read after hydration rather than during the first render.
  const hydrated = useHydrated();

  const order = useMemo(() => {
    if (!hydrated) return null;

    const params = new URLSearchParams(window.location.search);
    const number = params.get("order");
    const token = params.get("token");
    if (number && token) return { number, token };

    const saved = readReceipt();
    return saved
      ? { number: saved.orderNumber, token: saved.trackingToken }
      : null;
  }, [hydrated]);

  useEffect(() => {
    // Belt and braces: the checkout clears the order before navigating, but
    // landing here at all means the order is placed and must not be re-sent.
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
        A confirmation is on its way to your inbox, and we&apos;ll email you
        again each time your order moves.
      </p>

      {order && (
        <>
          <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-line bg-paper px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">
              Order number
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-[0.02em] text-ink">
              {order.number}
            </p>
          </div>

          <Link
            href={trackingPath(order.number, order.token)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-green px-8 py-4 font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.04]"
          >
            <Truck size={16} /> Track your order
          </Link>
        </>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/buy-now"
          className="inline-flex items-center justify-center rounded-full border border-line px-8 py-4 font-semibold uppercase tracking-[0.14em] text-green transition-colors hover:bg-paper"
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
