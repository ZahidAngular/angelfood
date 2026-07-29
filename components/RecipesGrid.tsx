"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { PublicRecipeCard } from "./PublicRecipeCard";
import type { Recipe } from "@/lib/api";

const PAGE_SIZE = 12;

export function RecipesGrid({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q)
    );
  }, [recipes, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRecipes = filtered.slice(start, start + PAGE_SIZE);

  function goToPage(p: number) {
    if (p < 1 || p > totalPages || p === safePage) return;
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div>
      <div
        ref={topRef}
        className="mb-10 flex scroll-mt-28 flex-col gap-5 border-b border-line pb-8 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
          {query
            ? `${filtered.length} of ${recipes.length} recipes`
            : `${recipes.length} recipes`}
        </p>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/60"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search recipes…"
            className="w-full rounded-full border border-line bg-paper py-2.5 pl-11 pr-10 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-green"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft/60 transition-colors hover:bg-cream-deep hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="font-display text-xl font-bold text-ink">No recipes found</p>
          <p className="text-ink-soft">
            Nothing matches “{query}” — try a different search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {pageRecipes.map((r, i) => (
            <PublicRecipeCard key={r.id} recipe={r} index={i} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Recipes pagination"
          className="mt-14 flex items-center justify-center gap-2 sm:gap-3"
        >
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-all duration-300 hover:border-green hover:bg-green hover:text-cream disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === safePage ? "page" : undefined}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  p === safePage
                    ? "bg-green text-cream shadow-[0_8px_20px_-8px_rgba(20,20,20,0.35)]"
                    : "text-ink-soft hover:bg-cream-deep"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-all duration-300 hover:border-green hover:bg-green hover:text-cream disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}
    </div>
  );
}
