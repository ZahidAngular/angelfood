/**
 * The meals you can order from /buy-now.
 *
 * Which products appear is the feed's call: everything the product feed files
 * under the "Meals" sub-category and flags as displayable. How they look and
 * what they cost is ours — the feed's names are warehouse shorthand ("VegKrm
 * Cmn Rce Rst Brc 400g") and it carries no retail price at all, only what a
 * carton costs to make.
 *
 * Fetched in the browser rather than at build time so a static export lists
 * what the feed says today instead of what it said at build (the same call the
 * store locator makes).
 */

import { MEALS } from "./site";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://angelfood-api.webappconsulting.com.au/api";

/** The sub-category ready meals are filed under in the product feed. */
const MEALS_SUBCATEGORY = "Meals";

/** Units per carton, for a product the saleable feed has no carton size for. */
const DEFAULT_CARTON_QTY = 6;

export type PackSize = "unit" | "carton";

/** NZD, GST inclusive. */
export type MealPrice = { unit: number; carton: number };

/**
 * PLACEHOLDER PRICES — replace these with Angel Food's real retail figures
 * before the page is announced.
 *
 * There is nothing to fetch: the feed's only number for these products is
 * `costPrice`, which is what a carton costs to make, so prices live here until
 * the API carries a retail one. `meal` ties the feed's product code to the
 * range on /products, which is where the photography, copy and accent colour
 * come from — so each meal is still described in exactly one place.
 */
const CATALOGUE: Record<string, { meal: string; price: MealPrice }> = {
  CMBC400G: { meal: "Creamy Butter Curry", price: { unit: 8.5, carton: 45 } },
  CMLC400G: { meal: "Vege Lasagna", price: { unit: 8.5, carton: 45 } },
  CMTS400G: { meal: "Tofu & Greens", price: { unit: 8.5, carton: 45 } },
  CMVK400G: { meal: "Vege Korma", price: { unit: 8.5, carton: 45 } },
};

export type BuyableMeal = {
  /** The feed's product code, e.g. "CMBC400G". With a pack size, a cart line. */
  code: string;
  name: string;
  blurb: string;
  image: string | null;
  accent: string;
  /** Net weight of a single unit, as printed on the sleeve. */
  weight: string;
  /** Units in one carton, from the feed. */
  cartonQty: number;
  /** null for a meal the feed sells that CATALOGUE has no price for yet. */
  price: MealPrice | null;
};

/* ------------------------------------------------------------------ */
/* Fetch                                                               */
/* ------------------------------------------------------------------ */

type FeedProduct = {
  styleCode: string | null;
  name: string | null;
  subCategory: string | null;
  displayStatus: boolean | null;
};

type SaleableProduct = {
  code: string | null;
  /** The feed's spelling, not a typo on our side. */
  quantityInCartion: number | null;
};

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

/** Where a meal sits on /products, so both pages run the range in one order. */
function rangeOrder(code: string): number {
  const entry = CATALOGUE[code];
  const i = entry ? MEALS.findIndex((m) => m.name === entry.meal) : -1;
  return i === -1 ? MEALS.length : i;
}

export async function fetchBuyableMeals(): Promise<BuyableMeal[]> {
  // One feed says which products are meals, the other how many go in a carton.
  // Neither carries both, and only the first is worth failing the page over.
  const [products, saleable] = await Promise.all([
    getJson<FeedProduct[]>("/Product/GetAllCin7Products"),
    getJson<SaleableProduct[]>("/Product/GetAllSaleableProducts").catch((err) => {
      console.error("[buy-now] carton sizes unavailable:", err);
      return [] as SaleableProduct[];
    }),
  ]);

  const cartonQtyByCode = new Map<string, number>();
  for (const row of saleable) {
    const code = (row.code || "").trim();
    const qty = Number(row.quantityInCartion);
    // A product is listed once per option, so codes repeat — first wins. A
    // carton of one is the feed saying the unit *is* the carton, which is no
    // use to someone choosing between the two.
    if (code && qty > 1 && !cartonQtyByCode.has(code)) cartonQtyByCode.set(code, qty);
  }

  const meals: BuyableMeal[] = [];
  const seen = new Set<string>();

  for (const row of products) {
    if ((row.subCategory || "").trim() !== MEALS_SUBCATEGORY) continue;
    // The feed's own "show this on the website" flag.
    if (!row.displayStatus) continue;

    const code = (row.styleCode || "").trim();
    if (!code || seen.has(code)) continue;
    seen.add(code);

    const entry = CATALOGUE[code];
    const range = entry ? MEALS.find((m) => m.name === entry.meal) : undefined;

    meals.push({
      code,
      // A meal the feed has added but the site has no card for still shows,
      // under the feed's own name — better a plain card than a silent gap.
      name: range?.name ?? (row.name || code).trim(),
      blurb: range?.blurb ?? "",
      image: range?.image ?? null,
      accent: range?.accent ?? "var(--color-green-bright)",
      weight: range?.weight ?? "",
      cartonQty: cartonQtyByCode.get(code) ?? DEFAULT_CARTON_QTY,
      price: entry?.price ?? null,
    });
  }

  meals.sort(
    (a, b) => rangeOrder(a.code) - rangeOrder(b.code) || a.name.localeCompare(b.name)
  );

  return meals;
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

/** How a chosen pack reads to a shopper: "Carton (6 × 400g)", or "400g". */
export function packLabel(
  packSize: PackSize,
  meal: { cartonQty: number; weight: string }
): string {
  if (packSize !== "carton") return meal.weight || "Single";
  return `Carton (${meal.cartonQty}${meal.weight ? ` × ${meal.weight}` : " packs"})`;
}

/** What one `packSize` of this meal costs, or null if it has no price yet. */
export function priceFor(meal: BuyableMeal, packSize: PackSize): number | null {
  if (!meal.price) return null;
  return packSize === "carton" ? meal.price.carton : meal.price.unit;
}

const NZD = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" });

export const formatPrice = (amount: number) => NZD.format(amount);

/**
 * What a carton saves against the same meals bought singly, as a whole
 * percent — the reason to take one. null when there is nothing in it.
 */
export function cartonSaving(meal: BuyableMeal): number | null {
  if (!meal.price || meal.cartonQty < 2) return null;
  const singly = meal.price.unit * meal.cartonQty;
  if (singly <= meal.price.carton) return null;
  return Math.round(((singly - meal.price.carton) / singly) * 100);
}
