"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Reveal } from "./Reveal";
import {
  cartonSaving,
  fetchBuyableMeals,
  formatPrice,
  packLabel,
  priceFor,
  type BuyableMeal,
  type PackSize,
} from "@/lib/meals";
import { addToCart, removeLine, useCart } from "@/lib/cart";
import { DELIVERY_FEE } from "@/lib/checkout";

/** How long the button stays on "Added" after a meal goes in the order. */
const ADDED_FEEDBACK_MS = 1800;

export function BuyNow() {
  // Fetched in the browser, not at build time, so the page lists what the
  // product feed says today — and so a static export stays correct.
  const [meals, setMeals] = useState<BuyableMeal[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchBuyableMeals()
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

  return (
    <section className="bg-cream pb-24 pt-4 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
          <div>
            {failed ? (
              <LoadFailed />
            ) : !meals ? (
              <MealGridSkeleton />
            ) : meals.length === 0 ? (
              <NoMeals />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {meals.map((meal, i) => (
                  <MealCard key={meal.code} meal={meal} index={i} />
                ))}
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

function MealCard({ meal, index }: { meal: BuyableMeal; index: number }) {
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

  const price = priceFor(meal, packSize);
  const saving = cartonSaving(meal);

  function add() {
    if (price === null) return;

    addToCart(
      {
        code: meal.code,
        packSize,
        name: meal.name,
        image: meal.image,
        cartonQty: meal.cartonQty,
        weight: meal.weight,
        price,
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
          <h2 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.4rem]">
            {meal.name}
          </h2>
          {meal.blurb && (
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{meal.blurb}</p>
          )}

          {/* mt-auto pins the buying controls to the card's bottom edge, so a
              row of cards lines up however much copy sits above them. */}
          <div className="mt-auto pt-6">
            {price === null ? (
              <PriceOnRequest meal={meal} />
            ) : (
              <>
                <fieldset>
                  <legend className="sr-only">Pack size for {meal.name}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["unit", "carton"] as const).map((size) => {
                      const sizePrice = priceFor(meal, size);
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
                            {sizePrice === null ? "—" : formatPrice(sizePrice)}
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
                          {size === "carton" && saving !== null && (
                            <span className="absolute -top-2 right-3 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink">
                              Save {saving}%
                            </span>
                          )}
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
              </>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** A meal the feed sells that the site has no retail price for yet. */
function PriceOnRequest({ meal }: { meal: BuyableMeal }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-cream p-4">
      <p className="text-sm font-semibold text-ink">Price on request</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        {meal.name} isn&apos;t priced for online orders yet.
      </p>
      <Link
        href="/contact"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-green"
      >
        Ask us <ArrowRight size={13} />
      </Link>
    </div>
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

function OrderSummary() {
  const { lines, count, total } = useCart();

  return (
    <aside className="lg:sticky lg:top-32 lg:h-fit">
      <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-green">
          <ShoppingBag size={14} /> Your order
        </h2>

        {count === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Nothing in it yet. Pick a meal — single packs or a carton, whichever
            suits.
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
                    {formatPrice(line.price * line.quantity)}
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

            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-sm font-semibold text-ink-soft">
                Subtotal{" "}
                <span className="font-medium">
                  ({count} {count === 1 ? "item" : "items"})
                </span>
              </span>
              <span className="font-display text-2xl font-extrabold text-ink">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              plus {formatPrice(DELIVERY_FEE)} delivery
            </p>

            <Link
              href="/cart"
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
            >
              Review order <ArrowRight size={15} />
            </Link>
          </>
        )}

        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-soft">
          Flat {formatPrice(DELIVERY_FEE)} delivery anywhere in New Zealand, or{" "}
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

function MealGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2" aria-label="Loading meals">
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
        We couldn&apos;t load the meals
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
