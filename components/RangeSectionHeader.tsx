"use client";

import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";

/**
 * Shared masthead for the product range sections, so Cheeses, Meats and Meals
 * all open the same way: eyebrow with the item count, display headline, and a
 * supporting line pulled to the right on wide screens.
 */
export function RangeSectionHeader({
  eyebrow,
  title,
  intro,
  count,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  count?: number;
}) {
  return (
    <div className="mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end sm:mb-14">
      <Parallax amount={40}>
        <Reveal>
          <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-coral">
            ✦ {eyebrow}
            {count !== undefined && (
              <span className="rounded-full border border-coral/25 px-2 py-0.5 text-[0.7rem] tracking-normal">
                {count}
              </span>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
            {title}
          </h2>
        </Reveal>
      </Parallax>
      <Reveal delay={0.1}>
        <p className="max-w-sm text-ink-soft md:text-right">{intro}</p>
      </Reveal>
    </div>
  );
}
