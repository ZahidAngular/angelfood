/**
 * Live stockist data for the Where to Buy store locator.
 *
 * Source: the Angel Food banner API. Store rows come back with `name: null`,
 * coordinates as strings (occasionally unparseable), product names in the
 * warehouse's spelling rather than the shop's, and supplier/vendor codes glued
 * onto the address — so everything below is about turning that into something
 * presentable.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_STORE_API_BASE_URL ||
  "https://angelfood-api.webappconsulting.com.au/api";

/** How long (seconds) a fetched stockist list stays fresh. */
const REVALIDATE_SECONDS = 3600;

/**
 * Per-chain display config.
 * - `color` — vivid brand colour used for chips, list/legend dots, popup badge.
 * - `ring`  — the map pin's border. Same as `color` except PAK'nSAVE, whose
 *   yellow tile needs a dark ring for contrast (black-on-yellow is on-brand).
 * - `mark`  — square logo shown inside the map pin. Four Square and Woolworths
 *   are the logos you supplied; New World is its badge cropped from the
 *   supplied wordmark; PAK'nSAVE is its stickman rebuilt as vector (the
 *   supplied logo was a wide wordmark with no square icon).
 */
export const BANNERS = [
  { id: 1, name: "PAK'nSAVE", color: "#e7a330", ring: "#1c1c1c", mark: "/images/logos/marks/paknsave.svg" },
  { id: 2, name: "Four Square", color: "#2f8f46", ring: "#2f8f46", mark: "/images/logos/marks/foursquare.svg" },
  { id: 3, name: "New World", color: "#c8102e", ring: "#c8102e", mark: "/images/logos/marks/newworld.svg" },
  { id: 4, name: "Woolworths", color: "#178841", ring: "#178841", mark: "/images/logos/marks/woolworths.webp" },
] as const;

/**
 * The whole stockist list in one request.
 *
 * A strict superset of the four banners: the same 313 stores plus a handful
 * that belong to no banner at all — Fresh Choice, and a few foodservice
 * accounts — which the per-banner feeds never return, so they have been
 * missing from the map entirely.
 *
 * Fetched alongside the banners rather than instead of them. It is usually
 * two or three seconds but has been seen at eleven and occasionally times
 * out, while each banner answers in about one; hanging the whole page on it
 * would trade a working map for a complete one.
 */
export const ALL_BANNER = { id: 0, name: "All" } as const;

/** Stores the feed gives no banner for. Not a chip — somewhere for pins to live. */
export const OTHER_BANNER = {
  name: "Other",
  color: "#14422c",
  ring: "#14422c",
  mark: "/images/logos/marks/independent.svg",
} as const;

export type BannerName = (typeof BANNERS)[number]["name"] | typeof OTHER_BANNER.name;

/**
 * Which banner a store belongs to, read off its name.
 *
 * Needed only for the combined feed, which returns no banner field at all —
 * every row's `category` comes back empty. Checked against all 313 stores
 * whose banner the per-banner feeds state outright: it agrees with every one.
 */
export function bannerFromName(name: string | null): BannerName {
  const n = (name || "").toLowerCase();
  if (n.includes("pak") && n.includes("sav")) return "PAK'nSAVE";
  if (n.includes("four square")) return "Four Square";
  if (n.includes("new world")) return "New World";
  // CDOWN is how the feed writes the Countdown stores that became Woolworths.
  if (n.includes("woolworth") || n.includes("countdown") || n.startsWith("cdown"))
    return "Woolworths";
  return OTHER_BANNER.name;
}

/** A product name paired with the category the feed files it under. */
export type ProductInfo = { name: string; category: string };

export type Store = {
  id: string;
  name: string;
  banner: BannerName;
  address: string;
  postcode: string;
  region: string;
  lat: number;
  lng: number;
  hours: string;
  products: string[];
};

export type StoreData = {
  stores: Store[];
  /** Every product stocked somewhere, with the category it belongs to. */
  products: ProductInfo[];
  regions: string[];
  /** Rows the API returned that had no usable coordinates. */
  skipped: number;
  /** False when every banner request failed — lets the UI say so honestly. */
  ok: boolean;
};

/* ------------------------------------------------------------------ */
/* Address parsing                                                     */
/* ------------------------------------------------------------------ */

/** New Zealand's regions — for reading addresses, and for entering one. */
export const NZ_REGIONS = [
  "Northland", "Auckland", "Waikato", "Bay of Plenty", "Gisborne",
  "Hawke's Bay", "Taranaki", "Manawatū-Whanganui", "Wellington", "Tasman",
  "Nelson", "Marlborough", "West Coast", "Canterbury", "Otago", "Southland",
];

