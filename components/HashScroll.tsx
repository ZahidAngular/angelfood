"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Lenis takes over scrolling and doesn't know about `#hash` anchors, so
 * navigating here from another page (e.g. /products#meats) would otherwise
 * land at the top. This scrolls to the hash target once Lenis is ready and
 * the page has laid out.
 */
export function HashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: -110 });
    }, 350);

    return () => clearTimeout(t);
  }, [lenis]);

  return null;
}
