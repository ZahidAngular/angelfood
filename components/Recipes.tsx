"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RECIPES, type Recipe } from "@/lib/site";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";

export function RecipeCard({ recipe: r, index }: { recipe: Recipe; index: number }) {
  return (
    <Reveal delay={(index % 4) * 0.07}>
      <Link href={`/recipes/${r.slug}`} className="group block" data-cursor="Cook this">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-cream-deep"
        >
          <Image
            src={r.image}
            alt={r.title}
            fill
            unoptimized
            sizes="(max-width:1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green">
            {r.tag}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-cream">
              {r.title}
            </h3>
            <p className="mt-1 max-h-0 overflow-hidden text-sm text-cream/85 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
              {r.blurb}
            </p>
          </div>
        </motion.div>
      </Link>
    </Reveal>
  );
}

/** Home teaser — first 8 recipes with a heading + link to the full page. */
export function Recipes() {
  return (
    <section id="recipes" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Parallax amount={40}>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                ✦ From our kitchen
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink">
                Delicious plant-based recipes for every occasion.
              </h2>
            </Reveal>
          </Parallax>
          <Reveal delay={0.1}>
            <Link
              href="/recipes"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-green/30 px-6 py-3.5 font-semibold text-green transition-colors hover:bg-paper"
            >
              All recipes <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {RECIPES.slice(0, 8).map((r, i) => (
            <RecipeCard key={r.slug} recipe={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Full grid of every recipe — used on the /recipes page. */
export function RecipesGrid() {
  return (
    <section className="bg-cream pb-24 pt-4 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {RECIPES.map((r, i) => (
            <RecipeCard key={r.slug} recipe={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
