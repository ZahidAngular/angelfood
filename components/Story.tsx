"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { RevealImage } from "./RevealImage";

export function Story() {
  return (
    <section id="story" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <div className="relative">
          <RevealImage
            src="/images/founder.webp"
            alt="Alice Shopland, founder of Angel Food"
            className="aspect-[4/5] border border-line bg-cream-deep"
            imgClassName="object-center"
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
              ✦ The heart of Angel Food
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-[1] tracking-tight text-ink">
              Meet Alice: Founder of NZ&apos;s Original Vegan Cheese Company
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              I founded Angel Food in 2006 after choosing a plant based
              lifestyle and missing the creamy, melty cheese I loved. What
              started with importing vegan cheese from the UK soon became a
              mission to develop our own products here in Aotearoa, creating
              New Zealand made dairy free alternatives with taste at the
              heart.
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
              Nearly two decades later, Angel Food continues to create plant
              based food with the same focus on taste, quality and making
              everyday choices more delicious.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-8 font-display text-xl font-semibold tracking-tight text-ink">
              Ngā mihi mahana,{" "}
              <span className="text-green">Alice Shopland</span>
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-green px-7 py-4 text-base font-semibold text-cream transition-transform hover:scale-[1.04]"
            >
              Learn more <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
