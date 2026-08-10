import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { NUTRITION_INFO, getProductMeta } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { NutritionTable } from "@/components/NutritionTable";
import { NutritionCard } from "@/components/NutritionCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { productSchema } from "@/lib/schema";

export function generateStaticParams() {
  return NUTRITION_INFO.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = NUTRITION_INFO.find((n) => n.slug === slug);
  if (!entry) return {};

  const title = `${entry.product} — Ingredients & Nutrition | Angel Food`;
  const description = `Full ingredients list and nutrition panel for Angel Food ${entry.product}.`;
  const url = `/ingredients-nutrition-info/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description },
  };
}

export default async function NutritionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = NUTRITION_INFO.find((n) => n.slug === slug);
  if (!entry) notFound();

  const meta = getProductMeta(entry.product);

  const more = NUTRITION_INFO.filter(
    (n) => n.category === entry.category && n.slug !== entry.slug
  );

  return (
    <main>
      {meta && (
        <JsonLd
          data={productSchema({
            name: entry.product,
            description: meta.blurb,
            image: meta.image,
            url: `/ingredients-nutrition-info/${entry.slug}`,
            category: entry.category,
          })}
        />
      )}

      <header className="relative overflow-hidden bg-cream pb-4 pt-40 sm:pt-48">
        <div className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[120px]" />
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Breadcrumbs
              crumbs={[
                { name: "Home", path: "/" },
                {
                  name: "Ingredients & Nutrition",
                  path: "/ingredients-nutrition-info",
                },
                {
                  name: entry.product,
                  path: `/ingredients-nutrition-info/${entry.slug}`,
                },
              ]}
            />
            <Link
              href="/ingredients-nutrition-info"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-green"
            >
              <ArrowLeft size={16} /> All ingredients &amp; nutrition
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-coral">
              ✦ {entry.category}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink">
              {entry.product}
            </h1>
          </Reveal>
        </div>
      </header>

      <section className="bg-cream pb-24 pt-10 sm:pb-32">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            {meta && (
              <Reveal>
                <div className="lg:sticky lg:top-32">
                  {/* The frame follows the artwork so the image fills it with
                      no padding and no empty background: meal sleeves are 4:3,
                      meat cartons and cheese cut-outs are square. The meal
                      frame used to carry a heavy corner arc to mask the white
                      in the sleeve corners — those corners are squared off in
                      the source files now, so it takes the same radius as the
                      rest. */}
                  <div
                    className={`relative w-full overflow-hidden border border-line bg-paper ${
                      entry.category === "Meals"
                        ? "aspect-[4/3] rounded-3xl"
                        : "aspect-square rounded-3xl"
                    }`}
                  >
                    <Image
                      src={meta.image}
                      alt={`Angel Food ${entry.product}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className={
                        entry.category === "Cheeses"
                          ? "object-contain p-6"
                          : "object-cover"
                      }
                    />
                  </div>
                  <p className="mt-5 text-ink-soft">{meta.blurb}</p>
                </div>
              </Reveal>
            )}

            <div>
              <Reveal delay={0.1}>
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                    Ingredients
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {entry.ingredients}
                  </p>
                </div>
              </Reveal>

              {entry.allergens && (
                <Reveal delay={0.12}>
                  <div className="mt-8">
                    <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                      Allergens
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {entry.allergens}
                    </p>
                  </div>
                </Reveal>
              )}

              {entry.storage && (
                <Reveal delay={0.13}>
                  <div className="mt-8">
                    <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                      Storage conditions
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {entry.storage}
                    </p>
                  </div>
                </Reveal>
              )}

              {entry.cookingInstructions && (
                <Reveal delay={0.14}>
                  <div className="mt-8">
                    <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                      Cooking instructions
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {entry.cookingInstructions}
                    </p>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.15}>
                <div className="mt-8">
                  <h2 className="mb-3 font-display text-xl font-bold tracking-tight text-ink">
                    Nutrition information
                  </h2>
                  <NutritionTable facts={entry.nutrition} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="border-t border-line bg-cream-deep py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
                    Explore the range
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    More {entry.category.toLowerCase()}
                  </h2>
                  <p className="mt-2 max-w-lg text-ink-soft">
                    Full ingredients list and nutrition panel for every product
                    in the range.
                  </p>
                </div>
                <Link
                  href="/ingredients-nutrition-info"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.14em] text-green"
                >
                  View all
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {more.map((n, i) => (
                <Reveal key={n.slug} delay={i * 0.05}>
                  <NutritionCard entry={n} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