/** Cities/districts that appear in addresses, mapped to their region. */
const CITY_REGION: Record<string, string> = {
  Whangarei: "Northland", "Whangārei": "Northland", Kaipara: "Northland",
  Mangonui: "Northland", Kerikeri: "Northland",
  "Waiheke Island": "Auckland", "Red Beach": "Auckland", Papakura: "Auckland",
  Pukekohe: "Auckland", Warkworth: "Auckland",
  Hamilton: "Waikato", Cambridge: "Waikato", "Taupō": "Waikato",
  Taupo: "Waikato", Thames: "Waikato", Matamata: "Waikato", Tokoroa: "Waikato",
  Tauranga: "Bay of Plenty", Rotorua: "Bay of Plenty",
  "Whakatāne": "Bay of Plenty", Whakatane: "Bay of Plenty",
  Napier: "Hawke's Bay", Hastings: "Hawke's Bay", "Hawkes Bay": "Hawke's Bay",
  "New Plymouth": "Taranaki", Hawera: "Taranaki", "Hāwera": "Taranaki",
  "Palmerston North": "Manawatū-Whanganui", Whanganui: "Manawatū-Whanganui",
  Wanganui: "Manawatū-Whanganui", Levin: "Manawatū-Whanganui",
  Manawatu: "Manawatū-Whanganui", "Manawatu-Wanganui": "Manawatū-Whanganui",
  "Manawatū-Whanganui": "Manawatū-Whanganui", Feilding: "Manawatū-Whanganui",
  "Lower Hutt": "Wellington", "Upper Hutt": "Wellington",
  Porirua: "Wellington", Paraparaumu: "Wellington", Kapiti: "Wellington",
  Wairarapa: "Wellington", Masterton: "Wellington",
  Blenheim: "Marlborough", Picton: "Marlborough",
  Christchurch: "Canterbury", Timaru: "Canterbury", Ashburton: "Canterbury",
  Waimakariri: "Canterbury", Amberley: "Canterbury", Rangiora: "Canterbury",
  Kaikoura: "Canterbury", "Kaikōura": "Canterbury", Twizel: "Canterbury",
  Dunedin: "Otago", Queenstown: "Otago", Wanaka: "Otago", Oamaru: "Otago",
  Balclutha: "Otago", Cromwell: "Otago",
  Invercargill: "Southland", Gore: "Southland",
  Greymouth: "West Coast", "East Coast": "West Coast", Westport: "West Coast",
};

/** Longest-first so "Bay of Plenty" wins over "Plenty". */
const PLACES = [...new Set([...NZ_REGIONS, ...Object.keys(CITY_REGION)])].sort(
  (a, b) => b.length - a.length
);

/** Street/structure words — hitting one means the suburb has ended. */
const NOT_LOCALITY =
  /^(road|rd|street|st|ave|avenue|drive|dr|highway|hwy|way|lane|ln|place|pl|terrace|tce|crescent|cres|court|ct|parade|pde|quay|mall|square|sq|state|cnr|corner|shop|shopping|plaza|retail|village|centre|center|the|and|hutt|lower|upper|new|old|mount|mt|te|saint|north|south|east|west|point|pt)$/i;

/**
 * Words that legitimately *lead* a suburb ("St Heliers", "Mount Albert",
 * "Te Atatu", "New Lynn"). They're also street words, so they only get pulled
 * in once a real suburb word has been collected.
 */
