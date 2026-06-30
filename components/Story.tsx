"use client";

import { Reveal } from "./Reveal";
import { RevealImage } from "./RevealImage";

export function Story() {
  return (
    <section id="story" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <div className="relative">
          <RevealImage
            src="/images/founder.jpg"
            alt="Alice Shopland, founder of Angel Food"
            className="aspect-[4/5] border border-line bg-cream-deep"
            parallax={12}
          />
          <div className="absolute bottom-5 left-5 z-10 rounded-2xl bg-cream/90 px-5 py-3 backdrop-blur">
            <p className="font-display text-lg font-bold text-ink">Alice Shopland</p>
            <p className="text-sm text-ink-soft">Founder · est. 2006</p>
          </div>
        </div>

        {/* Text */}
        <div>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
              ✦ Our story
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-[1] tracking-tight text-ink">
              It started with a craving for something kinder.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              When Alice went vegan in 2004, she missed the creamy, melty cheese
              she&apos;d grown up with. So instead of going without, she made her
              own — and Angel Food became Aotearoa&apos;s first dedicated vegan
              cheese company.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <blockquote className="mt-8 border-l-2 border-gold pl-6 font-display text-2xl font-semibold leading-snug tracking-tight text-green">
              “Food isn&apos;t just fuel. It&apos;s joy, culture, collaboration
              and community.”
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              From hand-packing in a tiny kitchen to a household name on shelves
              nationwide, one thing hasn&apos;t changed: we&apos;re a little
              company that&apos;s big on doing good.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
