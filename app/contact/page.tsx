import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { OG_DEFAULTS } from "@/lib/og";

export const metadata: Metadata = {
  title: "Contact — Angel Food",
  description:
    "Got questions or suggestions? Get in touch with Angel Food. Wholesale and food-service enquiries welcome. Call 0800 115002 or email info@angelfood.co.nz.",
  alternates: { canonical: "/contact" },
  openGraph: {
    ...OG_DEFAULTS,
    url: "/contact",
    title: "Contact — Angel Food",
    description:
      "Got questions or suggestions? Get in touch with Angel Food. Wholesale and food-service enquiries welcome. Call 0800 115002 or email info@angelfood.co.nz.",
  },
};

export default function ContactPage() {
  return (
    <main className="pt-40 sm:pt-44">
      <Contact />
    </main>
  );
}
