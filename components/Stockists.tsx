"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";
import { MapPin } from "lucide-react";

export function Stockists() {
  return (
    <section id="stockists" className="bg-green py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Parallax amount={45}>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              ✦ Stocked nationwide
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
              Proud to supply these guys and more…
            </h2>
          </Reveal>
        </Parallax>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-lg text-cream/75">
            Stocked in supermarkets and loved by kitchens nationwide — from your
            weekly shop to your favourite pizza joint.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal delay={0.12}>
            <LogoCard
              label="In supermarkets"
              src="/images/retailers.png"
              alt="Woolworths, New World, PAK'nSAVE, FreshChoice and SuperValue"
            />
          </Reveal>
          <Reveal delay={0.18}>
            <LogoCard
              label="In kitchens & food service"
              src="/images/partners.png"
              alt="Pizza Hut, Dad's Pies, The Goodtime Pie Co, New World, Gilmours, St Pierre's Sushi, Bidfood and Davis Food Ingredients"
            />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-base font-semibold text-ink-on-accent transition-transform hover:scale-[1.04]"
          >
            <MapPin size={18} /> Find a store near you
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function LogoCard({
  label,
  src,
  alt,
}: {
  label: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-paper p-6 sm:p-8">
      <span className="mb-5 inline-block self-start rounded-full bg-cream-deep px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
        {label}
      </span>
      <div className="relative my-auto h-20 w-full sm:h-28">
        <Image src={src} alt={alt} fill unoptimized className="object-contain" />
      </div>
    </div>
  );
}
