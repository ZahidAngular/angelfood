import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy — Angel Food" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy.">
      <p>We may collect personal information from you, including:</p>
      <ul>
        <li>Name</li>
        <li>Contact information</li>
        <li>Interactions with us</li>
      </ul>

      <p>We collect your personal information in order to:</p>
      <ul>
        <li>
          Inform our customers about new products, and recipes, and other
          information relevant to our product lines.
        </li>
      </ul>

      <p>
        <strong>
          Angel Food will not knowingly share your information with a third
          party.
        </strong>
      </p>

      <p>
        You have the right to ask for a copy of any personal information we
        hold about you, and to ask for it to be corrected if you think it is
        wrong. If you&apos;d like to ask for a copy of your information, or to
        have it corrected, please contact us by:
      </p>
      <ul>
        <li>
          Email: <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a>
        </li>
        <li>
          Telephone: <a href="tel:0800115002">0800 115002</a>
        </li>
      </ul>
    </LegalPage>
  );
}
