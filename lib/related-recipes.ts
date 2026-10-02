import type { Recipe } from "./api";

/**
 * The recipes that follow this one in the list, wrapping round at the end.
 * Every recipe page shows the same four cards it always did, but because the
 * four differ page to page, every recipe ends up linked from other recipes
 * instead of all of them pointing at the same first four.
 */
export function relatedRecipes(all: Recipe[], current: Recipe, count = 4): Recipe[] {
  const index = all.findIndex((r) => r.id === current.id);
  if (index === -1) return all.filter((r) => r.id !== current.id).slice(0, count);

  const related: Recipe[] = [];
  for (let step = 1; step < all.length && related.length < count; step++) {
    related.push(all[(index + step) % all.length]);
  }
  return related;
}
