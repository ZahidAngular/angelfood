import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  recipeApi,
  resolveImageUrl,
  recipeSlug,
  recipeMatchesSlug,
  slugifyTitle,
  type Recipe,
} from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { RevealImage } from "@/components/RevealImage";
import { PublicRecipeCard } from "@/components/PublicRecipeCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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

  const title = `${recipe.title} — Angel Food Recipes`;
  const description = recipe.description ?? undefined;
  const image = resolveImageUrl(recipe.imageUrl);
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
      images: image ? [{ url: image, alt: recipe.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
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

  const steps = recipe.instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const related = allRecipes.filter((r) => r.id !== recipe.id).slice(0, 4);

  const image = resolveImageUrl(recipe.imageUrl);

  // Structured data so recipes can appear as rich results in search.
  // Rendered as an invisible script tag — nothing changes on screen.
  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description || undefined,
    image: image ? [image] : undefined,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />
      <header className="relative overflow-hidden bg-cream pb-4 pt-40 sm:pt-48">
        <div className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[120px]" />
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Breadcrumbs
              crumbs={[
                { name: "Home", path: "/" },
                { name: "Recipes", path: "/recipes" },
                {
                  name: recipe.title,
                  path: `/recipes/${recipeSlug(recipe.title)}`,
                },
              ]}
            />
            <Link
              href="/recipes"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-green"
            >
              <ArrowLeft size={16} /> All recipes
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink">
              {recipe.title}
            </h1>
          </Reveal>

          {recipe.description && (
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                {recipe.description}
              </p>
            </Reveal>
          )}
        </div>
      </header>

      {image && (
        <section className="bg-cream pb-6 pt-8 sm:pb-10">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <RevealImage
              src={image}
              alt={recipe.title}
              className="aspect-[16/9]"
              rounded="rounded-[2rem]"
              priority
              unoptimized
            />
          </div>
        </section>
      )}

      <section className="bg-cream pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Ingredients */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-paper p-7 sm:p-8 lg:sticky lg:top-32">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Ingredients
              </h2>
              <div className="mt-5 space-y-6">
                {recipe.ingredientGroups.map((group, gi) => (
                  <div key={gi}>
                    {group.heading && (
                      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-coral">
                        {group.heading}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {group.items.map((item, ii) => (
                        <li
                          key={ii}
                          className="flex items-start gap-3 text-ink-soft"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Method */}
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Method
              </h2>
            </Reveal>
            <ol className="mt-5 space-y-6">
              {steps.map((step, i) => (
                <Reveal key={i} delay={Math.min(i * 0.05, 0.4)}>
                  <li className="flex gap-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green font-display text-sm font-bold text-cream">
                      {i + 1}
                    </span>
                    <p className="pt-1 leading-relaxed text-ink-soft">{step}</p>
                  </li>
                </Reveal>
              ))}
            </ol>

            {recipe.notes && (
              <Reveal delay={0.1}>
                <blockquote className="mt-9 whitespace-pre-line rounded-2xl border-l-2 border-gold bg-cream-deep p-5 text-ink-soft">
                  <span className="font-bold text-ink">Notes: </span>
                  {recipe.notes}
                </blockquote>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Related recipes */}
      {related.length > 0 && (
        <section className="bg-cream-deep py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                More from our kitchen
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((r, i) => (
                <PublicRecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
