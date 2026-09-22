"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  recipeApi,
  recipeMatchesSlug,
  resolveImageUrl,
  recipeSlug,
  type Recipe,
} from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { RecipeDetailView } from "@/components/RecipeDetailView";

/**
 * Firebase Hosting rewrites any /recipes/* URL with no matching static file
 * here (see firebase.json) — i.e. a recipe added to the dashboard after the
 * last deploy. The browser still shows the real URL; this reads the slug
 * straight from window.location and fetches it live, so a brand-new recipe
 * works immediately without anyone rebuilding the site.
 */
export default function RecipeFallbackPage() {
  const [status, setStatus] = useState<"loading" | "found" | "missing">("loading");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [related, setRelated] = useState<Recipe[]>([]);

  useEffect(() => {
    const slug = decodeURIComponent(
      window.location.pathname.replace(/^\/recipes\/?/, "").replace(/\/$/, "")
    );
    if (!slug) {
      setStatus("missing");
      return;
    }

    recipeApi
      .getAll()
      .then((all) => {
        const match = all.find((r) => recipeMatchesSlug(r.title, slug));
        if (!match) {
          setStatus("missing");
          return;
        }

        setRecipe(match);
        setRelated(all.filter((r) => r.id !== match.id).slice(0, 4));
        setStatus("found");

        // Best-effort tags for a page the build never knew about — a real
        // static rebuild still gets the fully server-rendered version.
        document.title = `${match.title} | Angel Food`;

        const canonicalHref = `${SITE_URL}/recipes/${recipeSlug(match.title)}`;
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement("link");
          canonical.setAttribute("rel", "canonical");
          document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", canonicalHref);

        const description =
          match.description || `${match.title} — a plant-based recipe from ${SITE_NAME}.`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description);

        const image = resolveImageUrl(match.imageUrl) || `${SITE_URL}/images/hero.webp`;
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: match.title,
          description,
          image: [image],
          author: { "@type": "Organization", name: SITE_NAME },
          recipeIngredient: match.ingredientGroups.flatMap((g) => g.items),
        });
        document.head.appendChild(script);
      })
      .catch(() => setStatus("missing"));
  }, []);

  if (status === "loading") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-cream pt-32">
        <p className="text-ink-soft">Loading recipe…</p>
      </main>
    );
  }

  if (status === "missing" || !recipe) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream pt-32 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Recipe not found</h1>
        <p className="text-ink-soft">This recipe may have moved or no longer exists.</p>
        <Link
          href="/recipes"
          className="mt-2 rounded-full bg-green px-6 py-3 font-semibold text-cream"
        >
          Browse all recipes
        </Link>
      </main>
    );
  }

  return <RecipeDetailView recipe={recipe} related={related} />;
}
