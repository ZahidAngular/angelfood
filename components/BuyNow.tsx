"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { fetchShopProducts, sectionsOf, type ShopProduct } from "@/lib/shop";
import { removeLine, setBundle, setQuantity, useOrder } from "@/lib/cart";
import { useDeliveryRate } from "@/lib/delivery";
import {
  BUNDLE_SIZES,
  DELIVERY,
  formatPrice,
  orderTotals,
  type BundleSize,
} from "@/lib/pricing";

export function BuyNow() {
  // The catalogue is the API's: what is sold and what it costs both come from
  // WebsiteProduct, so a change there needs no deploy.
  const [products, setProducts] = useState<ShopProduct[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchShopProducts()
      .then((loaded) => {
        if (!cancelled) setProducts(loaded);
      })
      .catch((err) => {
        console.error("[buy-now] catalogue failed to load:", err);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // One price across the range today, so the bundle can be costed before a
  // single meal is picked. Taken from the catalogue rather than written here.
  const pricePerItem = products?.[0]?.unitPrice ?? 0;

  return (
    <section className="bg-cream pb-24 pt-4 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <HowItWorks />
        <BundlePicker pricePerItem={pricePerItem} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
          <div>
            {failed ? (
              <LoadFailed />
            ) : !products ? (
              <GridSkeleton />
            ) : products.length === 0 ? (
              <NothingToSell />
            ) : (
              <div className="space-y-12">
                {sectionsOf(products).map((section) => {
                  const inSection = products.filter((p) => p.section === section);
                  return (
                    <section key={section}>
                      <h2 className="mb-5 flex items-baseline gap-3 font-display text-2xl font-bold tracking-[-0.02em] text-ink">
                        {section}
                        <span className="text-sm font-medium text-ink-soft">
                          {inSection.length}
                        </span>
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {inSection.map((product, i) => (
                          <ProductCard key={product.code} product={product} index={i} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          <OrderSummary />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">
        How it works
      </p>
      <ol className="mt-3 grid gap-3 sm:grid-cols-3">
        {[
          [
            "Choose your carton size",
            `${BUNDLE_SIZES.slice(0, -1).join(", ")} or ${
              BUNDLE_SIZES[BUNDLE_SIZES.length - 1]
            } meals.`,
          ],
          ["Fill it however you like", "Choose how many of each meal you want."],
          [
            "Place your order",
            `Delivery ${formatPrice(DELIVERY.northIsland)} North Island, ${formatPrice(
              DELIVERY.southIsland
            )} South — free at ${DELIVERY.freeFrom}.`,
          ],
        ].map(([title, detail], i) => (
          <li key={title} className="text-sm leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">
              {i + 1}. {title}
            </span>{" "}
            {detail}
          </li>
        ))}
      </ol>
      <p className="mt-3 border-t border-line pt-3 text-xs text-ink-soft">
        Sorry, no rural delivery — we&apos;ll tell you at checkout if we
        can&apos;t reach your address.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bundle picker                                                       */
/* ------------------------------------------------------------------ */

/**
 * The box being packed. Everything downstream keys off this: the meal
 * steppers stop at it, and the order can't be placed until it is exactly
 * full, because a part-filled carton isn't something the warehouse sends.
 */
function BundlePicker({ pricePerItem }: { pricePerItem: number }) {
  const { bundle, items, remaining } = useOrder();

  return (
    <div className="mt-6 rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-green">
          1. Choose your carton
        </h2>
        <p aria-live="polite" className="text-sm font-semibold text-ink-soft">
          {items} of {bundle} chosen
          {remaining > 0
            ? ` — ${remaining} to go`
            : remaining < 0
              ? ` — ${-remaining} too many`
              : " — full"}
        </p>
      </div>

      <fieldset className="mt-4">
        <legend className="sr-only">Carton size</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {BUNDLE_SIZES.map((size) => {
            const selected = bundle === size;
            const free = size >= DELIVERY.freeFrom;
            return (
              <label
                key={size}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-green/60 ${
                  selected
                    ? "border-green bg-green text-cream"
                    : "border-line bg-cream text-ink hover:border-green/40"
                }`}
              >
                <input
                  type="radio"
                  name="bundle-size"
                  value={size}
                  checked={selected}
                  onChange={() => setBundle(size as BundleSize)}
                  className="sr-only"
                />
                <span className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-extrabold">
                    {size} meals
                  </span>
                  {pricePerItem > 0 && (
                    <span className="font-display text-lg font-bold">
                      {formatPrice(size * pricePerItem)}
                    </span>
                  )}
                </span>
                <span
                  className={`mt-1 block text-xs font-semibold ${
                    selected ? "text-cream/80" : free ? "text-green" : "text-ink-soft"
                  }`}
                >
                  {free
                    ? "Free delivery"
                    : pricePerItem > 0
                      ? `${formatPrice(pricePerItem)} a meal + delivery`
                      : "+ delivery"}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <BundleProgress items={items} bundle={bundle} />
    </div>
  );
}

function BundleProgress({ items, bundle }: { items: number; bundle: number }) {
  const over = items > bundle;
  const filled = Math.min(100, (items / bundle) * 100);

  return (
    <div className="mt-4">
      <div
        className="h-2 overflow-hidden rounded-full bg-cream-deep"
        role="progressbar"
        aria-valuenow={items}
        aria-valuemin={0}
        aria-valuemax={bundle}
        aria-label={`${items} of ${bundle} meals chosen`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            over ? "bg-coral" : "bg-green"
          }`}
          style={{ width: `${filled}%` }}
        />
      </div>
    </div>
  );
}

/**
 * A product's picture, or a lettered tile when there isn't one — including
 * when the path is wrong. An order full of broken-image icons reads as a
 * broken site, which is a much worse failure than a missing photo.
 */
export function ProductThumb({
  src,
  name,
  sizes,
  className = "",
  rounded = "",
}: {
  src: string | null;
  name: string;
  sizes: string;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-green/10 font-display font-extrabold text-green/50 ${rounded} ${className}`}
        aria-hidden
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Product card                                                        */
/* ------------------------------------------------------------------ */

/**
 * One meal. There is no add button and no pack size: the stepper *is* the
 * order, so the count on the card and the count in the bundle are the same
 * number and can never disagree.
 */
function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const { quantityOf, remaining } = useOrder();
  const quantity = quantityOf(product.code);
  const inOrder = quantity > 0;

  const change = (next: number) =>
    setQuantity(
      {
        code: product.code,
        name: product.name,
        image: product.image,
        weight: product.weight,
        unitPrice: product.unitPrice,
      },
      next
    );

  return (
    <Reveal delay={(index % 2) * 0.07} className="h-full">
      <article
        className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-paper transition-colors ${
          inOrder ? "border-green" : "border-line"
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <ProductThumb
            src={product.image}
            name={product.name}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
            className="text-5xl"
          />
          {product.weight && (
            <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-green backdrop-blur-sm">
              {product.weight}
            </span>
          )}
          {inOrder && (
            <span className="absolute right-4 top-4 flex h-8 min-w-8 items-center justify-center gap-1 rounded-full bg-green px-2.5 font-display text-sm font-extrabold text-cream">
              <Check size={13} /> {quantity}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* h3: the section heading above this grid is the h2. */}
          <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.4rem]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-green">
            {formatPrice(product.unitPrice)} each
          </p>

          {/* mt-auto pins the stepper to the card's bottom edge, so a row of
              cards lines up however much sits above them. */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <QuantityStepper
              label={product.name}
              value={quantity}
              onChange={change}
              min={0}
              // Only as far as the box has room for: there is no way to
              // overfill a bundle, so there is no error to recover from.
              max={quantity + Math.max(0, remaining)}
            />
            <span className="font-display text-lg font-bold text-ink">
              {quantity > 0 ? formatPrice(quantity * product.unitPrice) : "—"}
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Quantity                                                            */
/* ------------------------------------------------------------------ */

export function QuantityStepper({
  label,
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex shrink-0 items-center rounded-full border border-line bg-cream">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Fewer — ${label}`}
        className="flex h-11 w-10 items-center justify-center rounded-l-full text-green transition-colors hover:bg-cream-deep disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={`How many — ${label}`}
        onChange={(e) => {
          const next = Number(e.target.value);
          // An empty or half-typed value would otherwise snap under the
          // user's cursor — leave it be until it parses.
          if (Number.isFinite(next) && next >= min) {
            onChange(Math.min(max, Math.round(next)));
          }
        }}
        className="af-qty w-9 bg-transparent text-center text-sm font-bold text-ink outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`More — ${label}`}
        className="flex h-11 w-10 items-center justify-center rounded-r-full text-green transition-colors hover:bg-cream-deep disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Totals                                                              */
/* ------------------------------------------------------------------ */

/**
 * The money, and — when delivery can't yet be worked out — why not. Shared by
 * the summary here, the cart and the checkout so all three agree.
 */
export function Totals({
  totals,
  rateState,
  quoteAtCheckout = false,
  className = "",
}: {
  totals: ReturnType<typeof orderTotals>;
  rateState?: ReturnType<typeof useDeliveryRate>;
  /** Before the checkout has an address, freight isn't yet a known figure. */
  quoteAtCheckout?: boolean;
  className?: string;
}) {
  const deliveryCell = () => {
    // Free on size alone, whether or not we know where it's going yet.
    if (totals.freeDelivery) return <span className="text-green">Free</span>;
    if (totals.delivery !== null) return formatPrice(totals.delivery);
    if (quoteAtCheckout) return <span className="text-ink-soft/70">At checkout</span>;
    if (rateState?.status === "loading") return <Loader2 size={14} className="animate-spin" />;
    if (rateState?.status === "not-delivered") return <span className="text-coral">No run</span>;
    if (rateState?.status === "error") return <span className="text-coral">Unavailable</span>;
    return <span className="text-ink-soft/70">Add postcode</span>;
  };

  // With freight still unknown, the bottom line is the goods — calling that
  // a "total" would be quoting a number the customer will not be charged.
  const pending = totals.total === null;

  return (
    <dl className={`space-y-2 text-sm ${className}`}>
      <div className="flex justify-between">
        <dt className="text-ink-soft">
          {totals.items} {totals.items === 1 ? "meal" : "meals"}
          {totals.pricePerItem !== null && (
            <span className="text-ink-soft/70">
              {" "}
              ({formatPrice(totals.pricePerItem)} each)
            </span>
          )}
        </dt>
        <dd className="font-semibold text-ink">{formatPrice(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">
          Delivery
          {totals.island && !totals.freeDelivery && (
            <span className="text-ink-soft/70"> ({totals.island})</span>
          )}
        </dt>
        <dd className="flex items-center font-semibold text-ink">{deliveryCell()}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-2.5">
        <dt className="font-semibold text-ink">
          {pending && quoteAtCheckout ? "Subtotal" : "Total"}
        </dt>
        <dd className="font-display text-2xl font-extrabold text-ink">
          {pending
            ? quoteAtCheckout
              ? formatPrice(totals.subtotal)
              : "—"
            : formatPrice(totals.total as number)}
        </dd>
      </div>
    </dl>
  );
}

/** Where the order stands: short of its bundle, over it, or where it's going. */
export function OrderNotice({
  totals,
  rateState,
  className = "mt-3",
}: {
  totals: ReturnType<typeof orderTotals>;
  rateState?: ReturnType<typeof useDeliveryRate>;
  className?: string;
}) {
  const warn = `rounded-xl bg-coral/10 p-3 text-xs font-semibold leading-relaxed text-ink ${className}`;

  if (totals.items === 0) return null;

  if (totals.remaining > 0) {
    return (
      <p className={warn}>
        Choose {totals.remaining} more {totals.remaining === 1 ? "meal" : "meals"} to
        fill your {totals.bundle}-meal carton.
      </p>
    );
  }

  if (totals.remaining < 0) {
    return (
      <p className={warn}>
        That&apos;s {-totals.remaining} too many for a {totals.bundle}-meal carton —
        take some out, or choose a bigger one.
      </p>
    );
  }

  if (rateState?.status === "not-delivered") {
    return (
      <p className={warn}>
        We don&apos;t have a delivery run to {rateState.postcode}
        {" — we can't do rural addresses. "}
        <Link href="/where-to-buy" className="underline">
          Find a stockist
        </Link>{" "}
        instead.
      </p>
    );
  }

  if (rateState?.rate) {
    return (
      <p
        className={`rounded-xl bg-green/10 p-3 text-xs font-semibold leading-relaxed text-green ${className}`}
      >
        {rateState.rate.deliveryDay} delivery to{" "}
        {rateState.rate.suburb || rateState.rate.region}.
      </p>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* Order summary                                                       */
/* ------------------------------------------------------------------ */

function OrderSummary() {
  const { lines, bundle, items } = useOrder();
  // No address yet, so no island: the meals are totalled here and freight is
  // worked out at the checkout, where the delivery address is asked for.
  const totals = orderTotals({ lines, bundle, island: null });

  return (
    <aside className="lg:sticky lg:top-32 lg:h-fit">
      <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-green">
          <ShoppingBag size={14} /> Your {bundle}-meal carton
        </h2>

        {items === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Nothing in it yet. Pick {bundle} meals in any mix you like.
          </p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-line">
              {lines.map((line) => (
                <li key={line.code} className="flex items-start gap-3 py-3 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{line.name}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-ink">
                    {formatPrice(line.quantity * line.unitPrice)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLine(line.code)}
                    aria-label={`Remove ${line.name}`}
                    className="shrink-0 text-ink-soft/60 transition-colors hover:text-coral"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <Totals totals={totals} quoteAtCheckout className="mt-4 border-t border-line pt-4" />
            <OrderNotice totals={totals} />

            {/* A part-filled carton isn't an order, so the button says what is
                missing rather than leading to a dead end. */}
            {totals.bundleComplete ? (
              <Link
                href="/cart"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
              >
                Review order <ArrowRight size={15} />
              </Link>
            ) : (
              <p className="mt-5 rounded-full bg-cream px-5 py-3.5 text-center text-sm font-bold uppercase tracking-[0.12em] text-ink-soft">
                {totals.remaining > 0
                  ? `${totals.remaining} more to go`
                  : `${-totals.remaining} too many`}
              </p>
            )}
          </>
        )}

        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-soft">
          Delivered across the North Island and Christchurch, or{" "}
          <Link href="/where-to-buy" className="font-semibold text-green underline">
            find a stockist
          </Link>{" "}
          to buy today.
        </p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Placeholder states                                                  */
/* ------------------------------------------------------------------ */

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2" aria-label="Loading products">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
          <div className="aspect-[4/3] animate-pulse bg-cream-deep/60" />
          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-5 w-1/2 animate-pulse rounded bg-line" />
            <div className="h-3 w-full animate-pulse rounded bg-line/70" />
            <div className="h-16 w-full animate-pulse rounded-2xl bg-line/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadFailed() {
  return (
    <div className="rounded-[1.75rem] border border-coral/30 bg-coral/10 px-6 py-12 text-center">
      <p className="font-display text-xl font-bold text-ink">
        We couldn&apos;t load the range
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
        Please refresh the page to try again — or find us on a shelf near you.
      </p>
      <Link
        href="/where-to-buy"
        className="mt-6 inline-flex rounded-full bg-green px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream"
      >
        Find a stockist
      </Link>
    </div>
  );
}

function NothingToSell() {
  return (
    <div className="rounded-[1.75rem] border border-line bg-paper px-6 py-12 text-center">
      <p className="font-display text-xl font-bold text-ink">Nothing to order right now</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
        Nothing is listed for online ordering at the moment. Our range is still
        on shelves nationwide.
      </p>
      <Link
        href="/where-to-buy"
        className="mt-6 inline-flex rounded-full bg-green px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream"
      >
        Find a stockist
      </Link>
    </div>
  );
}
