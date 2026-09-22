/**
 * What an order costs.
 *
 * Goods and freight are worked out separately, because they behave
 * differently. A carton costs what a carton costs, however many you take —
 * two cartons is simply twice one. Freight is the opposite: it is charged per
 * carton on the truck, at a rate that depends on where the truck is going, so
 * two cartons to the same address costs twice the delivery.
 *
 * Both halves come from the API rather than living here: carton price, carton
 * size and the freight uplift come from WebsiteProduct, and the per-postcode
 * rate from DeliveryRate. Nothing in this file is a figure someone has to
 * remember to keep in step with the database.
 */

import type { DeliveryRate, ProductPricing } from "./shop";

/** Below this we don't ship: a smaller order costs more to send than it earns. */
export const MINIMUM_ITEMS = 12;

/**
 * Freight charged past `baseCartonLimit` cartons, when the products in the
 * order don't say. The products all carry their own figures; this only covers
 * an order of something that somehow arrived without them.
 */
const FALLBACK_CARTON_LIMIT = 2;
const FALLBACK_UPLIFT_PERCENT = 0;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** One item's share of a carton — $138 over 12 is $11.50 a meal. */
export function itemPrice(product: ProductPricing): number {
  if (!product.cartonQty || !product.baseCartonPrice) return 0;
  return product.baseCartonPrice / product.cartonQty;
}

/**
 * Freight for a whole order.
 *
 * Each carton on the truck is charged the postcode's rate. Past
 * `limit` cartons each further one is charged `upliftPercent` more, which is
 * what the extra handling on a bigger drop costs — so one carton is the rate,
 * two is exactly double, and a large order climbs from there.
 */
export function deliveryFor(
  cartons: number,
  ratePerCarton: number,
  limit: number = FALLBACK_CARTON_LIMIT,
  upliftPercent: number = FALLBACK_UPLIFT_PERCENT
): number {
  return deliveryBreakdown(cartons, ratePerCarton, limit, upliftPercent).total;
}

export type DeliveryBreakdown = {
  total: number;
  /** Cartons charged at the plain rate. */
  atBase: number;
  /** Cartons charged the uplifted rate, and what that rate is. */
  atUplift: number;
  upliftRate: number;
};

/**
 * The same sum, itemised. The summary shows this rather than "cartons × rate",
 * which stops being true the moment the uplift applies and leaves a customer
 * looking at a multiplication that doesn't reach the total.
 */
export function deliveryBreakdown(
  cartons: number,
  ratePerCarton: number,
  limit: number = FALLBACK_CARTON_LIMIT,
  upliftPercent: number = FALLBACK_UPLIFT_PERCENT
): DeliveryBreakdown {
  const upliftRate = round2(ratePerCarton * (1 + upliftPercent / 100));
  if (cartons <= 0 || ratePerCarton <= 0) {
    return { total: 0, atBase: 0, atUplift: 0, upliftRate };
  }

  const atBase = Math.min(cartons, Math.max(0, limit));
  const atUplift = cartons - atBase;
  return {
    total: round2(atBase * ratePerCarton + atUplift * upliftRate),
    atBase,
    atUplift,
    upliftRate,
  };
}

export type OrderTotals = {
  /** Individual packs. A carton of twelve counts as twelve. */
  items: number;
  /**
   * Cartons on the truck, which is what freight is charged on. Loose packs
   * are grouped into cartons rather than riding free — twelve singles take up
   * the same space as the carton they came out of.
   */
  cartons: number;
  subtotal: number;
  /** null until a postcode we deliver to is known — not the same as free. */
  delivery: number | null;
  /** null while delivery is unknown, for the same reason. */
  total: number | null;
  meetsMinimum: boolean;
  shortBy: number;
  /** The rate the freight was worked out from, for showing the customer. */
  rate: DeliveryRate | null;
  /** How that freight splits across cartons. null when there is no rate. */
  breakdown: DeliveryBreakdown | null;
};

export type PricedLine = {
  /** Items this line puts in the order. */
  items: number;
  /** Fraction of a carton it takes up — 6 of a 12-carton meal is half. */
  cartons: number;
  price: number;
};

/** What one cart line costs and how much of a carton it occupies. */
export function priceLine(
  product: ProductPricing,
  packSize: "unit" | "carton",
  quantity: number
): PricedLine {
  const cartonQty = product.cartonQty || 1;
  const items = quantity * (packSize === "carton" ? cartonQty : 1);
  return {
    items,
    cartons: items / cartonQty,
    price: round2(items * itemPrice(product)),
  };
}

export function orderTotals(
  lines: PricedLine[],
  rate: DeliveryRate | null,
  freight: { limit: number; upliftPercent: number }
): OrderTotals {
  let items = 0;
  let cartonFraction = 0;
  let subtotal = 0;

  for (const line of lines) {
    items += line.items;
    cartonFraction += line.cartons;
    subtotal += line.price;
  }

  // Part of a carton still takes a carton's room on the truck.
  const cartons = Math.ceil(round2(cartonFraction));
  const breakdown = rate
    ? deliveryBreakdown(cartons, rate.totalCharge, freight.limit, freight.upliftPercent)
    : null;
  const delivery = breakdown ? breakdown.total : null;

  return {
    items,
    cartons,
    subtotal: round2(subtotal),
    delivery,
    total: delivery === null ? null : round2(subtotal + delivery),
    meetsMinimum: items >= MINIMUM_ITEMS,
    shortBy: Math.max(0, MINIMUM_ITEMS - items),
    rate,
    breakdown,
  };
}

const NZD = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" });

export const formatPrice = (amount: number) => NZD.format(amount);
