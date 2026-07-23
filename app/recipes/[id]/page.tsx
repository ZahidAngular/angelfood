import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { recipeApi, resolveImageUrl, type Recipe } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import { RevealImage } from "@/components/RevealImage";
import { PublicRecipeCard } from "@/components/PublicRecipeCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = await recipeApi.getById(Number(id)).catch(() => null);
  if (!recipe) return {};
  return {
    title: `${recipe.title} — Angel Food Recipes`,
    description: recipe.description ?? undefined,
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const recipe = await recipeApi.getById(Number(id)).catch(() => null);
  if (!recipe) notFound();

  const steps = recipe.instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const allRecipes = await recipeApi.getAll().catch(() => [] as Recipe[]);
  const related = allRecipes.filter((r) => r.id !== recipe.id).slice(0, 4);

  const image = resolveImageUrl(recipe.imageUrl);

  return (
    <main>
      <header className="relative overflow-hidden bg-cream pb-4 pt-40 sm:pt-48">
        <div className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[120px]" />
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-green"
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
