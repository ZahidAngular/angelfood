"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "./Breadcrumbs";
import type { Crumb } from "@/lib/schema";

export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  media,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Trail shown above the eyebrow, for pages that sit under another one. */
  breadcrumbs?: Crumb[];
  /**
   * Artwork for the space beside the copy. Shown from the large breakpoint up,
   * where there is room for it; narrower screens keep the copy full width.
   */
  media?: ReactNode;
}) {
  const words = title.split(" ");

  // Page titles run from a single word ("Store.") to a full sentence. One size
  // cannot serve both: the scale that gives a short title presence makes a
  // sentence-length one fill the screen before the page has said anything. Past
  // roughly forty characters a title stops fitting on two lines at the large
  // size, so from there it steps down — big enough to still read as the page's
  // headline, small enough to stay in proportion with the copy beneath it.
  const isLongTitle = title.length > 44;
  const titleScale = isLongTitle
    ? "max-w-4xl text-[clamp(2.2rem,5vw,4.25rem)] leading-[1.02] tracking-[-0.025em]"
    : "max-w-5xl text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.9] tracking-[-0.03em]";

  return (
    <header className="relative overflow-hidden bg-cream pb-12 pt-44 sm:pb-16 sm:pt-52">
      <div className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px]" />
      <div
        className={`mx-auto max-w-7xl px-5 sm:px-8 ${
          media
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-14"
            : ""
        }`}
      >
        <div>
        {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} className="mb-7" />}

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm font-semibold uppercase tracking-[0.22em] text-coral"
        >
          ✦ {eyebrow}
        </motion.p>

        {/* text-wrap: balance evens the lines out, so a long title never ends
            on a single orphaned word. */}
        <h1
          className={`mt-5 font-display font-extrabold text-ink [text-wrap:balance] ${titleScale}`}
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.85,
                  delay: 0.35 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block pr-[0.25em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className={`mt-7 text-lg leading-relaxed text-ink-soft sm:text-xl ${
              isLongTitle ? "max-w-2xl" : "max-w-xl"
            }`}
          >
            {intro}
          </motion.p>
        )}
        </div>

        {media && <div className="mt-12 hidden lg:mt-0 lg:block">{media}</div>}
      </div>
    </header>
  );
}
