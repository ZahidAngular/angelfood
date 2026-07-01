import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Story } from "@/components/Story";
import { Values } from "@/components/Values";

export const metadata: Metadata = {
  title: "Our Story — Angel Food",
  description:
    "Founded by Alice Shopland in 2006, Angel Food is Aotearoa's original vegan cheese company — a little company that's big on doing good.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our story"
        title="A little company, big on doing good."
        intro="Aotearoa's original vegan cheese company, leading the way since 2006."
      />
      <Story />
      <Values />
    </main>
  );
}
