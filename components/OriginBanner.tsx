import { Award } from "lucide-react";
import { Reveal } from "./Reveal";

export function OriginBanner() {
  return (
    <section className="relative overflow-hidden border-y border-cream/10 bg-green py-20 text-cream sm:py-28">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[24rem] w-[24rem] rounded-full bg-green-bright/20 blur-[130px]" />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-cream/5 text-gold backdrop-blur-sm">
            <Award size={26} strokeWidth={1.5} />
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            Since 2006
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-cream">
            New Zealand&apos;s First Vegan Cheese Manufacturer
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-7 h-px w-16 bg-gold/40" />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-cream/70">
            Since 2006, we have been making vegan cheese in New Zealand,
            combining years of plant based expertise with delicious dairy
            free alternatives for everyday eating.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
