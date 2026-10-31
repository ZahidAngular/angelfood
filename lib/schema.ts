import { SITE_NAME, SITE_URL } from "./site";

/**
 * Builders for the JSON-LD the site emits. Keeping them here rather than inline
 * in each page means the shapes stay consistent — one spelling of the brand,
 * one way of building absolute URLs — and a validator failure has a single
 * place to be fixed.
 *
 * Absolute URLs throughout: Google resolves @id and url against the document,
 * but relative values are a common source of "invalid URL" warnings, so every
 * builder takes a site-relative path and expands it.
 */

export const abs = (pathOrUrl: string) =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;

/**
 * Site-wide identity. Paired with the Organization block in the root layout —
 * Organization describes the business, WebSite describes this web property.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-NZ",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export type Crumb = { name: string; path: string };

/**
 * Breadcrumb trail. Pass it the same steps the page shows visually — Google
 * expects the markup to match what a visitor can see, so the two must be built
 * from the same list rather than drifting apart.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/**
 * A retail product.
 *
 * Deliberately no `offers`: Angel Food sells through supermarkets, not from
 * this site, and there is no real price to quote. An Offer block asserts that
 * a price is available here, so inventing one to unlock the price rich result
 * would be exactly the fabricated markup Google penalises. Price and
 * availability can be added the day a real checkout exists.
 */
export function productSchema({
  name,
  description,
  image,
  url,
  sku,
  category,
}: {
  name: string;
  description: string;
  image: string;
  url: string;
  sku?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: abs(image),
    url: abs(url),
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(sku ? { sku } : {}),
    ...(category ? { category } : {}),
  };
}

/**
 * The page itself as an article, beside whatever the page is about.
 *
 * Recipe pages already carry Recipe markup, which is what earns the recipe
 * rich result; this one describes the page as a piece of writing, which is
 * what AI search tools and site audits (Ahrefs) look for. Google treats every
 * Article field as recommended rather than required, so it adds no
 * validation errors.
 */
export function articleSchema({
  headline,
  description,
  image,
  url,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  image: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    // Google cuts headlines off at 110 characters.
    headline: headline.slice(0, 110),
    description,
    image: [abs(image)],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: abs(url),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

/**
 * A listing page's contents. `ItemList` tells Google the page is a collection
 * and what is in it, which helps the individual entries get discovered.
 */
export function itemListSchema({
  name,
  url,
  items,
}: {
  name: string;
  url: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: abs(url),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: abs(item.path),
    })),
  };
}
