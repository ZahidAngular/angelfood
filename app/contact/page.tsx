import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Angel Food",
  description:
    "Got questions or suggestions? Get in touch with Angel Food. Wholesale and food-service enquiries welcome.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Say hello"
        title="Let's talk cheese."
        intro="Questions, suggestions, collabs or wholesale — we'd love to hear from you."
      />
      <Contact />
    </main>
  );
}
