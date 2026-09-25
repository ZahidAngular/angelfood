"use client";

/**
 * The order being built on /buy-now, kept in the browser.
 *
 * An order is a bundle — 12, 18 or 24 meals — and the mix that fills it. The
 * bundle size is part of the order rather than a separate preference, because
 * the cart and the checkout both have to know what size box is being packed,
 * and an order that doesn't exactly fill its box can't be sent.
 *
 * A line stores what that meal cost at the moment it went in, so the cart can
 * total itself without going back to the API on every page. Touching the line
 * again refreshes that figure, so a price moved in the database catches up.
 */

import { useSyncExternalStore } from "react";
import { BUNDLE_SIZES, type BundleSize } from "./pricing";

// v4: no pack sizes — meals are single items — and the bundle size travels
// with the lines.
const STORAGE_KEY = "angelfood-order-v4";

export type CartLine = {
  /** The product code, which identifies the line. */
  code: string;
  name: string;
  image: string | null;
  weight: string;
  /** What one of these cost when it went in. */
  unitPrice: number;
  /** How many of this meal are in the bundle. */
  quantity: number;
};

export type Order = {
  bundle: BundleSize;
  lines: CartLine[];
};

const DEFAULT_BUNDLE: BundleSize = BUNDLE_SIZES[0];

/** Past any bundle — stops a held key or a stray paste running away. */
const MAX_QUANTITY = 99;

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

const EMPTY: Order = { bundle: DEFAULT_BUNDLE, lines: [] };

// `useSyncExternalStore` compares snapshots by identity, so the order has to
// live here and only ever be *replaced* — rebuilding it on every read would
// re-render without end.
let order: Order | null = null;
const listeners = new Set<() => void>();
let watchingOtherTabs = false;

const isBundle = (value: unknown): value is BundleSize =>
  BUNDLE_SIZES.includes(value as BundleSize);

function isLine(value: unknown): value is CartLine {
  const line = value as CartLine;
  return (
    !!line &&
    typeof line.code === "string" &&
    !!line.code &&
    typeof line.unitPrice === "number" &&
    line.unitPrice > 0 &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function read(): Order {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY;

    const stored = parsed as Partial<Order>;
    const bundle = isBundle(stored.bundle) ? stored.bundle : DEFAULT_BUNDLE;
    // Anything malformed — hand-edited storage, a shape from an older
    // version — is dropped rather than rendered. Quantities are not squeezed
    // back into the bundle here: an order left over-full by shrinking the box
    // should still read as over-full after a reload, not quietly trim itself.
    const lines = Array.isArray(stored.lines)
      ? stored.lines.filter(isLine).map((line) => ({
          ...line,
          quantity: Math.min(MAX_QUANTITY, Math.round(line.quantity)),
        }))
      : [];

    return lines.length ? { bundle, lines } : { bundle, lines: [] };
  } catch {
    // A private window, or blocked site data, throws on access.
    return EMPTY;
  }
}

function notify() {
  for (const listener of listeners) listener();
}

function snapshot(): Order {
  if (order === null) order = read();
  return order;
}

/** Server-rendered markup shows an empty order; the browser fills it in. */
function serverSnapshot(): Order {
  return EMPTY;
}

function commit(next: Order) {
  order = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — the order still works for this page view.
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // The same order open in another tab writes to the same key. One listener
  // serves every subscriber, and lives as long as the page.
  if (!watchingOtherTabs) {
    watchingOtherTabs = true;
    window.addEventListener("storage", (e) => {
      // A `null` key means the whole store was cleared.
      if (e.key !== null && e.key !== STORAGE_KEY) return;
      order = read();
      notify();
    });
  }

  return () => {
    listeners.delete(listener);
  };
}

const itemsIn = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + line.quantity, 0);

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/**
 * Picks the box size.
 *
 * A bigger box never disturbs what is already chosen. A smaller one can leave
 * the order over-full, and rather than quietly throwing away meals the
 * shopper picked, it stays over-full and visibly says so — they decide what
 * comes out.
 */
export function setBundle(bundle: BundleSize) {
  const current = snapshot();
  if (current.bundle === bundle) return;
  commit({ ...current, bundle });
}

/**
 * Sets how many of one meal are in the bundle, never letting the total run
 * past the box. Zero takes the meal out.
 */
export function setQuantity(product: Omit<CartLine, "quantity">, quantity: number) {
  const current = snapshot();
  const existing = current.lines.find((l) => l.code === product.code);
  const wanted = Math.max(0, Math.round(quantity));

  if (wanted === 0) return removeLine(product.code);

  // Room left once this line's own current quantity is set aside.
  const others = itemsIn(current.lines) - (existing?.quantity ?? 0);
  const capped = Math.min(wanted, Math.max(0, current.bundle - others));
  if (capped === 0) return;

  commit({
    ...current,
    lines: existing
      ? current.lines.map((l) =>
          l.code === product.code
            ? // Spread the product over the old line so a price that has moved
              // in the database comes along too.
              { ...l, ...product, quantity: capped }
            : l
        )
      : [...current.lines, { ...product, quantity: capped }],
  });
}

/** Adds `by` more of a meal, up to whatever room is left in the bundle. */
export function addToOrder(product: Omit<CartLine, "quantity">, by = 1) {
  const existing = snapshot().lines.find((l) => l.code === product.code);
  setQuantity(product, (existing?.quantity ?? 0) + by);
}

export function removeLine(code: string) {
  const current = snapshot();
  commit({ ...current, lines: current.lines.filter((l) => l.code !== code) });
}

export function clearOrder() {
  commit({ bundle: snapshot().bundle, lines: [] });
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useOrder() {
  const current = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const items = itemsIn(current.lines);

  return {
    lines: current.lines,
    bundle: current.bundle,
    items,
    /** Room left in the box. Negative when the bundle was shrunk under it. */
    remaining: current.bundle - items,
    /** How many of a given meal are in the order. */
    quantityOf: (code: string) =>
      current.lines.find((l) => l.code === code)?.quantity ?? 0,
  };
}
