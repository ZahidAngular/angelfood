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
 * It searches on whatever is typed, so a street number finds a doorstep and
 * a suburb finds a suburb. Both are offered — a suburb still fills in the
 * town, region and postcode.
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
   * "address" is somewhere a courier can go. "locality" is a suburb or town
   * that fills in everything but the street, which is still most of the
   * typing saved — searching "Ponsonby" used to return nothing at all.
   */
  kind: "address" | "locality";
  /** Empty for a locality, which has no street of its own. */
  address1: string;
  suburb: string;
  city: string;
  region: string;
  postcode: string;
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
  const street = [address.house_number, address.road ?? address.pedestrian]
    .filter(Boolean)
    .join(" ")
    .trim();

  const suburb =
    address.suburb ?? address.neighbourhood ?? address.village ?? address.hamlet ?? "";
  const city = address.city ?? address.town ?? address.municipality ?? address.county ?? "";
  const postcode = address.postcode ?? "";

  // Deliberately not `display_name`, which reads
  // "Chief Post Office, 12, Queen Street, Princes Wharf, Wynyard Quarter,
  // City Centre, Auckland, Waitematā, Auckland, 1010, New Zealand" — every
  // administrative layer OSM knows, in one unreadable run.
  const label = street || suburb || city;
  if (!label) return null;

  const detail = [
    street && suburb ? suburb : "",
    city && city !== label ? city : "",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    label,
    detail: [detail, postcode].filter(Boolean).join(" "),
    kind: street ? "address" : "locality",
    address1: street,
    suburb,
    city,
    region: toRegion(address.state),
    postcode,
  };
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
    limit: "6",
    "accept-language": "en",
    q,
  });

  const res = await fetch(`${ENDPOINT}?${params}`, { signal });
  if (!res.ok) throw new Error(`Address lookup failed: HTTP ${res.status}`);

  const results = (await res.json()) as NominatimResult[];
  const suggestions: AddressSuggestion[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    const suggestion = toSuggestion(result);
    if (!suggestion) continue;
    // One address can come back once per business at it — four cafes at
    // 12 Queen Street are one address as far as a delivery is concerned.
    const key = suggestion.label + "|" + suggestion.detail;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push(suggestion);
  }

  return suggestions;
}
