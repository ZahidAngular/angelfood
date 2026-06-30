"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MEALS } from "@/lib/site";
import { Reveal } from "./Reveal";

export function Meals() {
  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                ✦ Beyond cheese
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
                Ready-to-go plant goodness.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-ink-soft">
              Wholesome vegan meals for the nights you&apos;d rather not cook —
              all the comfort, none of the compromise.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {MEALS.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 0.07}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group overflow-hidden rounded-3xl border border-line bg-paper p-5"
              >
                <div className="relative flex h-44 items-center justify-center">
                  <Image
                    src={m.image}
                    alt={`Angel Food ${m.name}`}
                    width={260}
                    height={260}
                    className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-4 text-center font-display text-lg font-bold tracking-tight text-ink">
                  {m.name}
                </h3>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
