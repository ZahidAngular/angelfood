import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { OG_DEFAULTS } from "@/lib/og";

const title = "Online store — Angel Food";
const description =
  "Our online store is on its way. In the meantime the full Angel Food range is on shelves across Aotearoa — find your nearest stockist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/online-store" },
  // A holding page is not something anyone should land on from a search.
  // It has no content of its own worth ranking, and once the shop opens it
  // would be an indexed page competing with the shop itself.
  robots: { index: false, follow: true },
  openGraph: { ...OG_DEFAULTS, url: "/online-store", title, description },
};

/** Where someone can usefully go instead, in the order most will want. */
const ELSEWHERE = [
  {
    icon: MapPin,
    href: "/where-to-buy",
    heading: "Find a store near you",
    body: "The full range is on shelves in supermarkets and stores right across Aotearoa.",
    primary: true,
  },
  {
    icon: UtensilsCrossed,
    href: "/products",
    heading: "See what we make",
    body: "Cheeses, meats and ready meals — with the ingredients and nutrition for every one of them.",
  },
  {
    icon: Mail,
    href: "/subscribe",
    heading: "Hear when we open",
    body: "Join the list and we will tell you the day ordering goes live.",
  },
];

export default function OnlineStorePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Online store"
        title="Just a little longer."
        intro="Our online store is on hold while we get it right. It will be worth the wait — and in the meantime, we are as close as your nearest supermarket."
      />

      <section className="bg-cream pb-24 pt-2 sm:pb-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="space-y-4">
            {ELSEWHERE.map((option, i) => (
              <Reveal key={option.href} delay={i * 0.08}>
                <Link
                  href={option.href}
                  className={`group flex items-start gap-5 rounded-[1.5rem] border p-6 transition-all duration-300 hover:-translate-y-0.5 sm:p-7 ${
                    option.primary
                      ? "border-green bg-green text-cream hover:shadow-[0_18px_40px_-20px_rgba(20,66,44,0.55)]"
                      : "border-line bg-paper hover:border-green/40 hover:shadow-[0_18px_40px_-24px_rgba(20,66,44,0.45)]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      option.primary ? "bg-cream/15 text-cream" : "bg-cream text-green"
                    }`}
                  >
                    <option.icon size={19} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`flex items-center gap-2 font-display text-lg font-bold tracking-tight ${
                        option.primary ? "text-cream" : "text-ink group-hover:text-green"
                      }`}
                    >
                      {option.heading}
                      <ArrowRight
                        size={16}
                        className="shrink-0 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                    <span
                      className={`mt-1.5 block text-sm leading-relaxed ${
                        option.primary ? "text-cream/80" : "text-ink-soft"
                      }`}
                    >
                      {option.body}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Anyone who ordered before the shutter came down still needs
              their order, and /track still works for them. */}
          <Reveal delay={0.3}>
            <p className="mt-8 text-center text-sm text-ink-soft">
              Already placed an order?{" "}
              <Link
                href="/track"
                className="font-semibold text-green underline underline-offset-4"
              >
                Track it here
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
