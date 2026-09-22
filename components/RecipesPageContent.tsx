"use client";

import { useEffect, useState } from "react";
import { recipeApi, recipeSlug, type Recipe } from "@/lib/api";
import { RecipesGrid } from "./RecipesGrid";
import { RecipesGridSkeleton } from "./RecipesGridSkeleton";
import { JsonLd } from "./JsonLd";
import { itemListSchema } from "@/lib/schema";

/** Fetches the full recipe list in the browser so new and edited recipes
 * show up without anyone rebuilding the static site. */
export function RecipesPageContent() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  useEffect(() => {
    let active = true;
    recipeApi
      .getAll()
      .then((data) => {
        if (active) setRecipes(data);
      })
      .catch(() => {
        if (active) setRecipes([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {recipes && recipes.length > 0 && (
        <JsonLd
          data={itemListSchema({
            name: "Plant-based recipes",
            url: "/recipes",
            items: recipes.map((recipe) => ({
              name: recipe.title,
              path: `/recipes/${recipeSlug(recipe.title)}`,
            })),
          })}
        />
      )}
      <section className="bg-cream pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {recipes === null ? (
            <RecipesGridSkeleton />
          ) : recipes.length === 0 ? (
            <p className="py-16 text-center text-ink-soft">
              No recipes yet — check back soon!
            </p>
          ) : (
            <RecipesGrid recipes={recipes} />
          )}
        </div>
      </section>
    </>
  );
}
