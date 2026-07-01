import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy — Angel Food" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy."
      intro="How Angel Food Limited collects, uses and protects your personal information."
    >
      <p>
        Angel Food Limited respects your privacy. This policy explains what
        personal information we collect, how we use it, and the choices you have.
      </p>

      <h2>What we collect</h2>
      <p>
        We may collect personal information such as your name, contact details
        and records of your interactions with us — for example, when you contact
        us, place a wholesale enquiry, or sign up to hear from us.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your information to respond to enquiries and to inform our
        customers about new products, recipes, and other information relevant to
        our product lines. <strong>Angel Food will not knowingly share your
        information with a third party.</strong>
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to ask for a copy of any personal information we hold
        about you, and to ask for it to be corrected if you think it is wrong.
      </p>

      <h2>Contact us</h2>
      <p>
        To make a request or ask a question about your privacy, email{" "}
        <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a> or call{" "}
        <a href="tel:0800115002">0800 115002</a>.
      </p>
    </LegalPage>
  );
}
