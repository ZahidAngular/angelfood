"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * The products page header's artwork: one pack from each of the three parts of
 * the range — cheese, meat and a ready meal — so the header shows what the page
 * is about before a visitor scrolls. Transparent pack renders overlapping on
 * the cream background, the same visual language the homepage hero uses, rather
 * than a boxed-in photo that would sit apart from the rest of the page.
 */

type Pack = {
  src: string;
  alt: string;
  /** Position and size within the square frame. */
  className: string;
  rotate: number;
  delay: number;
};

const PACKS: Pack[] = [
  {
    src: "/images/meals/vege-lasagna-v3.webp",
    alt: "Angel Food plant-based vege lasagna NZ",
    className: "right-0 top-0 w-[54%]",
    rotate: -9,
    delay: 0.5,
  },
  {
    src: "/images/meats/packs/burgers.webp",
    alt: "Angel Food plant-based burger patties NZ",
    className: "right-[3%] bottom-[1%] w-[52%]",
    rotate: 7,
    delay: 0.62,
  },
  {
    src: "/images/grated.webp",
    alt: "Angel Food dairy-free grated vegan cheese NZ",
    className: "left-0 top-[14%] w-[60%]",
    rotate: -4,
    delay: 0.74,
  },
];

export function ProductsHeaderArt() {
  return (
    <div className="relative aspect-[4/5] w-full">
      {/* Soft light behind the packs, so they read as lifted off the page
          rather than pasted onto it. */}
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-gold/25 blur-[70px]" />

      {PACKS.map((pack) => (
        <motion.div
          key={pack.src}
          initial={{ opacity: 0, y: 26, rotate: pack.rotate }}
          animate={{ opacity: 1, y: 0, rotate: pack.rotate }}
          transition={{
            duration: 0.9,
            delay: pack.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute ${pack.className}`}
        >
          <Image
            src={pack.src}
            alt={pack.alt}
            width={520}
            height={520}
            priority
            className="h-auto w-full drop-shadow-[0_26px_45px_rgba(20,66,44,0.22)]"
          />
        </motion.div>
      ))}
    </div>
  );
}
