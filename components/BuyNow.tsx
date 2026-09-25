"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  Check,
  Gift,
  Loader2,
  Minus,
  Plus,
  Shuffle,
  Tag,
  Trash2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { fetchShopProducts, sectionsOf, type ShopProduct } from "@/lib/shop";
import { removeLine, setBundle, setQuantity, useOrder } from "@/lib/cart";
import { useDeliveryRate } from "@/lib/delivery";
import {
  BUNDLE_SIZES,
  DELIVERY,
  formatPrice,
  formatPriceShort,
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

  // One price across the range today, so a carton can be costed before a
  // single meal is picked. Taken from the catalogue rather than written here.
  const pricePerItem = products?.[0]?.unitPrice ?? 0;

  // Once the carton picker is off screen the running count goes with it, so a
  // bar follows the shopper down the page carrying the same number.
  const picker = useRef<HTMLDivElement>(null);
  const pickerGone = useScrolledPast(picker);

  const sections = products ? sectionsOf(products) : [];

  return (
    // Extra bottom room on a phone so the following bar can't sit over the
    // last meal in the grid.
    <section className="bg-cream pb-32 pt-4 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Facts pricePerItem={pricePerItem} />

        <div ref={picker}>
          <BundlePicker pricePerItem={pricePerItem} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
          <div>
            <SectionHeading step={2} title="Pick your meals">
              {products && products.length > 0
                ? `${products.length} to choose from`
                : ""}
            </SectionHeading>

            {failed ? (
              <LoadFailed />
            ) : !products ? (
              <GridSkeleton />
            ) : products.length === 0 ? (
              <NothingToSell />
            ) : (
              <div className="space-y-12">
                {sections.map((section) => {
                  const inSection = products.filter((p) => p.section === section);
                  return (
                    <section key={section}>
                      {/* With one run of products the "Pick your meals"
                          heading above already names them; a second heading
                          saying "Meals" would only repeat it. */}
                      {sections.length > 1 && (
                        <h3 className="mb-5 font-display text-xl font-bold tracking-[-0.02em] text-ink">
                          {section}
                        </h3>
                      )}
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

      <RunningTotalBar visible={pickerGone} />
    </section>
  );
}

/** True once `ref` has scrolled out of view above or below. */
function useScrolledPast(ref: React.RefObject<HTMLElement | null>) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // setState lives in the observer's callback, not the effect body, so this
    // reacts to scrolling rather than cascading a render.
    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return past;
}

/**
 * The terms, as chips.
 *
 * This used to be a "how it works" card walking through three steps, above a
 * second card that started at step one again. The steps are now the page
 * itself — pick a carton, pick meals, place the order — so all that is left
 * to state is what it costs and where we go.
 */
function Facts({ pricePerItem }: { pricePerItem: number }) {
  const facts: {
    icon: LucideIcon;
    text: string;
    lead?: boolean;
    /** False for anything the page makes obvious enough to drop on a phone. */
    phone?: boolean;
  }[] = [
    { icon: Shuffle, text: "Mix any meals you like", phone: false },
    {
      icon: Truck,
      text: `${formatPriceShort(DELIVERY.northIsland)} North Island, ${formatPriceShort(
        DELIVERY.southIsland
      )} South`,
    },
    { icon: Gift, text: `Free delivery at ${DELIVERY.freeFrom}`, lead: true },
    { icon: Ban, text: "No rural delivery" },
  ];

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {/* The price is the API's, never written here — so while the catalogue
          is still loading this holds its place rather than letting the row
          reflow, or worse, quietly dropping the one figure that matters. */}
      <li>
        {pricePerItem > 0 ? (
          <Chip icon={Tag} text={`${formatPrice(pricePerItem)} a meal`} lead />
        ) : (
          <span className="block h-[30px] w-32 animate-pulse rounded-full bg-cream-deep/70" />
        )}
      </li>
      {facts.map(({ phone = true, ...fact }) => (
        <li key={fact.text} className={phone ? undefined : "hidden sm:block"}>
          <Chip {...fact} />
        </li>
      ))}
    </ul>
  );
}

function Chip({
  icon: Icon,
  text,
  lead = false,
}: {
  icon: LucideIcon;
  text: string;
  /** Worth noticing — the price, and the offer. */
  lead?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        lead
          ? "border-green/25 bg-green/10 text-green"
          : "border-line bg-paper text-ink-soft"
      }`}
    >
      <Icon size={13} className={`shrink-0 ${lead ? "" : "text-green/70"}`} />
      {text}
    </span>
  );
}

function SectionHeading({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 className="flex items-baseline gap-2.5 font-display text-2xl font-bold tracking-[-0.02em] text-ink">
        <span className="text-base font-extrabold text-green">{step}</span>
        {title}
      </h2>
      {children && <span className="text-sm text-ink-soft">{children}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carton picker                                                       */
/* ------------------------------------------------------------------ */

/**
 * The box being packed. Everything downstream keys off this: the meal
 * steppers stop at it, and the order can't be placed until it is exactly
 * full, because a part-filled carton isn't something the warehouse sends.
 */
function BundlePicker({ pricePerItem }: { pricePerItem: number }) {
  const { bundle, items } = useOrder();

  return (
    <div className="mt-6">
      <SectionHeading step={1} title="Choose your carton" />

      <fieldset>
        <legend className="sr-only">Carton size</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {BUNDLE_SIZES.map((size) => (
            <CartonOption
              key={size}
              size={size}
              selected={bundle === size}
              pricePerItem={pricePerItem}
            />
          ))}
        </div>
      </fieldset>

      <Slots items={items} bundle={bundle} className="mt-5" />
    </div>
  );
}

function CartonOption({
  size,
  selected,
  pricePerItem,
}: {
  size: BundleSize;
  selected: boolean;
  pricePerItem: number;
}) {
  const free = size >= DELIVERY.freeFrom;

  return (
    <label
      className={`relative cursor-pointer rounded-2xl border p-4 transition-all focus-within:ring-2 focus-within:ring-green/60 sm:p-5 ${
        selected
          ? "border-green bg-green text-cream shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]"
          : "border-line bg-paper text-ink hover:-translate-y-0.5 hover:border-green/50"
      }`}
    >
      <input
        type="radio"
        name="bundle-size"
        value={size}
        checked={selected}
        onChange={() => setBundle(size)}
        className="sr-only"
      />

      {/* Free freight is the only thing separating one carton from another, so
          it is the badge rather than a line of small print. Hidden once the
          cartons stack, where an overhanging badge would sit in the gap and
          read as belonging to the carton above it — the line underneath says
          the same thing there. */}
      {free && (
        <span
          className={`absolute -top-2.5 right-4 hidden rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] sm:block ${
            selected ? "bg-gold text-ink" : "bg-green text-cream"
          }`}
        >
          Free delivery
        </span>
      )}

      <span className="flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl font-extrabold">{size} meals</span>
        {pricePerItem > 0 && (
          <span className="font-display text-lg font-bold">
            {formatPrice(size * pricePerItem)}
          </span>
        )}
      </span>

      <span className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold">
        {selected ? (
          <Check size={13} className="shrink-0" />
        ) : (
          <Truck size={13} className="shrink-0 text-ink-soft/60" />
        )}
        <span
          className={
            selected ? "text-cream/85" : free ? "text-green" : "text-ink-soft"
          }
        >
          {free
            ? "Delivered free, anywhere we go"
            : `plus ${formatPriceShort(DELIVERY.northIsland)}–${formatPriceShort(
                DELIVERY.southIsland
              )} delivery`}
        </span>
      </span>
    </label>
  );
}

/**
 * The carton as slots rather than a percentage — one mark per meal, filling
 * up as they are chosen. A bar at zero reads as a divider; twenty-four empty
 * slots read as something to fill.
 */
function Slots({
  items,
  bundle,
  className = "",
  compact = false,
}: {
  items: number;
  bundle: number;
  className?: string;
  compact?: boolean;
}) {
  const over = items > bundle;

  return (
    // One pill clipped into slots, rather than loose dashes: rounded ends on
    // the bar, square segments inside, and the page showing through the
    // hairlines between them.
    <div
      className={`flex gap-[2px] overflow-hidden rounded-full ${className}`}
      role="progressbar"
      aria-valuenow={items}
      aria-valuemin={0}
      aria-valuemax={bundle}
      aria-label={`${items} of ${bundle} meals chosen`}
    >
      {Array.from({ length: bundle }).map((_, i) => (
        <span
          key={i}
          className={`flex-1 transition-colors duration-200 ${
            compact ? "h-1.5" : "h-2"
          } ${i < items ? (over ? "bg-coral" : "bg-green") : "bg-cream-deep"}`}
        />
      ))}
    </div>
  );
}

/**
 * The count, following the shopper down the grid once the picker is out of
 * sight. Phones only — on a wide screen the order summary is already pinned
 * beside the meals and says the same thing.
 */
function RunningTotalBar({ visible }: { visible: boolean }) {
  const { bundle, items, remaining } = useOrder();

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-sm transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">
            {items} of {bundle} chosen
          </p>
          <Slots items={items} bundle={bundle} className="mt-1.5" compact />
        </div>

        {remaining === 0 ? (
          <Link
            href="/cart"
            tabIndex={visible ? undefined : -1}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-green px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-cream"
          >
            Review <ArrowRight size={14} />
          </Link>
        ) : (
          <span
            className={`shrink-0 text-sm font-bold ${
              remaining < 0 ? "text-coral" : "text-ink-soft"
            }`}
          >
            {remaining > 0 ? `${remaining} to go` : `${-remaining} over`}
          </span>
        )}
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
 * One meal. There is no pack size and no separate basket: the stepper *is*
 * the order, so the count on the card and the count in the carton are the
 * same number and can never disagree. An untouched meal shows an Add button
 * instead, which invites a first tap better than a stepper reading zero.
 */
function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const { quantityOf, remaining } = useOrder();
  const quantity = quantityOf(product.code);
  const inOrder = quantity > 0;
  const cartonFull = remaining <= 0;

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
          inOrder ? "border-green ring-1 ring-green" : "border-line"
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
          {/* h4: "Pick your meals" is the h2, a section name the h3. */}
          <h4 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[1.4rem]">
            {product.name}
          </h4>
          <p className="mt-1 text-sm font-semibold text-green">
            {formatPrice(product.unitPrice)} each
          </p>

          {/* mt-auto pins the controls to the card's bottom edge, so a row of
              cards lines up however much sits above them. */}
          <div className="mt-auto pt-6">
            {inOrder ? (
              <div className="flex items-center justify-between gap-3">
                <QuantityStepper
                  label={product.name}
                  value={quantity}
                  onChange={change}
                  min={0}
                  // Only as far as the carton has room for: there is no way to
                  // overfill it, so there is no error to recover from.
                  max={quantity + Math.max(0, remaining)}
                />
                <span className="font-display text-lg font-bold text-ink">
                  {formatPrice(quantity * product.unitPrice)}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => change(1)}
                disabled={cartonFull}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-green px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-green transition-colors hover:bg-green hover:text-cream disabled:cursor-not-allowed disabled:border-line disabled:text-ink-soft/60 disabled:hover:bg-transparent disabled:hover:text-ink-soft/60"
              >
                {cartonFull ? (
                  "Carton full"
                ) : (
                  <>
                    <Plus size={15} /> Add
                  </>
                )}
              </button>
            )}
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

/** Where the order stands: short of its carton, over it, or where it's going. */
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
  const { lines, bundle, items, remaining } = useOrder();
  // No address yet, so no island: the meals are totalled here and freight is
  // worked out at the checkout, where the delivery address is asked for.
  const totals = orderTotals({ lines, bundle, island: null });

  return (
    <aside className="lg:sticky lg:top-32 lg:h-fit">
      <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-green">
            Your {bundle}-meal carton
          </h2>
          <span className="shrink-0 text-xs font-bold text-ink-soft">
            {items}/{bundle}
          </span>
        </div>

        <Slots items={items} bundle={bundle} className="mt-3" compact />

        {items === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Nothing in it yet. Pick {bundle} meals in any mix you like — as many
            of one as you fancy.
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
                {remaining > 0 ? `${remaining} more to go` : `${-remaining} too many`}
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
            <div className="h-11 w-full animate-pulse rounded-full bg-line/50" />
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
