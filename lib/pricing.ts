/**
 * What an order costs.
 *
 * Every item is the same price whatever it is — a meal, a burger — and the
 * rate depends only on how many are being sent at once, because that is what
 * the courier bill actually turns on. Freight really varies by destination, so
 * the $20 is an average charged flat rather than a quote, and it disappears
 * once an order is big enough to absorb it.
 *
 * Nothing here is per-product, so there is no price list to keep in step with
 * the catalogue: change the three numbers below and the whole site follows.
 */

/** Rates, richest first — the first one an order qualifies for wins. */
export const PRICE_TIERS = [
  { minItems: 24, perItem: 10.0, delivery: 0 },
  { minItems: 12, perItem: 11.5, delivery: 20 },
] as const;

export type PriceTier = (typeof PRICE_TIERS)[number];

/** Below this we don't ship: a smaller order costs more to send than it earns. */
export const MINIMUM_ITEMS = 12;

/** The entry rate, used to price an order still being built up to the minimum. */
const BASE_TIER = PRICE_TIERS[PRICE_TIERS.length - 1];

export type OrderTotals = {
  /** Individual packs, however they are boxed. A carton of six counts as six. */
  items: number;
  perItem: number;
  subtotal: number;
  delivery: number;
  total: number;
  /** False until the order reaches the minimum; checkout stays shut. */
  meetsMinimum: boolean;
  /** How many more are needed to reach the minimum. 0 once it is met. */
  shortBy: number;
  /**
   * The next rate up and what it takes to get there — the nudge on the cart.
   * null once the order is already on the best rate.
   */
  nextTier: { tier: PriceTier; itemsAway: number } | null;
};

export function tierFor(items: number): PriceTier {
  return PRICE_TIERS.find((tier) => items >= tier.minItems) ?? BASE_TIER;
}

export function orderTotals(items: number): OrderTotals {
  const tier = tierFor(items);
  const subtotal = items * tier.perItem;
  // An empty order is not a $20 courier job.
  const delivery = items > 0 ? tier.delivery : 0;

  // The best rate this order hasn't reached yet, if there is one.
  const better = [...PRICE_TIERS]
    .reverse()
    .find((candidate) => candidate.minItems > items);

  return {
    items,
    perItem: tier.perItem,
    subtotal,
    delivery,
    total: subtotal + delivery,
    meetsMinimum: items >= MINIMUM_ITEMS,
    shortBy: Math.max(0, MINIMUM_ITEMS - items),
    nextTier: better ? { tier: better, itemsAway: better.minItems - items } : null,
  };
}

const NZD = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" });

export const formatPrice = (amount: number) => NZD.format(amount);
