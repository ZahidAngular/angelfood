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

import { MEALS, MEATS } from "./site";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://angelfood-api.webappconsulting.com.au/api";

/**
 * The sections this page sells, in the order they appear.
 *
 * The feed files ready meals under sub-category "Meals". It does not file
 * the meat range under anything — those products come through as plain
 * Retail with no sub-category — so which section they belong to comes from
 * CATALOGUE below. Tag them "Meat" in the feed and that takes over on its
 * own; nothing here needs changing.
 */
export const SECTIONS = ["Meals", "Meat"] as const;
export type Section = (typeof SECTIONS)[number];

const isSection = (value: string): value is Section =>
  (SECTIONS as readonly string[]).includes(value);

/** Units per carton, for a product the saleable feed has no carton size for. */
const DEFAULT_CARTON_QTY = 12;

export type PackSize = "unit" | "carton";

/**
 * What the site sells and how each one is presented.
 *
 * No prices here: what an item costs depends on how many are in the order,
 * not on which item it is — see lib/pricing.ts. `product` ties the feed's
 * code to the range on /products, which is where the photography, copy and
 * accent colour come from, so each one is described in exactly one place.
 */
const CATALOGUE: Record<
  string,
  { section: Section; product: string; cartonQty?: number }
> = {
  // The feed says six meals to a carton; a carton is twelve. Delete these
  // overrides once Cin7 is corrected and the feed's own figure takes over —
  // `cartonQty` is only consulted when it is set.
  CMBC400G: { section: "Meals", product: "Creamy Butter Curry", cartonQty: 12 },
  CMLC400G: { section: "Meals", product: "Vege Lasagna", cartonQty: 12 },
  CMTS400G: { section: "Meals", product: "Tofu & Greens", cartonQty: 12 },
  CMVK400G: { section: "Meals", product: "Vege Korma", cartonQty: 12 },

  MTBG255G: { section: "Meat", product: "Burgers" },
  MTFF230G: { section: "Meat", product: "Fish Fingers" },
  MTMB200G: { section: "Meat", product: "Meatballs" },
  MTPP200G: { section: "Meat", product: "Pulled Pork" },
  MTPI180G: { section: "Meat", product: "Pastrami" },
  MTSR200G: { section: "Meat", product: "Seafood Rings" },
};

/** Everything the site has a card for, whichever range it belongs to. */
const RANGE = [...MEALS, ...MEATS];

export type BuyableProduct = {
  /** The feed's product code, e.g. "CMBC400G". With a pack size, a cart line. */
  code: string;
  /** Which run of the page it sits under. */
  section: Section;
  name: string;
  blurb: string;
  image: string | null;
  accent: string;
  /** Net weight of a single unit, as printed on the sleeve. */
  weight: string;
  /** Units in one carton, from the feed. */
  cartonQty: number;
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

/** Where a product sits on /products, so both pages run the range in one order. */
function rangeOrder(code: string): number {
  const entry = CATALOGUE[code];
  const i = entry ? RANGE.findIndex((p) => p.name === entry.product) : -1;
  return i === -1 ? RANGE.length : i;
}

export async function fetchBuyableProducts(): Promise<BuyableProduct[]> {
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

  const buyable: BuyableProduct[] = [];
  const seen = new Set<string>();

  for (const row of products) {
    // The feed's own "show this on the website" flag.
    if (!row.displayStatus) continue;

    const code = (row.styleCode || "").trim();
    if (!code || seen.has(code)) continue;

    const entry = CATALOGUE[code];
    const filed = (row.subCategory || "").trim();
    // The feed has the final say on where something belongs; CATALOGUE only
    // answers for the products it has said nothing about.
    const section = isSection(filed) ? filed : entry?.section;
    if (!section) continue;

    seen.add(code);
    const range = entry ? RANGE.find((p) => p.name === entry.product) : undefined;

    buyable.push({
      code,
      section,
      // A meal the feed has added but the site has no card for still shows,
      // under the feed's own name — better a plain card than a silent gap.
      name: range?.name ?? (row.name || code).trim(),
      blurb: range?.blurb ?? "",
      image: range?.image ?? null,
      accent: range?.accent ?? "var(--color-green-bright)",
      weight: range?.weight ?? "",
      cartonQty:
        entry?.cartonQty ?? cartonQtyByCode.get(code) ?? DEFAULT_CARTON_QTY,
    });
  }

  buyable.sort(
    (a, b) =>
      SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) ||
      rangeOrder(a.code) - rangeOrder(b.code) ||
      a.name.localeCompare(b.name)
  );

  return buyable;
}

/* ------------------------------------------------------------------ */
/* Packs                                                               */
/* ------------------------------------------------------------------ */

/** How a chosen pack reads to a shopper: "Carton (6 × 400g)", or "400g". */
export function packLabel(
  packSize: PackSize,
  meal: { cartonQty: number; weight: string }
): string {
  if (packSize !== "carton") return meal.weight || "Single";
  return `Carton (${meal.cartonQty}${meal.weight ? ` × ${meal.weight}` : " packs"})`;
}

/** How many individual items a chosen pack puts into the order. */
export function itemsPerPack(
  packSize: PackSize,
  product: { cartonQty: number }
): number {
  return packSize === "carton" ? product.cartonQty : 1;
}
