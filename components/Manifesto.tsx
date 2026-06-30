"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const WORDS =
  "Vegan food shouldn't feel like a compromise. So we make cheese that melts, stretches, crumbles and spreads — for you, the animals, and the world.".split(
    " "
  );

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  return (
    <section className="bg-cream py-28 sm:py-40">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-10 text-sm font-semibold uppercase tracking-[0.22em] text-coral">
          ✦ The Angel Food promise
        </p>
        <p className="flex flex-wrap font-display text-[clamp(1.8rem,5.2vw,4.2rem)] font-semibold leading-[1.08] tracking-tight">
          {WORDS.map((word, i) => {
            const start = i / WORDS.length;
            const end = start + 1 / WORDS.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: import("framer-motion").MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="mr-[0.28em] mt-[0.1em] inline-block">
      <motion.span style={{ opacity }} className="text-ink">
        {children}
      </motion.span>
    </span>
  );
}