const LOCALITY_PREFIX = /^(st|saint|mount|mt|te|new|old|upper|lower|north|south|east|west|point|pt)$/i;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function cleanAddress(raw: string | null | undefined): string {
  return (raw || "")
    .replace(/\bSupplier\s*#:?\s*\d+/gi, "")
    .replace(/\bVENDOR:?\s*\d+/gi, "")
    .replace(/\bNew Zealand\b/gi, "")
    .replace(/\s+Region\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[,\s]+$/, "");
}

function parseAddress(raw: string | null | undefined) {
  const cleaned = cleanAddress(raw);

  // Postcode is the last standalone 3-4 digit run; some have a dropped
  // leading zero ("814" -> "0814").
  const pcMatches = [...cleaned.matchAll(/\b(\d{3,4})\b/g)];
  const pc = pcMatches.length ? pcMatches[pcMatches.length - 1] : null;
  const postcode = pc ? pc[1].padStart(4, "0") : "";
  const head = pc
    ? cleaned.slice(0, pc.index).trim().replace(/[,\s]+$/, "")
    : cleaned;

  const place = PLACES.find((p) =>
    new RegExp(`(^|[\\s,])${escapeRe(p)}$`, "i").test(head)
  );
  const region = place ? CITY_REGION[place] ?? place : "";

  // Suburb = up to 3 capitalised words sitting just before the city/region.
  let locality = "";
  if (place) {
    const cut = head.toLowerCase().lastIndexOf(place.toLowerCase());
    const before = head.slice(0, cut).trim().replace(/[,\s]+$/, "");
    const tokens = before.split(/\s+/).filter(Boolean);
    const picked: string[] = [];

    for (let i = tokens.length - 1; i >= 0 && picked.length < 3; i--) {
      const t = tokens[i].replace(/,/g, "");
      if (!/^[A-ZĀĒĪŌŪ][a-zāēīōūA-Z'’-]*$/.test(t)) break;

      if (LOCALITY_PREFIX.test(t)) {
        // "St Heliers" yes; "Great King St Dunedin" no — there the word we
        // already have is itself a city, so "St" is just a street type.
        const first = picked[0];
        const firstIsPlace =
          !!first && PLACES.some((p) => p.toLowerCase() === first.toLowerCase());
        if (picked.length && !firstIsPlace) picked.unshift(t);
        break;
      }

      if (NOT_LOCALITY.test(t)) break;
      picked.unshift(t);
    }

    // Addresses often repeat the suburb ("Karori Rd, Karori Karori").
    const seen = new Set<string>();
    locality = picked
      .filter((w) => {
        const k = w.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .join(" ");
  }

  return { cleaned, postcode, region, locality: locality || place || "" };
}

/* ------------------------------------------------------------------ */
/* Product names                                                       */
/* ------------------------------------------------------------------ */

/**
 * What the shop calls each product, keyed by the name the stockist feed uses.
 *
 * The two systems name the same product differently: the stockist feed sends
 * "VegKrm Cmn Rce Rst Brc 400g" where the shop sells "Vege Korma". The
 * WebsiteProduct table already carries both — `feedName` is the stockist
 * spelling, `name` is the product — so the mapping comes from there rather
 * than from a list kept in this file. A hardcoded list used to do this and had
 * drifted: it rendered "Butter Chck&Rice Plant Based 400g" as "Butter Chicken
 * & Rice", a product of that name not being something Angel Food sells.
 *
 * Fetched once and shared: all five banner requests await the same promise,
 * so this costs one request rather than five, and runs alongside them rather
 * than before them.
 */
type ApiProduct = { name?: string | null; feedName?: string | null };

let catalogueNames: Promise<Record<string, string>> | null = null;

function productNames(): Promise<Record<string, string>> {
  if (!catalogueNames) {
    catalogueNames = fetch(`${API_BASE}/WebsiteProduct`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
      .then((res) => (res.ok ? (res.json() as Promise<ApiProduct[]>) : []))
      .then((rows) => {
        const map: Record<string, string> = {};
        for (const row of rows ?? []) {
          const feedName = (row.feedName || "").trim();
          const name = (row.name || "").trim();
          if (feedName && name) map[feedName] = name;
        }
        return map;
      })
      // A name the shop has not mapped still reads fine off the feed, so a
      // catalogue that will not load is worth carrying on without.
      .catch(() => ({}));
  }
  return catalogueNames;
}

/**
 * The name to show a customer.
 *
 * The shop's name wins where there is one. Otherwise the feed's own wording
 * stands with the pack size taken off, so that "Cheddar Tub 220g" and
 * "Cheddar Block 350g" — one product in two sizes, and absent from the shop's
 * catalogue because they are stocked rather than sold here — read as one
 * "Cheddar" entry instead of two near-identical lines in the filter.
 */
function toRetailName(
  raw: string | null | undefined,
  catalogue: Record<string, string>
): string | null {
  const name = (raw || "").trim();
  if (!name) return null;

  const fromCatalogue = catalogue[name];
  if (fromCatalogue) return fromCatalogue;

  // 10kg lines are for kitchens, not for the people reading this map.
  if (/food service/i.test(name)) return null;

  return name
    .replace(/\s*\d+(\.\d+)?\s*(g|kg)\s*$/i, "")
    .replace(/\s+(Block|Tub)\s*$/i, "")
    .trim();
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

/**
 * Categories come straight from the feed (`inventory[].category`). These are
 * the ones it sends today, listed in the order they should read; a category
 * added later still shows up, it just sorts in alphabetically after these.
 */
const CATEGORY_ORDER = ["Cheese", "Meals", "Meat"];

/** Where products the feed left uncategorised land. Always sorts last. */
export const OTHER_CATEGORY = "Other";

export type ProductGroup = { category: string; products: string[] };

function categoryRank(category: string) {
  const known = CATEGORY_ORDER.indexOf(category);
  if (known !== -1) return known;
  return category === OTHER_CATEGORY
    ? CATEGORY_ORDER.length + 1
    : CATEGORY_ORDER.length;
}

/** Splits a product list into its categories, ready to render as sections. */
export function groupByCategory(items: ProductInfo[]): ProductGroup[] {
  const groups = new Map<string, string[]>();

  for (const { name, category } of items) {
    const key = category || OTHER_CATEGORY;
    const bucket = groups.get(key);
    if (bucket) bucket.push(name);
    else groups.set(key, [name]);
  }

  return [...groups]
    .map(([category, products]) => ({ category, products }))
    .sort(
      (a, b) =>
        categoryRank(a.category) - categoryRank(b.category) ||
        a.category.localeCompare(b.category)
    );
}

/* ------------------------------------------------------------------ */
/* Fetch                                                               */
/* ------------------------------------------------------------------ */

/** Roughly mainland NZ + offshore islands; guards against junk coordinates. */
const NZ_BOUNDS = { minLat: -47.6, maxLat: -33.8, minLng: 165.8, maxLng: 179.2 };

type ApiStore = {
  id: number;
  name: string | null;
  address: string | null;
  location: { latitude: string | number; longitude: string | number } | null;
  postCode: string | null;
  hours: string | null;
  inventory: { id: number; name: string; category: string | null }[] | null;
};

type BannerConfig = (typeof BANNERS)[number] | typeof ALL_BANNER;

/** What one banner's feed yields: its stores, plus the categories it named. */
export type BannerStores = {
  stores: Store[];
  skipped: number;
  /** Retail product name -> category, for the rows that carried one. */
  categories: Record<string, string>;
};

/**
 * A stockist's own name, as something to show a customer.
 *
 * The feed appends an account code to almost every name — "Pak n Save Dunedin
 * (9029) /", "New World Albany 427701" — so the codes and trailing slashes
 * come off. What is left is the real name of the shop, which is what people
 * look for and what the stores are called in your own lists.
 *
 * This used to be thrown away and rebuilt as "<banner> <suburb>" from the
 * address, on the belief that the feed had no real names. It has them for 321
 * of 322 rows. Rebuilding them lost the distinctions that matter — New World
 * Centre City and New World Fendalton both became "New World Dunedin" and
 * "New World Christchurch" — and made stores look missing when they were
 * there under a name nobody would search for.
 *
 * Returns "" when the name really is just an internal code, and the caller
 * falls back to "<banner> <suburb>" for that one row.
 */
function tidyStoreName(name: string | null): string {
  let n = (name || "").trim();

  n = n.replace(/\s*\/\s*$/, "");            // "... /"
  n = n.replace(/\s*\(\s*\d+\s*\)\s*$/, ""); // "... (307645)"
  n = n.replace(/\s*-\s*\d{3,}\s*$/, "");    // "... - 419401"
  n = n.replace(/\s+\d{4,}\s*$/, "");        // "... 427701"
  n = n.replace(/^[\s\-–]+|[\s\-–]+$/g, "");

  // "CDOWN - New - Halswell WWNZ" is a warehouse reference, not a shopfront.
  if (/CDOWN|WWNZ/i.test(n)) return "";
  // Too few letters to be a name at all.
  if (n.replace(/[^A-Za-z]/g, "").length < 4) return "";

  // The feed spells the banners several ways; show them the way the chips do.
  n = n.replace(/^Woolworths\s+NZ\b/i, "Woolworths");
  n = n.replace(/^Pak\s*'?\s*n'?\s*Save\b/i, "PAK'nSAVE");
  n = n.replace(/^Fresh\s*Choice\b/i, "Fresh Choice");

  return n.trim();
}

/** One banner's rows, turned into presentable stores. Throws on fetch failure. */
export async function fetchBannerStores(
  banner: BannerConfig
): Promise<BannerStores> {
  const [res, catalogue] = await Promise.all([
    fetch(
      `${API_BASE}/ProductContact/GetStoreWithLocations?bannerCategoryId=${banner.id}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    ),
    productNames(),
  ]);
  if (!res.ok) throw new Error(`${banner.name}: HTTP ${res.status}`);
  const payload = (await res.json()) as { storeData: ApiStore[] };

  const stores: Store[] = [];
  const categories: Record<string, string> = {};
  let skipped = 0;

  for (const row of payload.storeData ?? []) {
    const lat = Number(row.location?.latitude);
    const lng = Number(row.location?.longitude);

    // A handful of rows have empty/NaN coords, and one sits in Virginia.
    const mappable =
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= NZ_BOUNDS.minLat &&
      lat <= NZ_BOUNDS.maxLat &&
      lng >= NZ_BOUNDS.minLng &&
      lng <= NZ_BOUNDS.maxLng;

    if (!mappable) {
      skipped++;
      continue;
    }

    const { cleaned, postcode, region, locality } = parseAddress(row.address);

    const inventory = new Set<string>();
    for (const item of row.inventory ?? []) {
      const name = toRetailName(item.name, catalogue);
      if (!name) continue;
      inventory.add(name);
      // Some rows arrive with no category at all (the 350g blocks), and a
      // product can appear in several pack sizes, so the first row that does
      // name a category settles it for that product everywhere.
      const category = (item.category || "").trim();
      if (category && !categories[name]) categories[name] = category;
    }

    // The combined feed states no banner, so it is read off the name. A
    // per-banner feed does not need reading: it has already said which it is.
    const storeBanner: BannerName =
      banner.id === ALL_BANNER.id
        ? bannerFromName(row.name)
        : (banner.name as BannerName);

    // Supermarket rows carry no real name — "CDOWN - New - Halswell WWNZ -
    // 9736" is not something to show anyone — so those are rebuilt as
    // "<banner> <suburb>". The handful that belong to no banner do have
    // usable names, and are the only places where the feed's own is better
    // than anything we could assemble.
    const storeName =
      tidyStoreName(row.name) ||
      (locality ? `${storeBanner} ${locality}` : storeBanner);

    stores.push({
      // The raw row id, because the same store comes back from both its
      // banner's feed and the combined one, and the two must collapse.
      id: String(row.id),
      name: storeName,
      banner: storeBanner,
      address: cleaned,
      postcode: postcode || (row.postCode ?? ""),
      region,
      lat,
      lng,
      hours: (row.hours || "").trim(),
      products: [...inventory].sort(),
    });
  }

  return { stores, skipped, categories };
}

/** Merges a set of per-banner store lists into one sorted, deduped StoreData. */
export function mergeStoreData(banners: BannerStores[]): StoreData {
  const names = new Set<string>();
  // Pooled across banners so a product only one banner categorised is still
  // filed correctly for every store that stocks it.
  const categories: Record<string, string> = {};
  const regions = new Set<string>();
  let skipped = 0;

  // Keyed by store id, because the combined feed returns the same stores as
  // the per-banner ones and pushing both would show every supermarket twice.
  const byId = new Map<string, Store>();

  for (const banner of banners) {
    skipped += banner.skipped;
    for (const [name, category] of Object.entries(banner.categories)) {
      if (!categories[name]) categories[name] = category;
    }
    for (const store of banner.stores) {
      store.products.forEach((p) => names.add(p));
      if (store.region) regions.add(store.region);

      const seen = byId.get(store.id);
      // A banner's own feed states its banner outright; the combined one has
      // it inferred from the name. They agree today, but where they could
      // not, the feed that knows wins.
      if (!seen || (seen.banner === "Other" && store.banner !== "Other")) {
        byId.set(store.id, store);
      }
    }
  }

  // A second pass on position, because the feed carries a few shops twice
  // under different ids — "2 Winter Street Mangapapa" appears once plainly and
  // once tagged with a supplier number. Same address, same coordinates, two
  // records, which an id-keyed pass cannot see and which would otherwise
  // stack two identical pins on one spot.
  const byPlace = new Map<string, Store>();
  for (const store of byId.values()) {
    const place = `${store.lat.toFixed(5)},${store.lng.toFixed(5)}`;
    const seen = byPlace.get(place);
    // Where two records describe one shop, keep the fuller one: a duplicate
    // often carries only part of the range.
    if (!seen || store.products.length > seen.products.length) {
      byPlace.set(place, store);
    }
  }

  const stores = [...byPlace.values()].sort((a, b) => a.name.localeCompare(b.name));

  return {
    stores,
    products: [...names]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, category: categories[name] ?? "" })),
    regions: [...regions].sort((a, b) => a.localeCompare(b)),
    skipped,
    ok: banners.length > 0,
  };
}

export async function getStoreData(): Promise<StoreData> {
  const responses = await Promise.allSettled(
    BANNERS.map((banner) => fetchBannerStores(banner))
  );

  const fulfilled: BannerStores[] = [];
  for (const result of responses) {
    if (result.status !== "fulfilled") {
      console.error("[store-locator] banner fetch failed:", result.reason);
      continue;
    }
    fulfilled.push(result.value);
  }

  return { ...mergeStoreData(fulfilled), ok: fulfilled.length > 0 };
}
