"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Magnetic } from "./Magnetic";

type Floater = {
  src: string;
  className: string; // position + size
  depth: number; // parallax strength
  delay: number;
  rotate: number;
};

const FLOATERS: Floater[] = [
  {
    src: "/images/cream-cheese.png",
    className: "right-[4%] top-[14%] w-[26vw] max-w-[340px]",
    depth: 120,
    delay: 0.5,
    rotate: -6,
  },
  {
    src: "/images/grated.png",
    className: "right-[26%] top-[40%] w-[20vw] max-w-[260px]",
    depth: 220,
    delay: 0.65,
    rotate: 8,
  },
  {
    src: "/images/feta.png",
    className: "right-[2%] bottom-[8%] w-[19vw] max-w-[250px]",
    depth: 70,
    delay: 0.8,
    rotate: 5,
  },
  {
    src: "/images/sour-cream.png",
    className: "left-[3%] bottom-[6%] w-[15vw] max-w-[190px]",
    depth: 180,
    delay: 0.95,
    rotate: -10,
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-cream pt-40 sm:pt-44"
    >
      {/* gradient blobs */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-gold/25 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-green-bright/20 blur-[130px]" />

      {/* Floating products */}
      {FLOATERS.map((f, i) => (
        <Floater key={i} {...f} progress={scrollYProgress} index={i} />
      ))}

      {/* Headline */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-green backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          Aotearoa&apos;s original vegan cheese co. · since 2006
        </motion.span>

        <h1 className="mt-6 font-display text-[clamp(3rem,11vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.03em] text-ink">
          <Line delay={0.35}>Better</Line>
          <Line delay={0.45} className="text-green">
            vegan
          </Line>
          <Line delay={0.55}>
            cheese<span className="text-coral">.</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft sm:text-xl"
        >
          Dairy-free cheese that never asks you to compromise — because{" "}
          <em className="not-italic text-green">doing good should taste incredible.</em>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.5}>
            <a
              href="#products"
              data-cursor="taste"
              className="group inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 text-base font-semibold text-cream"
            >
              Explore the range
              <ArrowDown
                size={18}
                className="transition-transform group-hover:translate-y-1"
              />
            </a>
          </Magnetic>
          <Magnetic strength={0.5}>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border border-green/30 px-8 py-4 text-base font-semibold text-green"
            >
              Our story
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-7 z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 text-xs uppercase tracking-[0.2em] text-ink-soft sm:px-8"
      >
        <span className="flex items-center gap-2">
          <ArrowDown size={14} className="animate-bounce" /> Scroll to taste
        </span>
        <span className="hidden sm:block">Proudly made in NZ</span>
      </motion.div>
    </section>
  );
}

function Line({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`block ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Floater({
  src,
  className,
  depth,
  delay,
  rotate,
  progress,
  index,
}: Floater & { progress: MotionValue<number>; index: number }) {
  const y = useTransform(progress, [0, 1], [0, depth]);
  return (
    <motion.div
      style={{ y }}
      className={`pointer-events-none absolute z-10 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: rotate - 12 }}
        animate={{ opacity: 1, scale: 1, rotate }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
          className="drop-shadow-[0_30px_40px_rgba(20,66,44,0.25)]"
        >
          <Image
            src={src}
            alt=""
            width={400}
            height={400}
            className="h-auto w-full"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
