import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Angel Food",
  description:
    "Got questions or suggestions? Get in touch with Angel Food. Wholesale and food-service enquiries welcome.",
};

export default function ContactPage() {
  return (
    <main className="pt-40 sm:pt-44">
      <Contact />
    </main>
  );
}
