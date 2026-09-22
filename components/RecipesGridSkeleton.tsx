/** Placeholder cards shown while the recipe list is fetched in the browser —
 * shaped like PublicRecipeCard so the page doesn't jump when data arrives. */
export function RecipesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-cream-deep"
        >
          <div className="absolute inset-0 animate-pulse bg-cream-deep/60" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
            <div className="h-5 w-3/5 animate-pulse rounded bg-line/70" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-line/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
