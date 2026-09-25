"use client";

/**
 * The shop's catalogue and delivery runs, both from the Angel Food API.
 *
 * What is sold and what it costs live in the WebsiteProduct table rather than
 * in this repo, so adding a meal or moving a price is a database change and
 * not a deploy. DeliveryRate holds one row per postcode we run a truck to —
 * used now to say *whether* we deliver somewhere and on what day, while the
 * charge itself is the flat island rate in lib/pricing.ts.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://angelfood-api.webappconsulting.com.au/api";

const S3_BUCKET_URL = "https://angelfood-bucket.s3.ap-southeast-2.amazonaws.com/";

/**
 * Where a product's picture actually lives.
 *
 * The database stores a path, not a file, and that path can point at three
 * different places. Today every product names artwork committed to this repo
 * under /images — which works, but means the API can name a picture it does
 * not own, and adding a product there needs a website deploy before it has a
 * photo. So an uploaded or S3-hosted image resolves too, the same way recipe
 * photos already do (see `resolveImageUrl` in lib/api.ts), and a product can
 * be given a picture from the API side whenever that is wanted.
 */
export function resolveProductImage(path: string | null): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;

  // Already a URL — an S3 object, a CDN, anything absolute.
  if (trimmed.startsWith("http")) return trimmed;

  // Artwork committed to this repo, served by Next out of /public.
  if (trimmed.startsWith("/images/")) return trimmed;

  // Uploaded through the API, served from the API host rather than here.
  if (trimmed.startsWith("/uploads/")) {
    return `${API_BASE.replace(/\/api$/, "")}${trimmed}`;
  }

  // Anything else is a bare S3 key, e.g. "products/burgers.webp".
  return `${S3_BUCKET_URL}${trimmed.replace(/^\/+/, "")}`;
}

export type ShopProduct = {
  id: number;
  /** Which run of the page it sits under: "Meals", "Meat", … */
  section: string;
  code: string;
  name: string;
  /** The feed's own warehouse shorthand, kept for matching an order back. */
  feedName: string;
  weight: string;
  image: string | null;
  /** What one of these costs. Meals are sold singly, never by the carton. */
  unitPrice: number;
};

export type DeliveryRate = {
  postcode: string;
  suburb: string;
  region: string;
  /** Depot the run leaves from. */
  hub: string;
  /** Sunday everywhere except the Christchurch run. */
  deliveryDay: string;
  /**
   * The courier's own charge for this postcode. Kept for the business's
   * records; the customer is charged the flat island rate instead.
   */
  totalCharge: number;
};

/** The API's casing varies by endpoint, so read either. */
const pick = <T>(row: Record<string, unknown>, ...names: string[]): T | undefined => {
  for (const name of names) {
    const key = Object.keys(row).find((k) => k.toLowerCase() === name.toLowerCase());
    if (key !== undefined && row[key] !== null) return row[key] as T;
  }
  return undefined;
};

const num = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

/** The sections to show, and the order they run in. */
export const SECTION_ORDER = ["Meals", "Meat"];

/**
 * Sections held back from online ordering.
 *
 * Meat is paused at the client's request: the products stay in the API and on
 * the shelf, they just aren't sold here for now. Empty this array to offer
 * them again — nothing else needs changing.
 */
export const HIDDEN_SECTIONS = ["Meat"];

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  const rows = await getJson<Record<string, unknown>[]>("/WebsiteProduct");

  const products: ShopProduct[] = [];
  for (const row of rows) {
    const code = (pick<string>(row, "code") || "").trim();
    const section = (pick<string>(row, "section") || "").trim() || "More";
    if (HIDDEN_SECTIONS.includes(section)) continue;

    // The API prices a carton, because that is how the warehouse thinks. A
    // meal's price is that divided by what the carton holds.
    const cartonQty = num(pick(row, "cartonQty"));
    const baseCartonPrice = num(pick(row, "baseCartonPrice"));
    // Without a code, a carton size and a price there is nothing to sell.
    if (!code || cartonQty <= 0 || baseCartonPrice <= 0) continue;

    products.push({
      id: num(pick(row, "websiteProudctId", "websiteProductId", "id")),
      section,
      code,
      name: (pick<string>(row, "name") || code).trim(),
      feedName: (pick<string>(row, "feedName") || "").trim(),
      weight: (pick<string>(row, "weight") || "").trim(),
      image: resolveProductImage(pick<string>(row, "image") || null),
      unitPrice: Math.round((baseCartonPrice / cartonQty) * 100) / 100,
    });
  }

  // Known sections first in their set order; anything new the API adds
  // follows, alphabetically, rather than disappearing.
  const rank = (section: string) => {
    const i = SECTION_ORDER.indexOf(section);
    return i === -1 ? SECTION_ORDER.length : i;
  };
  products.sort(
    (a, b) =>
      rank(a.section) - rank(b.section) ||
      a.section.localeCompare(b.section) ||
      a.id - b.id
  );

  return products;
}

/** Every section present in a product list, in display order. */
export function sectionsOf(products: ShopProduct[]): string[] {
  const seen: string[] = [];
  for (const p of products) if (!seen.includes(p.section)) seen.push(p.section);
  return seen;
}

/* ------------------------------------------------------------------ */
/* Delivery runs                                                       */
/* ------------------------------------------------------------------ */

/** Raised when a postcode has no delivery run — not an error, an answer. */
export class NotDeliverableError extends Error {
  constructor(public postcode: string) {
    super(`We don't have a delivery run to ${postcode} yet.`);
    this.name = "NotDeliverableError";
  }
}

export async function fetchDeliveryRate(
  postcode: string,
  signal?: AbortSignal
): Promise<DeliveryRate> {
  const normalised = postcode.trim().padStart(4, "0");
  const res = await fetch(
    `${API_BASE}/DeliveryRate/GetByPostcode?postcode=${encodeURIComponent(normalised)}`,
    { cache: "no-store", signal }
  );

  // The API answers 404 for a postcode off the rate card, which is a real
  // answer rather than a failure — the checkout says so instead of guessing.
  // This is also what enforces "no rural delivery": an RD postcode is not on
  // a run, so it never gets as far as being charged for.
  if (res.status === 404) throw new NotDeliverableError(normalised);
  if (!res.ok) throw new Error(`Delivery lookup failed: HTTP ${res.status}`);

  const row = (await res.json()) as Record<string, unknown>;
  return {
    postcode: (pick<string>(row, "postcode") || normalised).trim(),
    suburb: (pick<string>(row, "suburb") || "").trim(),
    region: (pick<string>(row, "region") || "").trim(),
    hub: (pick<string>(row, "hub") || "").trim(),
    deliveryDay: (pick<string>(row, "deliveryDay") || "").trim(),
    totalCharge: num(pick(row, "totalCharge")),
  };
}
