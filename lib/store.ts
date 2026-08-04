/**
 * Store content carried over from the old Squarespace site at
 * angelfood.co.nz/store. The old store was never wired up to a live checkout —
 * it listed a single product at £0.00 — so these pages reproduce the content
 * only and send shoppers to /where-to-buy instead of a cart.
 */

export type StoreProduct = {
  slug: string;
  name: string;
  price: string;
  image: string;
  imageAlt: string;
  /** Short intro line above the "For:" list. */
  intro: string;
  usedFor: string[];
  format: string;
  productCode: string;
};

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    slug: "dairy-free-mozzarella-block",
    name: "Dairy-free mozzarella block",
    price: "£0.00",
    image:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/88202af8-b742-4716-87c6-d86ac7613f25/flier+Aus+food+service+03-2026v2-3.png",
    imageAlt: "Dairy-free mozzarella block",
    intro: "Melty and mild. For:",
    usedFor: [
      "Pizza & flatbreads",
      "Toasties & panini",
      "Lasagne & baked pasta",
      "Loaded fries & nachos",
    ],
    format: "500G BLOCK IN BAG",
    productCode: "MOZZ500G",
  },
];

export function getStoreProduct(slug: string): StoreProduct | undefined {
  return STORE_PRODUCTS.find((p) => p.slug === slug);
}
