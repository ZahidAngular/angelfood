"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Reveal } from "./Reveal";
import {
  fetchBuyableProducts,
  itemsPerPack,
  packLabel,
  SECTIONS,
  type BuyableProduct,
  type PackSize,
} from "@/lib/meals";
import { addToCart, lineItems, removeLine, useCart } from "@/lib/cart";
import { formatPrice, orderTotals, MINIMUM_ITEMS, PRICE_TIERS } from "@/lib/pricing";

/** How long the button stays on "Added" after a meal goes in the order. */
const ADDED_FEEDBACK_MS = 1800;

export function BuyNow() {
  // Fetched in the browser, not at build time, so the page lists what the
  // product feed says today — and so a static export stays correct.
  const [meals, setMeals] = useState<BuyableProduct[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchBuyableProducts()
      .then((loaded) => {
        if (!cancelled) setMeals(loaded);
      })
      .catch((err) => {
        console.error("[buy-now] meals failed to load:", err);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { items } = useCart();
  const totals = orderTotals(items);

  return (
    <section className="bg-cream pb-24 pt-4 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <PricingBanner />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
          <div>
            {failed ? (
              <LoadFailed />
            ) : !meals ? (
              <MealGridSkeleton />
            ) : meals.length === 0 ? (
              <NoMeals />
            ) : (
              // One run per section, in the order SECTIONS lists them. A
              // section with nothing in it simply doesn't appear, so the feed
              // adding or dropping a range needs no change here.
              <div className="space-y-12">
                {SECTIONS.map((section) => {
                  const inSection = meals.filter((m) => m.section === section);
                  if (inSection.length === 0) return null;
                  return (
                    <section key={section}>
                      <h2 className="mb-5 flex items-baseline gap-3 font-display text-2xl font-bold tracking-[-0.02em] text-ink">
                        {section}
                        <span className="text-sm font-medium text-ink-soft">
                          {inSection.length}
                        </span>
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {inSection.map((meal, i) => (
                          <MealCard
                            key={meal.code}
                            meal={meal}
                            index={i}
                            perItem={totals.perItem}
                          />
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

/* ------------------------------------------------------------------ */
/* Meal card                                                           */
/* ------------------------------------------------------------------ */

function MealCard({
  meal,
  index,
  perItem,
}: {
  meal: BuyableProduct;
  index: number;
  /** The rate the order currently qualifies for — see lib/pricing.ts. */
  perItem: number;
}) {
  const [packSize, setPackSize] = useState<PackSize>("unit");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    []
  );

  function add() {
    addToCart(
      {
        code: meal.code,
        packSize,
        name: meal.name,
        image: meal.image,
        cartonQty: meal.cartonQty,
        weight: meal.weight,
      },
      quantity
    );

    setQuantity(1);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
  }

  return (
    <Reveal delay={(index % 2) * 0.07} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-paper">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          {meal.image ? (
            <Image
              src={meal.image}
              alt={`Angel Food ${meal.name}`}
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          ) : (
            // A meal the feed has added before the site has artwork for it.
            <div
              className="flex h-full items-center justify-center font-display text-5xl font-extrabold text-cream"
              style={{ background: meal.accent }}
              aria-hidden
            >
              {meal.name.charAt(0)}
            </div>
          )}
          {meal.weight && (
            <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-green backdrop-blur-sm">
              {meal.weight}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* h3: the section heading above this grid is the h2. */}
          <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.4rem]">
            {meal.name}
          </h3>
          {meal.blurb && (
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{meal.blurb}</p>
          )}

          {/* mt-auto pins the buying controls to the card's bottom edge, so a
              row of cards lines up however much copy sits above them. */}
          <div className="mt-auto pt-6">
            <fieldset>
                  <legend className="sr-only">Pack size for {meal.name}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["unit", "carton"] as const).map((size) => {
                      const count = itemsPerPack(size, meal);
                      const selected = packSize === size;
                      return (
                        <label
                          key={size}
                          className={`relative cursor-pointer rounded-2xl border p-3 text-left transition-colors focus-within:ring-2 focus-within:ring-green/60 ${
                            selected
                              ? "border-green bg-green text-cream"
                              : "border-line bg-cream text-ink hover:border-green/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pack-${meal.code}`}
                            value={size}
                            checked={selected}
                            onChange={() => setPackSize(size)}
                            className="sr-only"
                          />
                          <span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] opacity-70">
                            {size === "carton" ? "Carton" : "Single"}
                          </span>
                          <span className="mt-1 block font-display text-lg font-bold">
                            {formatPrice(perItem * count)}
                          </span>
                          <span
                            className={`mt-0.5 block text-xs ${
                              selected ? "text-cream/75" : "text-ink-soft"
                            }`}
                          >
                            {size === "carton"
                              ? `${meal.cartonQty} × ${meal.weight || "pack"}`
                              : meal.weight || "1 pack"}
                          </span>
                          <span
                            className={`mt-0.5 block text-[0.65rem] ${
                              selected ? "text-cream/60" : "text-ink-soft/70"
                            }`}
                          >
                            {count === 1 ? "1 item" : `${count} items`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-4 flex items-center gap-3">
                  <QuantityStepper
                    label={meal.name}
                    value={quantity}
                    onChange={setQuantity}
                  />
                  <button
                    type="button"
                    onClick={add}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-cream transition-transform hover:scale-[1.03]"
                  >
                    {added ? (
                      <>
                        <Check size={15} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} /> Add
                      </>
                    )}
                  </button>
                </div>

                {/* Announced rather than shown: the button itself already reads
                    "Added", and this says what actually went in. */}
                <span aria-live="polite" className="sr-only">
                  {added
                    ? `${quantity === 1 ? "" : `${quantity} × `}${meal.name}, ${packLabel(
                        packSize,
                        meal
                      )}, added to your order`
                    : ""}
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
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex shrink-0 items-center rounded-full border border-line bg-cream">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Fewer — ${label}`}
        className="flex h-11 w-10 items-center justify-center rounded-l-full text-green transition-colors hover:bg-cream-deep disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={99}
        value={value}
        aria-label={`Quantity — ${label}`}
        onChange={(e) => {
          const next = Number(e.target.value);
          // An empty or half-typed value would otherwise snap to 1 under the
          // user's cursor — leave it be until it parses.
          if (Number.isFinite(next) && next > 0) onChange(Math.min(99, Math.round(next)));
        }}
        className="af-qty w-9 bg-transparent text-center text-sm font-bold text-ink outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label={`More — ${label}`}
        className="flex h-11 w-10 items-center justify-center rounded-r-full text-green transition-colors hover:bg-cream-deep disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Order summary                                                       */
/* ------------------------------------------------------------------ */

function PricingBanner() {
  const [best, entry] = [PRICE_TIERS[0], PRICE_TIERS[PRICE_TIERS.length - 1]];

  return (
    <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">
        How it&apos;s priced
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">
            {entry.minItems} items, {formatPrice(entry.perItem)} each
          </span>{" "}
          — anything from the range counts, mixed however you like. Delivery is
          a flat {formatPrice(entry.delivery)} anywhere in New Zealand.
        </p>
        <p className="rounded-2xl bg-cream p-3.5 text-sm leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">
            {best.minItems} items, {formatPrice(best.perItem)} each
          </span>{" "}
          — and{" "}
          <span className="font-bold uppercase tracking-wide text-green">
            free delivery
          </span>
          .
        </p>
      </div>
    </div>
  );
}

function OrderSummary() {
  const { lines, items } = useCart();
  const totals = orderTotals(items);

  return (
    <aside className="lg:sticky lg:top-32 lg:h-fit">
      <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-green">
          <ShoppingBag size={14} /> Your order
        </h2>

        {items === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Nothing in it yet. Mix and match — {MINIMUM_ITEMS} items is the
            smallest we send.
          </p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-line">
              {lines.map((line) => (
                <li
                  key={`${line.code}:${line.packSize}`}
                  className="flex items-start gap-3 py-3 first:pt-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{line.name}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {line.quantity} × {packLabel(line.packSize, line)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-ink">
                    {formatPrice(lineItems(line) * totals.perItem)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLine(line.code, line.packSize)}
                    aria-label={`Remove ${line.name}, ${packLabel(line.packSize, line)}`}
                    className="shrink-0 text-ink-soft/60 transition-colors hover:text-coral"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  {totals.items} {totals.items === 1 ? "item" : "items"} ×{" "}
                  {formatPrice(totals.perItem)}
                </dt>
                <dd className="font-semibold text-ink">
                  {formatPrice(totals.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="font-semibold text-ink">
                  {totals.delivery === 0 ? (
                    <span className="text-green">Free</span>
                  ) : (
                    formatPrice(totals.delivery)
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-display text-2xl font-extrabold text-ink">
                  {formatPrice(totals.total)}
                </dd>
              </div>
            </dl>

            <OrderProgress totals={totals} />

            <Link
              href="/cart"
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
            >
              Review order <ArrowRight size={15} />
            </Link>
          </>
        )}

        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-soft">
          Delivered anywhere in New Zealand, or{" "}
          <Link href="/where-to-buy" className="font-semibold text-green underline">
            find a stockist
          </Link>{" "}
          to buy today.
        </p>
      </div>
    </aside>
  );
}

/**
 * The one line that tells a shopper where they stand: how far off the minimum
 * they are, or what one more handful would save them.
 */
export function OrderProgress({
  totals,
  className = "mt-3",
}: {
  totals: ReturnType<typeof orderTotals>;
  className?: string;
}) {
  if (totals.items === 0) return null;

  if (!totals.meetsMinimum) {
    return (
      <p
        className={`rounded-xl bg-coral/10 p-3 text-xs font-semibold leading-relaxed text-ink ${className}`}
      >
        Add {totals.shortBy} more to reach the {MINIMUM_ITEMS}-item minimum.
      </p>
    );
  }

  if (totals.nextTier) {
    const { tier, itemsAway } = totals.nextTier;
    return (
      <p
        className={`rounded-xl bg-gold/15 p-3 text-xs font-semibold leading-relaxed text-ink ${className}`}
      >
        Add {itemsAway} more for {formatPrice(tier.perItem)} each and free
        delivery.
      </p>
    );
  }

  return (
    <p
      className={`rounded-xl bg-green/10 p-3 text-xs font-semibold leading-relaxed text-green ${className}`}
    >
      Best rate, and delivery is on us.
    </p>
  );
}
/* ------------------------------------------------------------------ */
/* Placeholder states                                                  */
/* ------------------------------------------------------------------ */

function MealGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2" aria-label="Loading products">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[1.75rem] border border-line bg-paper"
        >
          <div className="aspect-[4/3] animate-pulse bg-cream-deep/60" />
          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-5 w-1/2 animate-pulse rounded bg-line" />
            <div className="h-3 w-full animate-pulse rounded bg-line/70" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-line/70" />
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
        Please refresh the page to try again — or find them on a shelf near you.
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

function NoMeals() {
  return (
    <div className="rounded-[1.75rem] border border-line bg-paper px-6 py-12 text-center">
      <p className="font-display text-xl font-bold text-ink">No meals right now</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
        Nothing is listed for online ordering at the moment. Our meals are still
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
