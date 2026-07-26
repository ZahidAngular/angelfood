"use client";

import { useLenis } from "lenis/react";

const CATEGORIES = [
  { label: "Cheeses", href: "#cheeses" },
  { label: "Meats", href: "#meats" },
  { label: "Meals", href: "#meals" },
];

export function ProductCategoryNav() {
  const lenis = useLenis();

  return (
    <nav
      aria-label="Product categories"
      className="sticky top-24 z-30 flex justify-center gap-3 py-4"
    >
      {CATEGORIES.map((c) => (
        <a
          key={c.href}
          href={c.href}
          onClick={(e) => {
            const el = document.getElementById(c.href.slice(1));
            if (el && lenis) {
              e.preventDefault();
              lenis.scrollTo(el, { offset: -110 });
              history.pushState(null, "", c.href);
            }
          }}
          className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
        >
          {c.label}
        </a>
      ))}
    </nav>
  );
}
