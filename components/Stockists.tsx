"use client";

import { RETAILERS } from "@/lib/site";
import { Reveal } from "./Reveal";
import { MapPin } from "lucide-react";

export function Stockists() {
  return (
    <section id="stockists" className="bg-cream-deep py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-[2.5rem] bg-paper p-8 sm:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                  ✦ Where to buy
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-tight text-ink">
                  Find us on shelves across Aotearoa.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-lg text-ink-soft">
                  Stocked in supermarkets and loved by kitchens nationwide — from
                  your weekly shop to your favourite pizza joint.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <a
                  href="#contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-green px-7 py-4 text-base font-semibold text-cream transition-transform hover:scale-[1.04]"
                >
                  <MapPin size={18} /> Find a store near you
                </a>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {RETAILERS.map((r, i) => (
                <Reveal key={r} delay={i * 0.06}>
                  <div className="flex h-24 items-center justify-center rounded-2xl border border-line bg-cream text-center font-display text-lg font-bold tracking-tight text-green transition-colors hover:border-green/40">
                    {r}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
