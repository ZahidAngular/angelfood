"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, ShoppingCart, Trash2 } from "lucide-react";
import { OrderNotice, PostcodeField, QuantityStepper, Totals } from "./BuyNow";
import {
  clearCart,
  lineItems,
  priceOf,
  removeLine,
  setLineQuantity,
  useCart,
} from "@/lib/cart";
import { packLabel } from "@/lib/shop";
import { useDeliveryPostcode, useDeliveryRate } from "@/lib/delivery";
import { formatPrice, orderTotals } from "@/lib/pricing";

export function CartView() {
  const { lines, items, freight } = useCart();
  const postcode = useDeliveryPostcode();
  const rateState = useDeliveryRate(postcode);
  const totals = orderTotals(lines.map(priceOf), rateState.rate, freight);

  if (items === 0) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <header className="text-center">
        <h1 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
          Your order
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          {totals.items} {totals.items === 1 ? "item" : "items"} in{" "}
          {totals.cartons} {totals.cartons === 1 ? "carton" : "cartons"}.
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
        <ul className="divide-y divide-line overflow-hidden rounded-[1.75rem] border border-line bg-paper">
          {lines.map((line) => (
            <li
              key={`${line.code}:${line.packSize}`}
              className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream">
                {line.image ? (
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center font-display text-2xl font-extrabold text-green/40">
                    {line.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-tight text-ink">
                  {line.name}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {packLabel(line.packSize, line)} ·{" "}
                  {lineItems(line) === 1 ? "1 item" : `${lineItems(line)} items`}
                </p>
              </div>

              {/* On a narrow screen these wrap onto their own row under the
                  meal, which is why they sit in a spread-out group. */}
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                <QuantityStepper
                  label={`${line.name}, ${packLabel(line.packSize, line)}`}
                  value={line.quantity}
                  onChange={(next) => setLineQuantity(line.code, line.packSize, next)}
                />
                <span className="font-display text-lg font-bold text-ink sm:w-24 sm:text-right">
                  {formatPrice(priceOf(line).price)}
                </span>
                <button
                  type="button"
                  onClick={() => removeLine(line.code, line.packSize)}
                  aria-label={`Remove ${line.name}, ${packLabel(line.packSize, line)}`}
                  className="text-ink-soft/60 transition-colors hover:text-coral"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-green">
              Summary
            </h2>

            <PostcodeField className="mt-4 border-t border-line pt-4" />
            <Totals totals={totals} rateState={rateState} className="mt-4" />
            <p className="mt-1.5 text-xs text-ink-soft">
              GST included. Delivery is charged per carton at your postcode&apos;s rate.
            </p>

            <OrderNotice totals={totals} rateState={rateState} className="mt-4" />

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
              <Lock size={12} /> Secure payment by Stripe
            </p>

            {/* Below the minimum there is nothing to check out to, so the
                button becomes the reason why rather than a dead end. */}
            {totals.meetsMinimum && totals.total !== null ? (
              <Link
                href="/checkout"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
              >
                Checkout <ArrowRight size={15} />
              </Link>
            ) : (
              <p className="mt-5 rounded-full bg-cream px-5 py-3.5 text-center text-sm font-bold uppercase tracking-[0.12em] text-ink-soft">
                {!totals.meetsMinimum
                  ? `${totals.shortBy} more to check out`
                  : "Add a delivery postcode"}
              </p>
            )}
            <Link
              href="/buy-now"
              className="mt-3 flex items-center justify-center rounded-full border border-line px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-green transition-colors hover:bg-cream"
            >
              Add more meals
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full text-center text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/70 transition-colors hover:text-coral"
            >
              Clear order
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
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
        href="/buy-now"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-green px-8 py-4 font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.04]"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
