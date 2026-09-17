"use client";

/**
 * Checkout: the customer's details, and the hand-off to Stripe.
 *
 * Stripe's hosted Checkout page is what takes the card, so no card details
 * ever touch this site. Getting there needs a Checkout Session, and a session
 * can only be created with the Stripe *secret* key — which belongs on a
 * server and nowhere near a browser. This site currently builds as a static
 * export with no server of its own, so that one call is the piece still to be
 * stood up: point NEXT_PUBLIC_CHECKOUT_API_URL at an endpoint that creates
 * the session and the flow below is complete. Until then it refuses to
 * pretend, loudly. See docs/stripe-checkout.md for the contract and a
 * reference implementation.
 */

import { useMemo, useSyncExternalStore } from "react";
import { lineItems, type CartLine } from "./cart";
import { orderTotals } from "./pricing";

/** The endpoint that creates a Stripe Checkout Session. Empty until wired. */
const CHECKOUT_API_URL = process.env.NEXT_PUBLIC_CHECKOUT_API_URL || "";

/** Everything here is priced and charged in New Zealand dollars. */
export const CURRENCY = "nzd";

export const paymentsConfigured = () => CHECKOUT_API_URL !== "";

/* ------------------------------------------------------------------ */
/* The order                                                           */
/* ------------------------------------------------------------------ */

export type CheckoutLine = {
  /** The product code, so the order can be matched back to the catalogue. */
  code: string;
  name: string;
  /** What the customer chose — "Carton (6 × 400g)". Shown on Stripe's page. */
  description: string;
  quantity: number;
  /** Price of one, in cents: Stripe counts in the currency's minor unit. */
  unitAmount: number;
};

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address1: string;
  address2: string;
  suburb: string;
  city: string;
  region: string;
  postcode: string;
  deliveryNotes: string;
};

export { orderTotals };

export type CheckoutRequest = {
  currency: typeof CURRENCY;
  lines: CheckoutLine[];
  /** Freight, in cents. Charged on top of the lines, never inside them. */
  deliveryAmount: number;
  customer: CheckoutCustomer;
  /** Stripe only accepts absolute URLs for these. */
  successUrl: string;
  cancelUrl: string;
};

/** What the server hands back: Stripe's hosted page to send the buyer to. */
export type CheckoutSession = {
  url: string;
  id?: string;
};

export const emptyCustomer: CheckoutCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  address1: "",
  address2: "",
  suburb: "",
  city: "",
  region: "",
  postcode: "",
  deliveryNotes: "",
};

/** Cents, rounded — floats like 8.5 * 100 can land a hair under. */
export const toCents = (amount: number) => Math.round(amount * 100);

/**
 * Priced in individual items rather than packs: the rate is per item, so a
 * carton of six goes to Stripe as six at the item rate. That way the payment
 * page itemises what the customer actually agreed to.
 */
export function toCheckoutLines(
  cart: CartLine[],
  perItem: number,
  describe: (line: CartLine) => string
): CheckoutLine[] {
  return cart.map((line) => ({
    code: line.code,
    name: line.name,
    description: describe(line),
    quantity: lineItems(line),
    unitAmount: toCents(perItem),
  }));
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export type FieldErrors = Partial<Record<keyof CheckoutCustomer, string>>;

/**
 * The checkout asks for one thing at a time. Which fields belong to which
 * step lives here so the form can check a step without having to know the
 * shape of the whole customer.
 */
export const CHECKOUT_STEPS = [
  { id: "details", label: "Details", heading: "Your details" },
  { id: "delivery", label: "Delivery", heading: "Where it's going" },
  { id: "review", label: "Review", heading: "Review and pay" },
] as const;

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]["id"];

const STEP_FIELDS: Record<CheckoutStep, (keyof CheckoutCustomer)[]> = {
  details: ["firstName", "lastName", "email", "phone", "company"],
  delivery: [
    "address1",
    "address2",
    "suburb",
    "city",
    "region",
    "postcode",
    "deliveryNotes",
  ],
  // Nothing new is asked for on the last step — it checks the lot.
  review: [],
};

/** Only what this step actually asked for, so a later field can't block it. */
export function errorsForStep(
  customer: CheckoutCustomer,
  step: CheckoutStep
): FieldErrors {
  const all = validateCustomer(customer);
  if (step === "review") return all;

  const mine: FieldErrors = {};
  for (const field of STEP_FIELDS[step]) {
    if (all[field]) mine[field] = all[field];
  }
  return mine;
}

/** The step a given field is asked for on — for jumping back to fix it. */
export function stepForField(field: keyof CheckoutCustomer): CheckoutStep {
  return STEP_FIELDS.details.includes(field) ? "details" : "delivery";
}

// Deliberately loose. An address or a phone number that looks wrong to a
// regex is usually just an address or a phone number we hadn't thought of,
// and a checkout that argues with a paying customer is worse than one that
// takes an odd-looking line.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HAS_DIGITS = /\d/;

