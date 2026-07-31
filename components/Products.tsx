"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, MotionValue, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, getNutritionSlug } from "@/lib/site";

const AUTOPLAY_MS = 4000;
const GAP_PX = 24;

/** How many full cards should be visible at once, by breakpoint. */
function cardsPerRow(width: number) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
  return 1;
}

export function Products() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const x = useMotionValue(0);

  const count = PRODUCTS.length;

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % count) + count) % count; // wrap both directions
      setIndex(next);
    },
    [count]
  );

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return;
      const perRow = cardsPerRow(window.innerWidth);
      const vw = viewportRef.current.clientWidth;
      setCardWidth((vw - GAP_PX * (perRow - 1)) / perRow);
      // Read scrollWidth on the next frame, after the new card width applied.
      requestAnimationFrame(() => {
        if (!viewportRef.current || !trackRef.current) return;
        setMaxScroll(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
      });
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 500); // after images/fonts settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  // Slide the track so the active card's left edge sits at the viewport edge —
  // but never scroll past the point where the track's end is fully in view,
  // so the last card never leaves a blank gap behind it. Animated (not an
  // instant jump) so the outgoing card slides off as the next slides in.
  useEffect(() => {
    const card = cardRefs.current[index];
    if (!card) return;
    const controls = animate(x, -Math.min(card.offsetLeft, maxScroll), {
      type: "spring",
      stiffness: 260,
      damping: 32,
    });
    return () => controls.stop();
  }, [index, maxScroll, cardWidth, x]);

  // Autoplay — loops forever, pauses while a user is interacting.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, paused, goTo]);

  return (
    <section id="cheeses" className="relative bg-cream-deep py-24 sm:py-32">
      <div className="flex items-center gap-3 px-5 sm:gap-5 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous product"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft shadow-md transition-colors hover:border-green hover:bg-green hover:text-cream"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={viewportRef}
          className="min-w-0 flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            ref={trackRef}
            style={{ x, gap: GAP_PX }}
            className="flex items-stretch"
          >
            {PRODUCTS.map((p, i) => (
              <div key={p.name} ref={(el) => { cardRefs.current[i] = el; }}>
                <ProductCard product={p} index={i} x={x} width={cardWidth} />
              </div>
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next product"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft shadow-md transition-colors hover:border-green hover:bg-green hover:text-cream"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom controls — dots to jump straight to a product, plus arrows
          again so navigation is reachable without reaching to the sides
          (handy on phones, where the side arrows sit close to the screen edge). */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:mt-10">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous product"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:border-green hover:bg-green hover:text-cream"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.name}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-green" : "w-2 bg-ink-soft/30 hover:bg-ink-soft/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next product"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:border-green hover:bg-green hover:text-cream"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}

function ProductCard({
  product: p,
  index,
  x,
  width,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
  x: MotionValue<number>;
  width: number;
}) {
  // subtle counter-parallax on the image as the track slides
  const imgX = useTransform(x, (v) => (index % 2 ? v * 0.02 : v * -0.02));
  const nutritionSlug = getNutritionSlug(p.name);

  const card = (
    <motion.article
      style={width ? { width } : undefined}
      className="group relative flex h-[70vh] w-[82vw] max-h-[560px] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-line bg-paper p-6 lg:p-7"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      data-cursor={nutritionSlug ? "Ingredients & nutrition" : "Taste it"}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-7xl font-extrabold text-line">
          0{index + 1}
        </span>
        <span
          className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink"
          style={{ background: p.accent }}
        >
          {p.tag}
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <div
          className="absolute h-52 w-52 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: p.accent }}
        />
        <motion.div style={{ x: imgX }} className="relative h-full w-full">
          <Image
            src={p.image}
            alt={`Angel Food ${p.name}`}
            fill
            sizes="40vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
      </div>

      <div>
        <h3 className="font-display text-3xl font-bold tracking-tight text-ink">
          {p.name}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
          {p.blurb}
        </p>
      </div>
    </motion.article>
  );

  return nutritionSlug ? (
    <Link
      href={`/ingredients-nutrition-info#${nutritionSlug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0"
    >
      {card}
    </Link>
  ) : (
    card
  );
}
