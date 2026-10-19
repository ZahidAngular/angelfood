"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { DELIVERY, PRE_SALE, formatPriceShort } from "@/lib/pricing";
import { Magnetic } from "./Magnetic";

/**
 * The hero while the pre-sale is on.
 *
 * Its own component rather than another branch inside the standing hero,
 * which had grown seventeen of them. The two want different things: the
 * standing hero is three words and a picture, and can let artwork drift
 * anywhere across the window. This one has a headline, an offer, a
 * paragraph, two dates and two buttons, and needs the artwork pinned where
 * it cannot collide with any of them.
 *
 * So the meals live inside a panel. Earlier versions scattered them across
 * the background as free-floating cut-outs, positioned as percentages of
 * the window — which meant the group that sat together on a laptop was
 * strewn across the edges of a wide monitor with holes between it. Inside
 * a panel the arrangement is a percentage of the panel, so it holds its
 * shape at every width, and the plates have something to sit on instead of
 * hanging in empty cream.
 */

/** Four meals, composed. Positions are percentages of the panel. */
const PLATES = [
  // Three, not six. A panel this size holds three plates at an appetising
  // size or six at thumbnail size, and the point of the picture is the
  // food. They sit as a triangle — one across the top, two below — with
  // just enough overlap at the edges to read as a stack rather than as
  // three things parked next to each other.
  {
    src: "/images/meals/butter-curry-v2.webp",
    alt: "Creamy Butter Curry",
    className: "left-[17%] top-[3%] w-[64%]",
    delay: 0.35,
    drift: 5.5,
  },
  {
    src: "/images/meals/thai-green-curry-v2.webp",
    alt: "Thai Green Tofu Curry",
    className: "left-[3%] bottom-[14%] w-[42%]",
    delay: 0.5,
    drift: 7,
  },
  {
    src: "/images/meals/vege-korma-v2.webp",
    alt: "Creamy Vege Korma",
    className: "right-[3%] bottom-[14%] w-[42%]",
    delay: 0.62,
    drift: 6.2,
  },
];

export function PreSaleHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cream pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pb-24"
    >
      {/* Warm light from the top right, cool from the bottom left: the same
          two blobs the standing hero uses, so this reads as the same site. */}
      <div className="pointer-events-none absolute -right-40 -top-32 h-[38rem] w-[38rem] rounded-full bg-gold/25 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-green-bright/15 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
          {/* ---------------- the words ---------------- */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-green/15 bg-paper/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-green backdrop-blur"
            >
              <Truck size={14} className="shrink-0" />
              Pre-sale · order by {PRE_SALE.orderByShort}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-6 font-display text-[clamp(2.05rem,3.9vw,3.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink"
            >
              We&apos;re open<span className="text-coral">!</span>
              <br />
              Your freezer just got
              <br />
              <span className="text-green">a little more heavenly.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              Angel Food&apos;s online store is now open for pre-sales. Your
              favourite plant-based meals, ready for the freezer and ready for
              the days you have nothing left to give the kitchen.
            </motion.p>

            {/* The offer. Said once, in one place — it used to appear here,
                in the badge and in the panel, which is most of what made
                this section feel cluttered. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8 overflow-hidden rounded-3xl border border-green/15 bg-paper/75 backdrop-blur-sm"
            >
              <p className="bg-green px-6 py-4 font-display text-[clamp(1rem,1.7vw,1.3rem)] font-extrabold uppercase leading-tight tracking-[0.03em] text-cream">
                First 200 pre-sales get free delivery
                <span className="whitespace-nowrap">
                  {" "}
                  — save {formatPriceShort(DELIVERY.northIsland)}
                </span>
              </p>
              <dl className="flex flex-wrap gap-x-10 gap-y-4 px-6 py-5">
                <div>
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-green">
                    Order by
                  </dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {PRE_SALE.orderBy}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-green">
                    Delivered
                  </dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {PRE_SALE.deliveredBy}
                  </dd>
                </div>
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.5}>
                <Link
                  href="/buy-now"
                  data-cursor="Let's cook"
                  className="group inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 text-base font-semibold text-cream transition-colors hover:bg-ink"
                >
                  Build your box of {PRE_SALE.bundle}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
              <Magnetic strength={0.5}>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-green/30 px-8 py-4 text-base font-semibold text-green transition-colors hover:border-green"
                >
                  See the range
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          {/* ---------------- the meals ---------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[460px] lg:max-w-none"
          >
            <div className="relative aspect-[5/6] w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gold/40 via-paper to-green/15 ring-1 ring-green/10">
              {/* A pool of light under the biggest plate, so the group has a
                  centre to sit in rather than floating on a flat wash. */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_46%_at_52%_32%,rgba(255,255,255,0.8),transparent_70%)]" />

              {PLATES.map((plate) => (
                <motion.div
                  key={plate.src}
                  initial={{ opacity: 0, y: 24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: plate.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`absolute ${plate.className}`}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: plate.drift,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="drop-shadow-[0_24px_34px_rgba(20,66,44,0.28)]"
                  >
                    <Image
                      src={plate.src}
                      alt={plate.alt}
                      width={600}
                      height={600}
                      priority
                      className="h-auto w-full"
                    />
                  </motion.div>
                </motion.div>
              ))}

              {/* What the panel is a picture of. Without it the plates are
                  decoration; with it they are the thing being sold. */}
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-ink/80 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-sm font-semibold text-cream">
                  Nine meals to choose from — mix and match your box of{" "}
                  {PRE_SALE.bundle}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
