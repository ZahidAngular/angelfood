"use client";

import { useEffect, useState } from "react";
import { recipeApi, recipeMatchesSlug, type Recipe } from "@/lib/api";
import { RecipeDetailView } from "./RecipeDetailView";

/** Renders instantly from the build-time snapshot, then quietly refetches the
 * live database in the background so edits made after the last deploy still
 * show up without anyone having to rebuild the site. */
export function RecipeLiveDetail({
  slug,
  initialRecipe,
  initialRelated,
}: {
  slug: string;
  initialRecipe: Recipe;
  initialRelated: Recipe[];
}) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [related, setRelated] = useState(initialRelated);

  useEffect(() => {
    let cancelled = false;
    recipeApi
      .getAll()
      .then((all) => {
        if (cancelled) return;
        const fresh = all.find((r) => recipeMatchesSlug(r.title, slug));
        if (fresh) {
          setRecipe(fresh);
          setRelated(all.filter((r) => r.id !== fresh.id).slice(0, 4));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return <RecipeDetailView recipe={recipe} related={related} />;
}
