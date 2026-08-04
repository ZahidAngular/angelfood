"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getNutritionSlug, type Product } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * Retail product card shared by the Meats and Meals sections, so the whole
 * range reads as one system: a full-bleed pack shot, the product name, a short
 * description, and a single call to action pinned to the bottom edge.
 *
 * The image sits edge to edge with no padding: `aspect` is set per section to
 * match the source artwork (pack shots are square, meal sleeves are 4:3) so
 * `object-cover` fills the frame without cropping or letterboxing. Nothing is
 * overlaid on the artwork — the packs already carry their own straplines and
 * roundels, and a badge on top of them just competes.
 *
 * Meal sleeves are photographed as rounded rectangles, which leaves white in
 * the four corners of an otherwise full-bleed shot. Cropping it away is not an
 * option — the corner radius is wider than the margin around the logo and the
 * strapline — so `4/3` rounds the frame along the same arc instead. Nothing is
 * cut and no white shows.
 */
export function PackCard({
  product,
  index,
  aspect = "square",
}: {
  product: Product;
  index: number;
  aspect?: "square" | "4/3";
}) {
  const nutritionSlug = getNutritionSlug(product.name);

  const inner = (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-paper transition-shadow duration-300 hover:shadow-[0_28px_60px_-32px_rgba(20,66,44,0.5)]"
      data-cursor={nutritionSlug ? "Ingredients & nutrition" : "Taste it"}
    >
      <div
        className={`relative overflow-hidden bg-cream ${
          aspect === "square"
            ? "aspect-square"
            : // 14%/18% traces the sleeve's own corner arc (measured at ~214px
              // on a 1600x1232 shot), so the white outside it is clipped away.
              "aspect-[4/3] rounded-[14%/18%]"
        }`}
      >
        <Image
          src={product.image}
          alt={`Angel Food ${product.name} pack`}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Name and description only — the pack artwork already carries the
          strapline, weight, health star and claims, so repeating them below
          just crowds the card. */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-green sm:text-[1.4rem]">
          {product.name}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {product.blurb}
        </p>

        {/* mt-auto on the wrapper keeps the CTA on the card's bottom edge no
            matter how much copy sits above it, so a row of cards lines up. */}
        <div className="mt-auto pt-6">
          <span className="flex items-center gap-1.5 border-t border-line pt-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green">
            {nutritionSlug ? "Ingredients & nutrition" : "See the range"}
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );

  return (
    <Reveal delay={(index % 4) * 0.07} className="h-full">
      <Link
        href={
          nutritionSlug
            ? `/ingredients-nutrition-info/${nutritionSlug}`
            : "/ingredients-nutrition-info"
        }
        target={nutritionSlug ? "_blank" : undefined}
        rel={nutritionSlug ? "noopener noreferrer" : undefined}
        className="block h-full"
      >
        {inner}
      </Link>
    </Reveal>
  );
}
