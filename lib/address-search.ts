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
 */

import { NZ_REGIONS } from "./stores";

const ENDPOINT = "https://nominatim.openstreetmap.org/search";

/** Below this there are too many matches for the answer to be useful. */
export const MIN_QUERY_LENGTH = 4;

export type AddressSuggestion = {
  /** The whole address on one line, for the list. */
  label: string;
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

  // A result with no street is a town or a region — true, but not somewhere
  // a courier can deliver to, so it is no use on this form.
  if (!street) return null;

  return {
    label: result.display_name ?? street,
    address1: street,
    suburb: address.suburb ?? address.neighbourhood ?? address.village ?? address.hamlet ?? "",
    city: address.city ?? address.town ?? address.municipality ?? address.county ?? "",
    region: toRegion(address.state),
    postcode: address.postcode ?? "",
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
    // The same street can come back once per house number on it.
    if (!suggestion || seen.has(suggestion.label)) continue;
    seen.add(suggestion.label);
    suggestions.push(suggestion);
  }

  return suggestions;
}
