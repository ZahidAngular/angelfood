"use client";

/**
 * Address lookup for the checkout, over OpenStreetMap's Nominatim — the same
 * service the store locator searches, so the site has one geocoder rather
 * than two. It needs no API key and no billing account, and results are
 * restricted to New Zealand because that is the only place we deliver.
 *
 * Nominatim asks that clients stay under a request a second, which the
 * caller's debounce handles, and it is community-run open data: good on
 * streets and towns, thinner on brand-new subdivisions and rural delivery
 * numbers than a paid address service (Google Places, NZ Post's AMS) would
 * be. So a lookup fills the form in; every field stays editable afterwards,
 * and nothing here blocks someone typing their address by hand.
 *
 * It searches on whatever is typed, so a street number finds a doorstep, a
 * street finds a street and a suburb finds a suburb. All three are offered,
 * because OSM often has the road but not the houses on it.
 *
 * Only a house-level match fills the postcode in. OSM hangs a postal-area
 * code off road and suburb geometry — Kelburn Parade comes back 6040, the
 * suburb of Riccarton 8440 — and neither is on the courier's rate card, so
 * accepting them had the checkout tell a Wellington customer we do not
 * deliver to Wellington. An empty postcode box is a moment's typing; a wrong
 * one is a lost order.
 */

import { NZ_REGIONS } from "./stores";

const ENDPOINT = "https://nominatim.openstreetmap.org/search";

/** Below this there are too many matches for the answer to be useful. */
export const MIN_QUERY_LENGTH = 4;

export type AddressSuggestion = {
  /** Headline for the list: the street line, or the name of the place. */
  label: string;
  /** The line under it — suburb, town, postcode. */
  detail: string;
  /**
   * "address" is somewhere a courier can go — it has a street number.
   * "street" is a road OSM knows without the houses on it, which still saves
   * the road, suburb and town. "locality" is a suburb or town on its own;
   * searching "Ponsonby" used to return nothing at all.
   */
  kind: "address" | "street" | "locality";
  /** The road, with its number when there is one. Empty for a locality. */
  address1: string;
  suburb: string;
  city: string;
  region: string;
  /** Only ever set from a house-level match — see the note at the top. */
  postcode: string;
  /** What the customer still has to type. Drives the hint in the list. */
  missing: "" | "number" | "street";
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  suburb?: string;
  neighbourhood?: string;
  village?: string;
  hamlet?: string;
  city?: string;
  town?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
};

type NominatimResult = {
  display_name?: string;
  address?: NominatimAddress;
};

/** Ignores case and the macrons the feed and our list spell differently. */
const flatten = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/gi, "")
    .toLowerCase();

/**
 * Nominatim's `state` is close to our region list but not always spelled the
 * same — "Manawatu-Wanganui" against "Manawatū-Whanganui". Anything that
 * doesn't match is left blank rather than guessed, since the field is
 * optional and a wrong region is worse than an empty one.
 */
function toRegion(state: string | undefined): string {
  if (!state) return "";
  const wanted = flatten(state);
  return NZ_REGIONS.find((region) => flatten(region) === wanted) ?? "";
}

function toSuggestion(result: NominatimResult): AddressSuggestion | null {
  const address = result.address ?? {};
  const road = address.road ?? address.pedestrian ?? "";
  const houseNumber = address.house_number ?? "";
  const street = [houseNumber, road].filter(Boolean).join(" ").trim();

  const suburb =
    address.suburb ?? address.neighbourhood ?? address.village ?? address.hamlet ?? "";
  const city = address.city ?? address.town ?? address.municipality ?? address.county ?? "";

  // Deliberately not `display_name`, which reads
  // "Chief Post Office, 12, Queen Street, Princes Wharf, Wynyard Quarter,
  // City Centre, Auckland, Waitematā, Auckland, 1010, New Zealand" — every
  // administrative layer OSM knows, in one unreadable run.
  const label = street || road || suburb || city;
  if (!label) return null;

  const kind: AddressSuggestion["kind"] = houseNumber
    ? "address"
    : road
      ? "street"
      : "locality";

  // Only a house has a postcode we can trust. See the note at the top of the
  // file: OSM's road and suburb postcodes are postal-area codes the couriers
  // do not run to, and a wrong one gets the order refused at the checkout.
  const postcode = kind === "address" ? (address.postcode ?? "") : "";

  const detail = [
    suburb && suburb !== label ? suburb : "",
    city && city !== label && city !== suburb ? city : "",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    label,
    detail: [detail, postcode].filter(Boolean).join(" "),
    kind,
    address1: street,
    suburb,
    city,
    region: toRegion(address.state),
    postcode,
    missing: kind === "address" ? "" : kind === "street" ? "number" : "street",
    // Kept only for ranking; not part of the public shape.
    ...({ __houseNumber: houseNumber } as object),
  } as AddressSuggestion & { __houseNumber: string };
}

/** The leading street number in what was typed, if there is one. */
function typedHouseNumber(query: string): string {
  return /^\s*(\d+[a-z]?)/i.exec(query)?.[1] ?? "";
}

/**
 * Most useful first.
 *
 * OSM answers "1 Nile Street" with 1/110, 1/111, 1/155 and so on — every unit
 * whose number merely starts with a 1 — and buries the road itself under
 * them. So an exact number match wins, then the road (which at least fills
 * the suburb in), then everything else in the order it arrived.
 */
function rank(
  suggestions: (AddressSuggestion & { __houseNumber?: string })[],
  query: string
) {
  const wanted = typedHouseNumber(query).toLowerCase();

  return suggestions
    .map((suggestion, index) => {
      const number = (suggestion.__houseNumber ?? "").toLowerCase();
      let score = 3;
      if (wanted && number === wanted) score = 0;
      else if (suggestion.kind === "street") score = 1;
      else if (suggestion.kind === "address") score = 2;
      return { suggestion, score, index };
    })
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ suggestion }) => {
      const clean = { ...suggestion };
      delete clean.__houseNumber;
      return clean as AddressSuggestion;
    });
}

/** Addresses matching `query`, New Zealand only. Throws if the lookup fails. */
export async function searchNzAddresses(
  query: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < MIN_QUERY_LENGTH) return [];

  const params = new URLSearchParams({
    format: "json",
    addressdetails: "1",
    countrycodes: "nz",
    // More than we show: the road repeats below collapse several into one,
    // and ranking needs candidates to choose between.
    limit: "12",
    dedupe: "1",
    "accept-language": "en",
    q,
  });

  const res = await fetch(`${ENDPOINT}?${params}`, { signal });
  if (!res.ok) throw new Error(`Address lookup failed: HTTP ${res.status}`);

  const results = (await res.json()) as NominatimResult[];
  const suggestions: (AddressSuggestion & { __houseNumber?: string })[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    const suggestion = toSuggestion(result);
    if (!suggestion) continue;

    // One address comes back once per business at it — four cafes at 12 Queen
    // Street are one address as far as a delivery is concerned. A road comes
    // back once per segment OSM has split it into, which is worse: five
    // identical "Kelburn Parade" rows, none of them distinguishable.
    const key = `${suggestion.kind}|${suggestion.label}|${suggestion.suburb}|${suggestion.city}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push(suggestion);
  }

  return rank(suggestions, q).slice(0, 6);
}
