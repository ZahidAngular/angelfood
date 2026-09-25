/**
 * Placing an order, and following it afterwards.
 *
 * What this does *not* send is the price. The browser says what was chosen and
 * where it goes; the server reads the catalogue and the rate card and decides
 * what that costs. Totals posted from a page anyone can edit would be an
 * invitation to order two dozen dinners for a cent, so the figures shown
 * during checkout are a quote the server then confirms.
 */

import type { CartLine } from "./cart";
import type { CheckoutCustomer } from "./checkout";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://angelfood-api.webappconsulting.com.au/api";

/* ------------------------------------------------------------------ */
/* Placing                                                             */
/* ------------------------------------------------------------------ */

export type PlacedOrder = {
  orderNumber: string;
  /** The other half of the tracking link. Never shown, only carried. */
  trackingToken: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  island: string | null;
  deliveryDay: string | null;
  status: string;
  createdDate: string;
};

/**
 * The server's own words when it refuses an order — "we do not have a delivery
 * run to 7010". Worth showing as-is: it is more use than "something went
 * wrong", and it is the server that knows why.
 */
export class OrderRefusedError extends Error {}

export async function placeOrder(
  customer: CheckoutCustomer,
  lines: CartLine[],
  bundleSize: number
): Promise<PlacedOrder> {
  const res = await fetch(`${API_BASE_URL}/WebsiteSalesOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address1: customer.address1,
      address2: customer.address2,
      suburb: customer.suburb,
      city: customer.city,
      region: customer.region,
      postcode: customer.postcode,
      deliveryNotes: customer.deliveryNotes,
      bundleSize,
      lines: lines.map((line) => ({
        productCode: line.code,
        quantity: line.quantity,
      })),
    }),
  });

  const text = await res.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    // A proxy or gateway error page rather than the API — fall through to the
    // generic message below rather than showing the customer raw HTML.
  }

  if (!res.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "";

    throw new OrderRefusedError(
      message ||
        "We couldn't place that order just now. Please try again, or call us on 09 828 0000."
    );
  }

  return payload as PlacedOrder;
}

/* ------------------------------------------------------------------ */
/* Tracking                                                            */
/* ------------------------------------------------------------------ */

export type TrackingStep = {
  statusId: number;
  status: string;
  label: string;
  description: string;
  reached: boolean;
  current: boolean;
  reachedDate: string | null;
  note: string | null;
};

export type TrackingLine = {
  productName: string | null;
  weight: string | null;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderTracking = {
  orderNumber: string;
  createdDate: string;
  statusId: number;
  status: string;
  statusLabel: string;
  statusDescription: string;
  /** Completes "Ana, …" — a sentence, not the label. */
  statusHeadline: string;
  statusChangedDate: string;
  isCancelled: boolean;
  firstName: string | null;
  deliverTo: string | null;
  deliveryDay: string | null;
  island: string | null;
  trackingReference: string | null;
  trackingUrl: string | null;
  bundleSize: number;
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  lines: TrackingLine[];
  steps: TrackingStep[];
};

/** Thrown when the number and token don't together name an order. */
export class OrderNotFoundError extends Error {}

export async function fetchTracking(
  orderNumber: string,
  token: string
): Promise<OrderTracking> {
  const url =
    `${API_BASE_URL}/WebsiteSalesOrder/Track` +
    `?orderNumber=${encodeURIComponent(orderNumber)}` +
    `&token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404 || res.status === 400) {
    throw new OrderNotFoundError(
      "We couldn't find that order. Check the link in your confirmation email."
    );
  }

  if (!res.ok) {
    throw new Error(`Tracking lookup failed (${res.status})`);
  }

  return (await res.json()) as OrderTracking;
}

/* ------------------------------------------------------------------ */
/* The link                                                            */
/* ------------------------------------------------------------------ */

/**
 * Where an order can be followed. Both halves travel in the URL so the link
 * works straight from the inbox, with nothing to type and no account to make.
 */
export const trackingPath = (orderNumber: string, token: string) =>
  `/track?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`;

const RECEIPT_KEY = "angelfood-last-order";

export type StoredReceipt = {
  orderNumber: string;
  trackingToken: string;
  total: number;
  placedAt: string;
};

/**
 * The last order, kept on the customer's own device so the confirmation page
 * has something to show after the redirect, and so "track my order" works
 * later from the same browser without digging out the email.
 */
export function rememberReceipt(order: PlacedOrder) {
  try {
    const receipt: StoredReceipt = {
      orderNumber: order.orderNumber,
      trackingToken: order.trackingToken,
      total: order.total,
      placedAt: order.createdDate,
    };
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
  } catch {
    // Private browsing, or storage turned off. The confirmation email still
    // carries the link, so this is a convenience rather than the only copy.
  }
}

export function readReceipt(): StoredReceipt | null {
  try {
    const raw = localStorage.getItem(RECEIPT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReceipt;
    return parsed?.orderNumber && parsed?.trackingToken ? parsed : null;
  } catch {
    return null;
  }
}
