"use client";

/**
 * The order being built on /buy-now, kept in the browser.
 *
 * There is no checkout yet, so nothing is sent anywhere: the cart lives in
 * localStorage so it survives a reload and a wander around the site, and
 * `useCart` is what every view reads it through.
 */

import { useSyncExternalStore } from "react";
import type { PackSize } from "./meals";

const STORAGE_KEY = "angelfood-cart-v1";

/** Past any sane order — stops a held key or a stray paste running away. */
const MAX_QUANTITY = 99;

export type CartLine = {
  /** The meal's product code. With `packSize`, this identifies the line. */
  code: string;
  packSize: PackSize;
  name: string;
  image: string | null;
  /** Units in a carton, kept for the "6 × 400g" label. */
  cartonQty: number;
  weight: string;
  /** NZD for one of whatever `packSize` says, as priced when it was added. */
  price: number;
  quantity: number;
};

export const lineKey = (code: string, packSize: PackSize) => `${code}:${packSize}`;

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

const EMPTY: CartLine[] = [];

// `useSyncExternalStore` compares snapshots by identity, so the lines have to
// live here and only ever be *replaced* — rebuilding the array on every read
// would re-render without end.
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();
let watchingOtherTabs = false;

const clamp = (n: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.round(n)));

function isLine(value: unknown): value is CartLine {
  const line = value as CartLine;
  return (
    !!line &&
    typeof line.code === "string" &&
    (line.packSize === "unit" || line.packSize === "carton") &&
    typeof line.price === "number" &&
    Number.isFinite(line.price) &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    // Anything malformed — hand-edited storage, a shape from an older
    // version — is dropped rather than rendered.
    const clean = parsed
      .filter(isLine)
      .map((line) => ({ ...line, quantity: clamp(line.quantity) }));
    return clean.length ? clean : EMPTY;
  } catch {
    // A private window, or blocked site data, throws on access.
    return EMPTY;
  }
}

function notify() {
  for (const listener of listeners) listener();
}

function snapshot(): CartLine[] {
  if (lines === null) lines = read();
  return lines;
}

/** Server-rendered markup shows an empty cart; the browser fills it in. */
function serverSnapshot(): CartLine[] {
  return EMPTY;
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — the cart still works for this page view.
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // The same cart open in another tab writes to the same key. One listener
  // serves every subscriber, and lives as long as the page.
  if (!watchingOtherTabs) {
    watchingOtherTabs = true;
    window.addEventListener("storage", (e) => {
      // A `null` key means the whole store was cleared.
      if (e.key !== null && e.key !== STORAGE_KEY) return;
      lines = read();
      notify();
    });
  }

  return () => {
    listeners.delete(listener);
  };
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/** Adds to the matching line if there is one, otherwise starts a new one. */
export function addToCart(line: Omit<CartLine, "quantity">, quantity = 1) {
  const key = lineKey(line.code, line.packSize);
  const current = snapshot();
  const existing = current.some((l) => lineKey(l.code, l.packSize) === key);

  commit(
    existing
      ? current.map((l) =>
          lineKey(l.code, l.packSize) === key
            ? // Spread `line` over the old one so a name or price that has
              // changed since it went in the cart comes along too.
              { ...l, ...line, quantity: clamp(l.quantity + quantity) }
            : l
        )
      : [...current, { ...line, quantity: clamp(quantity) }]
  );
}

export function setLineQuantity(code: string, packSize: PackSize, quantity: number) {
  if (quantity < 1) return removeLine(code, packSize);
  const key = lineKey(code, packSize);
  commit(
    snapshot().map((l) =>
      lineKey(l.code, l.packSize) === key ? { ...l, quantity: clamp(quantity) } : l
    )
  );
}

export function removeLine(code: string, packSize: PackSize) {
  const key = lineKey(code, packSize);
  commit(snapshot().filter((l) => lineKey(l.code, l.packSize) !== key));
}

export function clearCart() {
  commit(EMPTY);
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useCart() {
  const cartLines = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  let count = 0;
  let total = 0;
  for (const line of cartLines) {
    count += line.quantity;
    total += line.price * line.quantity;
  }

  return { lines: cartLines, count, total };
}