export function validateCustomer(customer: CheckoutCustomer): FieldErrors {
  const errors: FieldErrors = {};
  const required: [keyof CheckoutCustomer, string][] = [
    ["firstName", "Please tell us your first name."],
    ["lastName", "Please tell us your last name."],
    ["address1", "We need a street address to deliver to."],
    ["city", "Which town or city?"],
    ["postcode", "A postcode helps us get this to the right place."],
  ];

  for (const [field, message] of required) {
    if (!customer[field].trim()) errors[field] = message;
  }

  const email = customer.email.trim();
  if (!email) errors.email = "We send your receipt and updates here.";
  else if (!EMAIL.test(email)) errors.email = "That email doesn't look right.";

  const phone = customer.phone.trim();
  if (!phone) errors.phone = "The courier may need to call you.";
  else if (!HAS_DIGITS.test(phone) || phone.replace(/\D/g, "").length < 7) {
    errors.phone = "That phone number looks too short.";
  }

  // NZ postcodes are four digits. Anything else is a typo far more often
  // than it is an address we can actually deliver to.
  const postcode = customer.postcode.trim();
  if (postcode && !/^\d{4}$/.test(postcode)) {
    errors.postcode = "New Zealand postcodes are four digits.";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Remembering what was typed                                          */
/* ------------------------------------------------------------------ */

/**
 * The details are kept on the customer's own device so a trip to Stripe and
 * back — a cancelled payment, a declined card — doesn't cost them the form.
 * Only what they typed here: no card details ever reach this site, and
 * nothing is sent anywhere until they press pay.
 */
const DETAILS_KEY = "angelfood-checkout-v1";

function parseCustomer(raw: string): CheckoutCustomer {
  if (!raw) return emptyCustomer;
  try {
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return emptyCustomer;
    // Take only the fields we know, as strings — whatever else is in there.
    const merged = { ...emptyCustomer };
    for (const key of Object.keys(emptyCustomer) as (keyof CheckoutCustomer)[]) {
      const value = (saved as Record<string, unknown>)[key];
      if (typeof value === "string") merged[key] = value;
    }
    return merged;
  } catch {
    return emptyCustomer;
  }
}

/**
 * Both hooks below read something only the browser knows, which React can't
 * see while rendering. `useSyncExternalStore` is how you tell it about such a
 * thing: it renders the server's answer first, then swaps in the browser's —
 * no flash of the wrong markup, and no copying into state from an effect.
 *
 * Neither value changes on its own, so nothing subscribes. The snapshots are a
 * string and a boolean, compared by value, which is what keeps this stable.
 */
const noSubscribe = () => () => {};

function readSaved(): string {
  try {
    return window.localStorage.getItem(DETAILS_KEY) ?? "";
  } catch {
    return "";
  }
}

/** The delivery details as last entered on this device. */
export function useSavedCustomer(): CheckoutCustomer {
  const raw = useSyncExternalStore(noSubscribe, readSaved, () => "");
  return useMemo(() => parseCustomer(raw), [raw]);
}

/** Whether Stripe sent the customer back without taking payment. */
export function usePaymentCancelled(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).has("cancelled"),
    () => false
  );
}

/** The tail of Stripe's session id, shown back as an order reference. */
export function usePaymentReference(): string {
  return useSyncExternalStore(
    noSubscribe,
    () =>
      (new URLSearchParams(window.location.search).get("session_id") || "")
        .slice(-8)
        .toUpperCase(),
    () => ""
  );
}

export function saveCustomer(customer: CheckoutCustomer) {
  try {
    window.localStorage.setItem(DETAILS_KEY, JSON.stringify(customer));
  } catch {
    // Private window, or blocked site data. The checkout still works.
  }
}

export function forgetCustomer() {
  try {
    window.localStorage.removeItem(DETAILS_KEY);
  } catch {
    // Nothing to do — it was never stored.
  }
}

/* ------------------------------------------------------------------ */
/* Stripe                                                              */
/* ------------------------------------------------------------------ */

/** Thrown when no session endpoint is configured, so this never looks paid. */
export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super(
      "Card payments aren't switched on yet. Set NEXT_PUBLIC_CHECKOUT_API_URL " +
        "to an endpoint that creates a Stripe Checkout Session — see " +
        "docs/stripe-checkout.md."
    );
    this.name = "PaymentsNotConfiguredError";
  }
}

/**
 * Asks the server for a Stripe Checkout Session.
 *
 * The response is Stripe's hosted payment page; the caller sends the browser
 * straight there. Anything less than a usable URL is an error — a checkout
 * that quietly does nothing is the one failure a shopper can't recover from.
 */
export async function createCheckoutSession(
  request: CheckoutRequest
): Promise<CheckoutSession> {
  if (!CHECKOUT_API_URL) throw new PaymentsNotConfiguredError();

  const res = await fetch(CHECKOUT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Couldn't start the payment (HTTP ${res.status}). ${detail}`.trim()
    );
  }

  const session = (await res.json()) as CheckoutSession;
  if (!session?.url) {
    throw new Error("The payment session came back without a payment page.");
  }
  return session;
}
