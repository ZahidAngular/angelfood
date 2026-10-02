import { SITE_NAME } from "./site";

/**
 * Lengthen a description that is too short to be a useful search snippet by
 * adding the shortest of the given tails that gets it to `min` characters.
 * Descriptions that are already long enough are returned untouched.
 */
export function padDescription(text: string, tails: string[], min = 110): string {
  const base = text.trim();
  if ([...base].length >= min) return base;
  const sep = /[.!?…]$/.test(base) ? " " : ". ";
  const tail = tails.find((t) => [...base].length + sep.length + [...t].length >= min) ?? tails[tails.length - 1];
  return `${base}${sep}${tail}`;
}

/** Trim to a search-snippet length at a word boundary, with an ellipsis. */
export function clip(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:–—-]+$/, "") + "…";
}

/**
 * Next.js replaces a layout's openGraph block wholesale when a page defines its
 * own, so a page that sets only url/title/description loses the type, site name
 * and share image. Spread this first in a page's openGraph so those survive and
 * the page's own url/title/description override it.
 */
export const OG_DEFAULTS = {
  type: "website" as const,
  siteName: SITE_NAME,
  locale: "en_NZ",
  images: [
    {
      url: "/images/hero.webp",
      width: 1200,
      height: 630,
      alt: "Angel Food vegan cheese",
    },
  ],
};
