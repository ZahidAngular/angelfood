"use client";

import { useSyncExternalStore } from "react";

/**
 * False while the server renders and through hydration, true afterwards.
 *
 * For anything a page can only know in the browser — the query string, what is
 * in localStorage. Reading those during the first render makes the server and
 * the client draw different things, which React reports as a hydration
 * mismatch and then throws the server's markup away. Gating on this instead
 * lets both draw the same placeholder, and the real answer appear once there
 * is a browser to ask.
 */
const noSubscribe = () => () => {};

export const useHydrated = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  );
