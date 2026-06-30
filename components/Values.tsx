"use client";

import { Heart, Leaf, Sun } from "lucide-react";
import { VALUES, IMPACT } from "@/lib/site";
import { Reveal } from "./Reveal";

const ICONS = { heart: Heart, leaf: Leaf, sun: Sun };

export function Values() {
  return (
    <section id="values" className="bg-green py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
            ✦ What we stand for
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-tight">
            Doing good, baked into everything.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = ICONS[v.icon as keyof typeof ICONS];
            return (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="group h-full rounded-3xl border border-cream/15 bg-cream/[0.04] p-8 transition-colors hover:bg-cream/[0.08]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-ink transition-transform duration-300 group-hover:-rotate-6">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-cream/75">{v.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Impact stats */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream/15 bg-cream/10 lg:grid-cols-4">
          {IMPACT.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="bg-green p-8 text-center">
                <p className="font-display text-4xl font-extrabold tracking-tight text-gold sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-cream/70">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
