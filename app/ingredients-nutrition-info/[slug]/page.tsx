import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NUTRITION_INFO } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { NutritionTable } from "@/components/NutritionTable";

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

  const more = NUTRITION_INFO.filter(
    (n) => n.category === entry.category && n.slug !== entry.slug
  ).slice(0, 4);

  return (
    <main>
      <header className="relative overflow-hidden bg-cream pb-4 pt-40 sm:pt-48">
        <div className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[120px]" />
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/ingredients-nutrition-info"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-green"
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
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
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

          <Reveal delay={0.15}>
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold tracking-tight text-ink">
                Nutrition information
              </h2>
              <NutritionTable facts={entry.nutrition} />
            </div>
          </Reveal>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-cream-deep py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                More {entry.category.toLowerCase()}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {more.map((n, i) => (
                <Reveal key={n.slug} delay={i * 0.05}>
                  <Link
                    href={`/ingredients-nutrition-info/${n.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-line bg-paper px-6 py-5 transition-colors hover:border-green"
                  >
                    <span className="font-display text-lg font-bold tracking-tight text-ink">
                      {n.product}
                    </span>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-green"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
