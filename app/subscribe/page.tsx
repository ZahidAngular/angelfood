import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Subscribe } from "@/components/Subscribe";

export const metadata: Metadata = {
  title: "Subscribe — Angel Food",
  description:
    "Join the Angel Food newsletter for new recipes, product drops and exclusive offers — straight to your inbox, no spam.",
  alternates: { canonical: "/subscribe" },
  openGraph: {
    url: "/subscribe",
    title: "Subscribe — Angel Food",
    description:
      "Join the Angel Food newsletter for new recipes, product drops and exclusive offers — straight to your inbox, no spam.",
  },
};

export default function SubscribePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Stay in the loop"
        title="Join the good stuff."
        intro="Recipes, new drops and the occasional cheesy pun — straight to your inbox."
      />
      <Subscribe />
    </main>
  );
}
