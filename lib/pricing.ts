/**
 * What an order costs.
 *
 * Meals are sold by the meal, at one price, in a bundle of 12, 18 or 24. The
 * bundle is not a discount — it is the size of the box being filled — so the
 * goods are simply the price of a meal times however many are in it.
 *
 * Freight is a flat charge by island rather than the courier's per-postcode
 * rate: the rate card varies from about $12 to $76 a drop, and the business
 * charges one averaged figure instead. Twenty-four meals carry their own
 * freight, so delivery is free at that size.
 */

/** Bundle sizes offered, smallest first. The first is also the minimum. */
export const BUNDLE_SIZES = [12, 18, 24] as const;
export type BundleSize = (typeof BUNDLE_SIZES)[number];

export const MINIMUM_ITEMS = BUNDLE_SIZES[0];

/**
 * Flat freight, by island. Not read from DeliveryRates: that table is the
 * courier's actual cost per postcode, which this deliberately averages over.
 */
export const DELIVERY = {
  northIsland: 15,
  southIsland: 20,
  /** At or above this many meals, delivery is on us. */
  freeFrom: 24,
} as const;

/**
 * South Island postcodes start at 7000 — Nelson and Marlborough through
 * Canterbury, Otago and Southland. Everything below is North Island.
 */
const SOUTH_ISLAND_FROM = 7000;

export type Island = "North Island" | "South Island";

/** Which island a postcode is on, or null if it isn't a NZ postcode. */
export function islandFor(postcode: string): Island | null {
  const digits = (postcode || "").trim();
  if (!/^\d{4}$/.test(digits)) return null;
  return Number(digits) >= SOUTH_ISLAND_FROM ? "South Island" : "North Island";
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Freight for an order of `items` meals going to `island`. */
export function deliveryFor(items: number, island: Island | null): number | null {
  if (items <= 0) return 0;
  if (items >= DELIVERY.freeFrom) return 0;
  if (!island) return null;
  return island === "South Island" ? DELIVERY.southIsland : DELIVERY.northIsland;
}

/** The part of a cart line the money depends on. */
export type OrderLine = { quantity: number; unitPrice: number };

export type OrderTotals = {
  /** Meals chosen. */
  items: number;
  /** The bundle being filled, and how far off it is. */
  bundle: BundleSize;
  /** Meals still to choose. Negative means too many for the bundle. */
  remaining: number;
  /** True only when the bundle is exactly filled. */
  bundleComplete: boolean;
  /**
   * The price of a meal, when every meal in the order is the same price —
   * which they are today. null once a mixed order makes "each" a lie.
   */
  pricePerItem: number | null;
  subtotal: number;
  /** null when freight can't be worked out yet — not the same as free. */
  delivery: number | null;
  total: number | null;
  /** True when this order earns free delivery on size alone. */
  freeDelivery: boolean;
  island: Island | null;
};

export function orderTotals({
  lines,
  bundle,
  island,
}: {
  lines: OrderLine[];
  bundle: BundleSize;
  island: Island | null;
}): OrderTotals {
  let items = 0;
  let subtotal = 0;
  for (const line of lines) {
    items += line.quantity;
    subtotal += line.quantity * line.unitPrice;
  }
  subtotal = round2(subtotal);

  const prices = new Set(lines.map((l) => l.unitPrice));
  const delivery = deliveryFor(items, island);
  const freeDelivery = items >= DELIVERY.freeFrom;

  return {
    items,
    bundle,
    remaining: bundle - items,
    bundleComplete: items === bundle,
    pricePerItem: prices.size === 1 ? [...prices][0] : null,
    subtotal,
    delivery,
    total: delivery === null ? null : round2(subtotal + delivery),
    freeDelivery,
    island,
  };
}

const NZD = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" });
const NZD_WHOLE = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number) => NZD.format(amount);

/**
 * For prices inside a sentence, where ".00" is just noise: "$15", but still
 * "$11.90" when the cents carry meaning.
 */
export const formatPriceShort = (amount: number) =>
  Number.isInteger(amount) ? NZD_WHOLE.format(amount) : NZD.format(amount);
