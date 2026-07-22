"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MEATS } from "@/lib/site";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";

export function Meats() {
  return (
    <section id="meats" className="bg-cream-deep py-24 sm:py-32">
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <Parallax amount={40}>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                ✦ Meats
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
                Plant-based meat, done right.
              </h2>
            </Reveal>
          </Parallax>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-ink-soft">
              Sausages, nuggets, meatballs and bacon — all the sizzle and
              crunch you love, minus the animal.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          {MEATS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 0.07} className="h-full">
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-paper p-5 sm:p-6"
                data-cursor="Taste it"
              >
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl sm:h-96">
                  <span
                    className="absolute right-0 top-0 z-10 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-ink"
                    style={{ background: p.accent }}
                  >
                    {p.tag}
                  </span>
                  <Image
                    src={p.image}
                    alt={`Angel Food ${p.name}`}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
                  {p.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {p.blurb}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
