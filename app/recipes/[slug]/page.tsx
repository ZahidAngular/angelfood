import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  recipeApi,
  resolveImageUrl,
  recipeSlug,
  recipeMatchesSlug,
  slugifyTitle,
  type Recipe,
} from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { RecipeLiveDetail } from "@/components/RecipeLiveDetail";

async function findRecipeBySlug(slug: string): Promise<Recipe | null> {
  const allRecipes = await recipeApi.getAll().catch(() => [] as Recipe[]);
  return allRecipes.find((r) => recipeMatchesSlug(r.title, slug)) ?? null;
}

// Static export has no server to render unlisted params on demand, so every
// address a recipe can be reached by — the generated slug and, where it
// differs, the old-site slug — needs its own pre-rendered page.
export async function generateStaticParams() {
  const recipes = await recipeApi.getAll().catch(() => [] as Recipe[]);
  const slugs = new Set<string>();
  for (const r of recipes) {
    slugs.add(slugifyTitle(r.title));
    slugs.add(recipeSlug(r.title));
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await findRecipeBySlug(slug);
  if (!recipe) return {};

  const title = `${recipe.title} | Angel Food`;
  const description =
    recipe.description || `${recipe.title} — a plant-based recipe from Angel Food.`;
  const image = resolveImageUrl(recipe.imageUrl) || `${SITE_URL}/images/hero.webp`;
  // Always the canonical slug, never the one that was requested — a recipe can
  // be reached by two addresses, and this is what points search engines at the
  // one that carries the rankings.
  const url = `/recipes/${recipeSlug(recipe.title)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: image, alt: recipe.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allRecipes = await recipeApi.getAll().catch(() => [] as Recipe[]);
  const recipe = allRecipes.find((r) => recipeMatchesSlug(r.title, slug)) ?? null;
  if (!recipe) notFound();

  const related = allRecipes.filter((r) => r.id !== recipe.id).slice(0, 4);

  const image = resolveImageUrl(recipe.imageUrl);

  const steps = recipe.instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  // Structured data so recipes can appear as rich results in search.
  // Rendered as an invisible script tag — nothing changes on screen.
  // Google's Recipe rich-result validator treats `image` as required, so a
  // recipe with no photo falls back to the site's default image rather than
  // dropping the field (which fails validation outright).
  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description || `${recipe.title} — a plant-based recipe from Angel Food.`,
    image: [image || `${SITE_URL}/images/hero.webp`],
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.webp`,
      },
    },
    datePublished: recipe.createdAt || undefined,
    dateModified: recipe.updatedAt || undefined,
    recipeIngredient: recipe.ingredientGroups.flatMap((g) => g.items),
    recipeInstructions: steps.map((step) => ({
      "@type": "HowToStep",
      // Drop any "1." / "2." prefix — the schema already conveys ordering.
      text: step.replace(/^\d+[.)]\s*/, ""),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />
      <RecipeLiveDetail slug={slug} initialRecipe={recipe} initialRelated={related} />
    </>
  );
}
