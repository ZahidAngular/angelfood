import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Closing section of the products page: the plain-language case for the range,
 * ending on the one thing a reader is most likely to want next — a shop that
 * stocks it. Copy comes from the products page SEO document.
 */
export function WhyChooseRange() {
  return (
    <section className="bg-cream-deep py-24 sm:py-32">
      {/* Same container width as the range sections above, so the page keeps
          one left edge the whole way down. Heading and body sit side by side on
          wide screens: a single column here would either run the paragraph to
          an unreadable line length or leave half the row empty. */}
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink [text-wrap:balance]">
              Why Choose Angel Food&apos;s Plant-Based Range
            </h2>
          </Reveal>

          <div>
        <Reveal delay={0.05}>
          <p className="text-lg leading-relaxed text-ink-soft">
            Every product in our plant based food range is 100% vegan, dairy
            free and made with real ingredients. We&apos;ve been developing
            plant-based food in New Zealand since 2006 longer than almost anyone
            else in the country and our cheese range has picked up multiple NZ
            Vegan Cheese Awards. You&apos;ll find our products in Woolworths,
            New World, PAK&apos;nSAVE and leading Kiwi food-service kitchens
            nationwide.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href="/where-to-buy"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-ink"
          >
            Find a store near you
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
