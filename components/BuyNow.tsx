"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Reveal } from "./Reveal";
import {
  fetchShopProducts,
  itemsPerPack,
  packLabel,
  sectionsOf,
  type PackSize,
  type ShopProduct,
} from "@/lib/shop";
import { addToCart, priceOf, removeLine, useCart } from "@/lib/cart";
import { rememberPostcode, useDeliveryPostcode, useDeliveryRate } from "@/lib/delivery";
import { formatPrice, itemPrice, orderTotals, MINIMUM_ITEMS } from "@/lib/pricing";

/** How long the button stays on "Added" after something goes in the order. */
const ADDED_FEEDBACK_MS = 1800;

export function BuyNow() {
  // The catalogue is the API's: what is sold, what a carton holds and what it
  // costs all come from WebsiteProduct, so a change there needs no deploy.
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

  return (
    <section className="bg-cream pb-24 pt-4 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <HowItWorks />

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
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">Order by the carton</span> — or in
          single packs, mixed however you like. {MINIMUM_ITEMS} items is the
          smallest we send.
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">A carton costs the same</span>{" "}
          whether you take one or five. No volume pricing to work out.
        </p>
        <p className="rounded-2xl bg-cream p-3.5 text-sm leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">Delivery is per carton</span>, at
          your postcode&apos;s rate — so two cartons is two deliveries&apos; worth.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const [packSize, setPackSize] = useState<PackSize>("carton");
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
        code: product.code,
        packSize,
        name: product.name,
        image: product.image,
        weight: product.weight,
        cartonQty: product.cartonQty,
        baseCartonPrice: product.baseCartonPrice,
        baseCartonLimit: product.baseCartonLimit,
        priceIncreasePercentage: product.priceIncreasePercentage,
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
          {product.image ? (
            <Image
              src={product.image}
              alt={`Angel Food ${product.name}`}
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center font-display text-5xl font-extrabold text-cream"
              style={{ background: "var(--color-green-bright)" }}
              aria-hidden
            >
              {product.name.charAt(0)}
            </div>
          )}
          {product.weight && (
            <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-green backdrop-blur-sm">
              {product.weight}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* h3: the section heading above this grid is the h2. */}
          <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.4rem]">
            {product.name}
          </h3>

          {/* mt-auto pins the buying controls to the card's bottom edge, so a
              row of cards lines up however much sits above them. */}
          <div className="mt-auto pt-6">
            <fieldset>
              <legend className="sr-only">Pack size for {product.name}</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["unit", "carton"] as const).map((size) => {
                  const count = itemsPerPack(size, product);
                  const price =
                    size === "carton"
                      ? product.baseCartonPrice
                      : itemPrice(product);
                  const selected = packSize === size;
                  return (
                    <label
                      key={size}
                      className={`cursor-pointer rounded-2xl border p-3 text-left transition-colors focus-within:ring-2 focus-within:ring-green/60 ${
                        selected
                          ? "border-green bg-green text-cream"
                          : "border-line bg-cream text-ink hover:border-green/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`pack-${product.code}`}
                        value={size}
                        checked={selected}
                        onChange={() => setPackSize(size)}
                        className="sr-only"
                      />
                      <span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] opacity-70">
                        {size === "carton" ? "Carton" : "Single"}
                      </span>
                      <span className="mt-1 block font-display text-lg font-bold">
                        {formatPrice(price)}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs ${
                          selected ? "text-cream/75" : "text-ink-soft"
                        }`}
                      >
                        {size === "carton"
                          ? `${product.cartonQty} × ${product.weight || "pack"}`
                          : product.weight || "1 pack"}
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
                label={product.name}
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

            {/* Announced rather than shown: the button already reads "Added",
                and this says what actually went in. */}
            <span aria-live="polite" className="sr-only">
              {added
                ? `${quantity === 1 ? "" : `${quantity} × `}${product.name}, ${packLabel(
                    packSize,
                    product
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
/* Postcode                                                            */
/* ------------------------------------------------------------------ */

/**
 * Freight can't be quoted without knowing where it is going, so the summary
 * asks. The answer is remembered and the checkout picks it up, rather than
 * being asked for twice.
 */
export function PostcodeField({ className = "" }: { className?: string }) {
  const postcode = useDeliveryPostcode();

  return (
    <div className={className}>
      <label
        htmlFor="delivery-postcode"
        className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-green"
      >
        <MapPin size={12} /> Delivery postcode
      </label>
      <input
        id="delivery-postcode"
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={postcode}
        placeholder="e.g. 1010"
        onChange={(e) => rememberPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="af-qty w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/15"
      />
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
  className = "",
}: {
  totals: ReturnType<typeof orderTotals>;
  rateState: ReturnType<typeof useDeliveryRate>;
  className?: string;
}) {
  const deliveryCell = () => {
    if (totals.delivery !== null) return formatPrice(totals.delivery);
    if (rateState.status === "loading") return <Loader2 size={14} className="animate-spin" />;
    if (rateState.status === "not-delivered") return <span className="text-coral">No run</span>;
    if (rateState.status === "error") return <span className="text-coral">Unavailable</span>;
    return <span className="text-ink-soft/70">Add postcode</span>;
  };

  return (
    <dl className={`space-y-2 text-sm ${className}`}>
      <div className="flex justify-between">
        <dt className="text-ink-soft">
          {totals.items} {totals.items === 1 ? "item" : "items"}
          <span className="text-ink-soft/70">
            {" "}
            ({totals.cartons} {totals.cartons === 1 ? "carton" : "cartons"})
          </span>
        </dt>
        <dd className="font-semibold text-ink">{formatPrice(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">
          Delivery
          {totals.rate && (
            <span className="text-ink-soft/70">
              {" "}
              ({totals.cartons} × {formatPrice(totals.rate.totalCharge)})
            </span>
          )}
        </dt>
        <dd className="flex items-center font-semibold text-ink">{deliveryCell()}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-2.5">
        <dt className="font-semibold text-ink">Total</dt>
        <dd className="font-display text-2xl font-extrabold text-ink">
          {totals.total === null ? "—" : formatPrice(totals.total)}
        </dd>
      </div>
    </dl>
  );
}

/** Where the order stands: short of the minimum, or where it's going. */
export function OrderNotice({
  totals,
  rateState,
  className = "mt-3",
}: {
  totals: ReturnType<typeof orderTotals>;
  rateState: ReturnType<typeof useDeliveryRate>;
  className?: string;
}) {
  if (totals.items === 0) return null;

  if (!totals.meetsMinimum) {
    return (
      <p className={`rounded-xl bg-coral/10 p-3 text-xs font-semibold leading-relaxed text-ink ${className}`}>
        Add {totals.shortBy} more to reach the {MINIMUM_ITEMS}-item minimum.
      </p>
    );
  }

  if (rateState.status === "not-delivered") {
    return (
      <p className={`rounded-xl bg-coral/10 p-3 text-xs font-semibold leading-relaxed text-ink ${className}`}>
        We don&apos;t have a delivery run to {rateState.postcode} yet —{" "}
        <Link href="/where-to-buy" className="underline">
          find a stockist
        </Link>{" "}
        instead.
      </p>
    );
  }

  if (totals.rate) {
    return (
      <p className={`rounded-xl bg-green/10 p-3 text-xs font-semibold leading-relaxed text-green ${className}`}>
        {totals.rate.deliveryDay} delivery to {totals.rate.suburb || totals.rate.region}.
      </p>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* Order summary                                                       */
/* ------------------------------------------------------------------ */

function OrderSummary() {
  const { lines, items, freight } = useCart();
  const postcode = useDeliveryPostcode();
  const rateState = useDeliveryRate(postcode);
  const totals = orderTotals(lines.map(priceOf), rateState.rate, freight);

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
                    {formatPrice(priceOf(line).price)}
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

            <PostcodeField className="mt-4 border-t border-line pt-4" />
            <Totals totals={totals} rateState={rateState} className="mt-4" />
            <OrderNotice totals={totals} rateState={rateState} />

            <Link
              href="/cart"
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
            >
              Review order <ArrowRight size={15} />
            </Link>
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
