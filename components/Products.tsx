"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { PRODUCTS } from "@/lib/site";
import { Magnetic } from "./Magnetic";

export function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setVh(window.innerHeight);
      setDistance(trackRef.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 500); // after images/fonts settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative bg-cream-deep"
      style={{ height: `${distance + vh}px` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-center gap-6 px-5 sm:gap-8 sm:px-8"
        >
          {/* Intro panel */}
          <div className="flex h-[78vh] w-[86vw] shrink-0 flex-col justify-center sm:w-[42vw] lg:w-[34vw]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
              ✦ The range
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink">
              Cheese for every craving.
            </h2>
            <p className="mt-6 max-w-sm text-lg text-ink-soft">
              Seven dairy-free heroes built for real life. Keep scrolling —
              they&apos;re this way. →
            </p>
          </div>

          {/* Product panels */}
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} progress={scrollYProgress} />
          ))}

          {/* CTA panel */}
          <div className="flex h-[70vh] w-[80vw] shrink-0 flex-col justify-between rounded-[2.5rem] bg-green p-10 text-cream sm:w-[36vw] lg:w-[28vw]">
            <span className="text-6xl">🧀</span>
            <div>
              <h3 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[0.95] tracking-tight">
                Hungry yet?
              </h3>
              <p className="mt-4 text-cream/80">
                Find Angel Food at a supermarket near you across Aotearoa.
              </p>
              <Magnetic strength={0.4} className="mt-7 inline-block">
                <a
                  href="#stockists"
                  data-cursor="find"
                  className="inline-block rounded-full bg-gold px-7 py-3.5 font-semibold text-ink"
                >
                  Where to buy →
                </a>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({
  product: p,
  index,
  progress,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // gentle counter-parallax on the image as the track moves
  const imgX = useTransform(progress, [0, 1], [index % 2 ? 26 : -26, index % 2 ? -26 : 26]);

  return (
    <motion.article
      className="group relative flex h-[78vh] max-h-[680px] w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2.5rem] border border-line bg-paper p-8 sm:w-[40vw] lg:w-[30vw]"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      data-cursor=""
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-7xl font-extrabold text-line">
          0{index + 1}
        </span>
        <span
          className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-paper"
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
}
