"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS, MEATS, MEALS } from "@/lib/site";
import { Reveal } from "./Reveal";

type Category = {
  name: string;
  count: string;
  href: string;
  images: string[];
};

// Counts and artwork come straight from the product data, so this stays in step
// with the range instead of drifting whenever a product is added or renamed.
const CATEGORIES: Category[] = [
  {
    name: "Cheeses",
    count: `${PRODUCTS.length} dairy-free heroes`,
    href: "/products#cheeses",
    images: [
      "/images/grated.webp",
      "/images/cream-cheese.webp",
      "/images/sour-cream.webp",
      "/images/feta.webp",
    ],
  },
  {
    name: "Meats",
    count: `${MEATS.length} plant-based classics`,
    href: "/products#meats",
    images: MEATS.slice(0, 4).map((p) => p.image),
  },
  {
    name: "Meals",
    count: `${MEALS.length} ready-to-go dinners`,
    href: "/products#meals",
    images: [
      "/images/lasagna.webp",
      "/images/korma.webp",
      "/images/tofu-greens.webp",
      "/images/butter-curry.webp",
    ],
  },
];

const COLLAGE_HEIGHT = 320; // px — fixed so every card matches regardless of image count

export function CategoryShowcase() {
  return (
    <section className="relative overflow-hidden bg-cream-deep py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-gold/25 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-green-bright/20 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                ✦ Shop by category
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
                Find your favourite.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-ink-soft">
              Seven dairy-free heroes, real meat alternatives and ready-to-go
              meals — pick a lane and start browsing.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {CATEGORIES.map((cat, i) => {
            const cols = cat.images.length > 4 ? 3 : 2;
            const rows = Math.ceil(cat.images.length / cols);
            const lastRowCount = cat.images.length - (rows - 1) * cols;
            const centerLast = lastRowCount === 1 && cols > 1;

            return (
              <Reveal key={cat.name} delay={0.1 + i * 0.08}>
                <Link
                  href={cat.href}
                  className="group flex h-full flex-col"
                  data-cursor="Explore"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-paper p-5 shadow-[0_2px_8px_rgba(20,20,20,0.04),0_24px_48px_-28px_rgba(20,20,20,0.16)] transition-shadow duration-500 group-hover:shadow-[0_2px_8px_rgba(20,20,20,0.05),0_32px_56px_-24px_rgba(20,20,20,0.2)]"
                  >
                    <div
                      className="grid gap-2"
                      style={{
                        height: COLLAGE_HEIGHT,
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                      }}
                    >
                      {cat.images.map((src, j) => (
                        <div
                          key={j}
                          className="relative overflow-hidden rounded-xl border border-line/60 bg-cream"
                          style={
                            centerLast && j === cat.images.length - 1
                              ? { gridColumnStart: 2 }
                              : undefined
                          }
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 22vw, 45vw"
                            className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-1 items-end justify-between">
                      <div>
                        <span className="font-display text-2xl font-bold tracking-tight text-ink">
                          {cat.name}
                        </span>
                        <p className="mt-1 text-sm text-ink-soft">{cat.count}</p>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-deep text-ink-soft transition-colors duration-300 group-hover:bg-green group-hover:text-cream">
                        <ArrowUpRight
                          size={20}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
