import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { HelpCentre } from "@/components/HelpCentre";
import { OG_DEFAULTS } from "@/lib/og";

const DESCRIPTION =
  "Answers to common questions about ordering Angel Food — where we deliver, how orders arrive, and how to store and heat your snap-frozen meals.";

export const metadata: Metadata = {
  title: "Help Centre — Angel Food",
  description: DESCRIPTION,
  alternates: { canonical: "/help-centre" },
  openGraph: {
    ...OG_DEFAULTS,
    url: "/help-centre",
    title: "Help Centre — Angel Food",
    description: DESCRIPTION,
  },
};

export default function HelpCentrePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Support"
        title="Help Centre."
        intro="Good food should be easy to enjoy. Here are answers to common questions about ordering Angel Food, getting your meals delivered, and keeping them at their best."
      />
      <HelpCentre />
    </main>
  );
}
