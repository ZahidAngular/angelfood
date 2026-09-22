"use client";

/**
 * Where the order is going, and what that costs to send.
 *
 * Freight can't be quoted until a destination is known, so the postcode is
 * asked for once and remembered: typed into the order summary on /buy-now, or
 * filled in on the checkout's delivery step, either way the same value. Until
 * there is one the site says delivery is not yet known, which is honest —
 * showing $0 or a guess would be neither.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { fetchDeliveryRate, NotDeliverableError, type DeliveryRate } from "./shop";

const POSTCODE_KEY = "angelfood-postcode";

/* ------------------------------------------------------------------ */
/* The postcode                                                        */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>();
let watchingOtherTabs = false;

function readPostcode(): string {
  try {
    return window.localStorage.getItem(POSTCODE_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!watchingOtherTabs) {
    watchingOtherTabs = true;
    window.addEventListener("storage", (e) => {
      if (e.key !== null && e.key !== POSTCODE_KEY) return;
      for (const l of listeners) l();
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

export function rememberPostcode(postcode: string) {
  try {
    window.localStorage.setItem(POSTCODE_KEY, postcode.trim());
  } catch {
    // Storage unavailable — this page view still works.
  }
  for (const l of listeners) l();
}

/** The postcode last entered on this device. "" until one is. */
export function useDeliveryPostcode(): string {
  return useSyncExternalStore(subscribe, readPostcode, () => "");
}

/* ------------------------------------------------------------------ */
/* The rate                                                            */
/* ------------------------------------------------------------------ */

export type RateState =
  | { status: "idle"; rate: null }
  | { status: "loading"; rate: null }
  /** A postcode we run a truck to. */
  | { status: "ready"; rate: DeliveryRate }
  /** A real postcode, but not on any run yet. */
  | { status: "not-delivered"; rate: null; postcode: string }
  /** The lookup itself failed — a rate may well exist. */
  | { status: "error"; rate: null; message: string };

const NZ_POSTCODE = /^\d{4}$/;

/**
 * The freight rate for a postcode. Only asks once the postcode looks like
 * one, so a half-typed number doesn't send four requests.
 */
export function useDeliveryRate(postcode: string): RateState {
  // What came back, and which postcode it answers. Keeping the two together
  // means "still looking" is derived rather than a flag set from the effect
  // body — the answer either matches what is typed, or it doesn't yet.
  const [answer, setAnswer] = useState<{ postcode: string; state: RateState } | null>(
    null
  );
  const normalised = postcode.trim();
  const valid = NZ_POSTCODE.test(normalised);

  const lookup = useCallback(async (code: string, signal: AbortSignal) => {
    const settle = (state: RateState) => {
      if (!signal.aborted) setAnswer({ postcode: code, state });
    };
    try {
      settle({ status: "ready", rate: await fetchDeliveryRate(code, signal) });
    } catch (err) {
      if (signal.aborted) return;
      if (err instanceof NotDeliverableError) {
        settle({ status: "not-delivered", rate: null, postcode: code });
      } else {
        console.error("[delivery] rate lookup failed:", err);
        settle({
          status: "error",
          rate: null,
          message: "Couldn't work out delivery just now.",
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!valid) return;
    const controller = new AbortController();
    void lookup(normalised, controller.signal);
    return () => controller.abort();
  }, [normalised, valid, lookup]);

  if (!valid) return { status: "idle", rate: null };
  if (answer?.postcode === normalised) return answer.state;
  return { status: "loading", rate: null };
}
