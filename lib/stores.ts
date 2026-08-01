/**
 * Live stockist data for the Where to Buy store locator.
 *
 * Source: the Angel Food banner API. Store rows come back with `name: null`,
 * coordinates as strings (occasionally unparseable), abbreviated duplicate
 * product names, and supplier/vendor codes glued onto the address — so
 * everything below is about turning that into something presentable.
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

export type BannerName = (typeof BANNERS)[number]["name"];

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
  products: string[];
  regions: string[];
  /** Rows the API returned that had no usable coordinates. */
  skipped: number;
  /** False when every banner request failed — lets the UI say so honestly. */
  ok: boolean;
};

/* ------------------------------------------------------------------ */
/* Address parsing                                                     */
/* ------------------------------------------------------------------ */

const REGIONS = [
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
const PLACES = [...new Set([...REGIONS, ...Object.keys(CITY_REGION)])].sort(
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

/** The API ships the same product under abbreviated and full spellings. */
const PRODUCT_ALIASES: Record<string, string> = {
  "But Chck & Rice PlntBsd400g": "Butter Chicken & Rice 400g",
  "Butter Chck&Rice Plant Based 400g": "Butter Chicken & Rice 400g",
  "Lasagne Plnt Bsd Chsy400g": "Cheesy Lasagne 400g",
  "Lasagne Plant Based Cheesy 400g": "Cheesy Lasagne 400g",
  "Rice Bowl Tofu & Spinch400g": "Tofu & Spinach Rice Bowl 400g",
  "Rice Bowl Tofu & Spinch 400g": "Tofu & Spinach Rice Bowl 400g",
  "VegKrm CmnRce Rst Brc400g": "Veg Korma & Cumin Rice 400g",
  "VegKrm Cmn Rce Rst Brc 400g": "Veg Korma & Cumin Rice 400g",
  "Grated Mozzarella Bnb 10kg": "Grated Mozzarella 10kg (Food Service)",
};

const canonProduct = (n: string | null | undefined) => {
  const t = (n || "").trim();
  return t ? PRODUCT_ALIASES[t] ?? t : "";
};

/** Not a current retail product — drop it entirely. */
const DISCONTINUED = /smoked cheddar/i;

/**
 * Retail display name: drops food-service-only lines and discontinued
 * products, and strips the trailing pack size so e.g. "Sour Cream Tub 200g"
 * and "Sour Cream Tub 240g" both collapse to "Sour Cream Tub".
 */
function toRetailName(canon: string): string | null {
  if (!canon) return null;
  if (/food service/i.test(canon)) return null;
  if (DISCONTINUED.test(canon)) return null;
  return canon
    .replace(/\s*\d+(\.\d+)?\s*(g|kg)\s*$/i, "")
    .replace(/\s+(Block|Tub)\s*$/i, "")
    .trim();
}

export const PRODUCT_CATEGORY_ORDER = [
  "Dairy alternatives",
  "Ready meals",
  "Meat alternatives",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORY_ORDER)[number];

const READY_MEAL = /rice|lasagn|korma|curry|bowl/i;
const MEAT_ALT = /chicken|beef|pork|bacon|fish finger|patt(y|ies)|meatball/i;

/** Which section a product belongs to in the "Product" filter dropdown. */
export function categorizeProduct(name: string): ProductCategory {
  if (READY_MEAL.test(name)) return "Ready meals";
  if (MEAT_ALT.test(name)) return "Meat alternatives";
  return "Dairy alternatives";
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
  inventory: { id: number; name: string }[] | null;
};

export async function getStoreData(): Promise<StoreData> {
  const responses = await Promise.allSettled(
    BANNERS.map(async (banner) => {
      const res = await fetch(
        `${API_BASE}/ProductContact/GetStoreWithLocations?bannerCategoryId=${banner.id}`,
        { next: { revalidate: REVALIDATE_SECONDS } }
      );
      if (!res.ok) throw new Error(`${banner.name}: HTTP ${res.status}`);
      return { banner, payload: (await res.json()) as { storeData: ApiStore[] } };
    })
  );

  const stores: Store[] = [];
  const products = new Set<string>();
  const regions = new Set<string>();
  let skipped = 0;
  let succeeded = 0;

  for (const result of responses) {
    if (result.status !== "fulfilled") {
      console.error("[store-locator] banner fetch failed:", result.reason);
      continue;
    }
    succeeded++;

    const { banner, payload } = result.value;
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
      const inventory = [
        ...new Set(
          (row.inventory ?? [])
            .map((p) => toRetailName(canonProduct(p.name)))
            .filter((n): n is string => !!n)
        ),
      ].sort();

      inventory.forEach((p) => products.add(p));
      if (region) regions.add(region);

      stores.push({
        id: `${banner.id}-${row.id}`,
        // Real names are absent from the feed, so build "<banner> <suburb>".
        name: locality ? `${banner.name} ${locality}` : banner.name,
        banner: banner.name,
        address: cleaned,
        postcode: postcode || (row.postCode ?? ""),
        region,
        lat,
        lng,
        hours: (row.hours || "").trim(),
        products: inventory,
      });
    }
  }

  stores.sort((a, b) => a.name.localeCompare(b.name));

  return {
    stores,
    products: [...products].sort((a, b) => a.localeCompare(b)),
    regions: [...regions].sort((a, b) => a.localeCompare(b)),
    skipped,
    ok: succeeded > 0,
  };
}
