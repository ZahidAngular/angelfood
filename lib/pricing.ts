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

/**
 * Bundle sizes offered, smallest first. The first is also the minimum.
 *
 * 18 and 24 are commented out rather than deleted: they are not being sold
 * at the moment, and putting them back is meant to be uncommenting a line
 * rather than reconstructing one.
 */
export const BUNDLE_SIZES = [
  12,
  // 18,
  // 24,
] as const;
export type BundleSize = (typeof BUNDLE_SIZES)[number];

export const MINIMUM_ITEMS = BUNDLE_SIZES[0];

/**
 * Flat freight, by island. Not read from DeliveryRates: that table is the
 * courier's actual cost per postcode, which this deliberately averages over.
 */
export const DELIVERY = {
  northIsland: 15,
  /**
   * The same as the North Island since October 2026. The two are kept apart
   * rather than collapsed into one figure because the islands genuinely cost
   * different amounts to reach — the rate card runs from about $12 to $76 a
   * drop — and charging them apart again is a number here rather than a
   * change to everything that quotes freight.
   */
  southIsland: 15,
  /** At or above this many meals, delivery is on us. */
  freeFrom: 24,
} as const;

/**
 * Whether the islands are charged differently at the moment. The carton card
 * is shown before anyone has said where the order is going, so it can only
 * quote a range while they differ, and a single figure once they do not.
 */
export const DELIVERY_VARIES_BY_ISLAND: boolean =
  (DELIVERY.northIsland as number) !== (DELIVERY.southIsland as number);

/**
 * The pre-sale, in one place so that ending it is deleting one block.
 *
 * The offer is free freight. Meals stay at the price the shop catalogue
 * carries, so nothing here touches what a meal costs.
 */
/**
 * Whether anything can be bought on the site.
 *
 * False puts the shop on hold: the nav button goes back to pointing at the
 * stockist map, the cart disappears, every Buy online button stops being
 * rendered, and /buy-now, /cart and the checkout are turned away at the
 * CDN by the redirects in firebase.json. The pages are still built and the
 * code is untouched — this is a shutter, not a demolition.
 *
 * Reopening is this flag and those four redirects, nothing else.
 */
export const ONLINE_STORE_OPEN = false;

export const PRE_SALE = {
  // Off with the shop. A pre-sale nobody can order from is just a promise.
  active: false,
  /** Wednesday 28 October 2026. */
  orderBy: "12 noon, Wednesday 28 October",
  /** The same deadline, short enough for a badge. */
  orderByShort: "Wed 28 Oct",
  /** Thursday 29 October 2026. */
  deliveredBy: "Thursday 29 October",
  /**
   * Freight is on us for the duration. Meals stay at their usual price.
   *
   * Turning this off is two places, not one: here, and PreSaleFreeDelivery in
   * the API's WebsiteSalesOrderRepository. That constant is what anyone is
   * actually charged — this one only decides what the site says — so leaving
   * them out of step would quote one figure and take another.
   */
  freeDelivery: true,
  bundle: 12,
} as const;

/**
 * Where the van actually goes.
 *
 * North Island only from October 2026. The rate card still holds South Island
 * postcodes and the charge above still names a South Island price, so this is
 * the one place that decides, and adding the South back is this line rather
 * than a hunt through everything that mentions freight.
 */
export const DELIVERS_TO: readonly Island[] = ["North Island"];

/**
 * Whether free delivery is something a customer can actually reach.
 *
 * It is offered at 24 meals, and 24 is not currently a carton anyone can buy,
 * so advertising it would be promising something the page will not let you
 * take. The rule stays in the pricing either way — an order of 24 placed by
 * any other route still ships free — but the promise is only shown when a
 * carton on sale is big enough to earn it. Restoring the 24 carton brings the
 * wording back on its own.
 */
export const FREE_DELIVERY_OFFERED: boolean =
  (BUNDLE_SIZES as readonly number[]).some((size) => size >= DELIVERY.freeFrom);

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

/**
 * Freight for an order of `items` meals going to `island`.
 *
 * Null means "no price": either nowhere has been named yet, or nowhere we go.
 * The caller shows the first as "not worked out" and the second as "we do not
 * deliver there", which is the honest reading of both.
 */
export function deliveryFor(items: number, island: Island | null): number | null {
  if (items <= 0) return 0;
  if (!island) return null;
  // The run is North Island only, so a South Island order has no price rather
  // than a free one — checked before the free-delivery rule, which would
  // otherwise quote $0 for somewhere no van goes.
  if (!DELIVERS_TO.includes(island)) return null;
  // Free for the pre-sale, and free at the carton size that carries its own
  // freight. The API applies the same rule; this only decides what is shown.
  if (PRE_SALE.active && PRE_SALE.freeDelivery) return 0;
  if (items >= DELIVERY.freeFrom) return 0;
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
