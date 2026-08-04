import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { RevealImage } from "@/components/RevealImage";
import { CourseSignupForm } from "@/components/CourseSignupForm";

const DESCRIPTION =
  "Discover delicious dairy-free cheese options with Angel Food. Join our free 4-day course and enjoy flavorful, plant-based cheeses since 2006.";

export const metadata: Metadata = {
  title:
    "Cheese Made Easy and Dairy-Free | Explore Dairy-Free Cheeses Today — Angel Food",
  description: DESCRIPTION,
  alternates: { canonical: "/cheese-made-easy-and-dairy-free" },
  openGraph: {
    url: "/cheese-made-easy-and-dairy-free",
    title: "Cheese Made Easy (and Dairy-Free) — Angel Food",
    description: DESCRIPTION,
  },
};

export default function CheeseMadeEasyPage() {
  return (
    <main className="bg-cream pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
              ✦ Free 4-day email course
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
              Cheese Made Easy (and Dairy-Free).
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-ink-soft">
              If life without dairy cheese sounds difficult or just plain wrong,
              we&apos;d love to help! We&apos;ve created this free four-day mini
              course so you can discover just how delicious dairy-free can be.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              And we&apos;ll show you how to get all the flavour with none of the
              FOMO.
            </p>

            <CourseSignupForm />
          </Reveal>

          <Reveal delay={0.1}>
            <RevealImage
              src="https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/1a3cea6f-0297-491a-ac4b-7536febcbba6/IMG_1484.jpeg"
              alt="A vegan cheese and snack platter with grapes, cherry tomatoes, crackers, olives, and various cheeses, garnished with herbs and edible flowers."
              className="aspect-[4/5]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              priority
            />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
