"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { PRODUCTS } from "@/lib/site";

export function SpinShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The whole ring rotates a full turn (plus a bit) as you scroll through.
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 380]);
  const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.92]);

  // Center copy fades/scales through the scroll.
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );
  const titleScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.05]);
  const bgGlow = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section ref={ref} className="relative h-[320vh] bg-green text-cream">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* rotating glow */}
        <motion.div
          style={{ rotate: bgGlow }}
          className="pointer-events-none absolute h-[120vmin] w-[120vmin]"
        >
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/30 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-bright/40 blur-[120px]" />
        </motion.div>

        {/* eyebrow */}
        <div className="absolute top-[12%] z-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            ✦ Seven dairy-free heroes
          </p>
        </div>

        {/* center copy */}
        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="relative z-20 max-w-2xl px-6 text-center"
        >
          <h2 className="font-display text-[clamp(2rem,8vw,7rem)] font-extrabold leading-[0.86] tracking-[-0.03em]">
            Made to <span className="text-gold">melt</span> your heart.
          </h2>
          <p className="mx-auto mt-6 hidden max-w-md text-lg text-cream/75 sm:block">
            One range, endless cravings. Keep scrolling — watch them turn.
          </p>
        </motion.div>

        {/* rotating ring of products */}
        <motion.div
          style={{ rotate: ringRotate, scale: ringScale }}
          className="absolute z-10 h-[2px] w-[2px]"
        >
          {PRODUCTS.map((p, i) => {
            const angle = (i / PRODUCTS.length) * 360;
            return (
              <RingItem
                key={p.name}
                src={p.image}
                name={p.name}
                angle={angle}
                progress={scrollYProgress}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function RingItem({
  src,
  name,
  angle,
  progress,
}: {
  src: string;
  name: string;
  angle: number;
  progress: MotionValue<number>;
}) {
  // Counter-rotate each item so it stays upright while the ring spins.
  const counter = useTransform(progress, [0, 1], [-angle, -angle - 380]);

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        transform: `rotate(${angle}deg) translateY(calc(clamp(165px, 40vmin, 360px) * -1))`,
      }}
    >
      <motion.div
        style={{ rotate: counter }}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        <div className="group relative h-[18vmin] max-h-[180px] min-h-[96px] w-[18vmin] min-w-[96px] max-w-[180px] drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]">
          <Image src={src} alt={name} fill sizes="20vmin" className="object-contain" />
        </div>
      </motion.div>
    </div>
  );
}
