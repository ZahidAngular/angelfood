import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Website Use — Angel Food" };

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of website use."
      intro="The terms on which you may use www.angelfood.co.nz."
    >
      <p>
        Angel Food Ltd operates www.angelfood.co.nz. By accessing the site you
        accept these terms. We may modify them at any time, so please review them
        periodically. <strong>You read, use and act on our site and our content
        at your own risk.</strong>
      </p>

      <h2>Licence to use</h2>
      <p>
        We grant you a non-exclusive, revocable licence to access the site for
        your own personal, non-commercial use. You may not use the site for any
        unlawful purpose or in competition with us.
      </p>

      <h2>Prohibited conduct</h2>
      <ul>
        <li>Violating the privacy of others, harassment, or abusive behaviour</li>
        <li>Tampering with the site, or transmitting viruses or malicious code</li>
        <li>Sending unsolicited or unauthorised messages</li>
        <li>Copying, distributing or infringing our intellectual property</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        All content on the site is owned by or licensed to Angel Food Ltd and may
        not be copied or distributed without our permission.
      </p>

      <h2>Liability</h2>
      <p>
        To the maximum extent permitted by law, warranties are disclaimed and our
        liability for data loss, interruptions or content inaccuracy is limited.
        Nothing in these terms limits your rights under the Consumer Guarantees
        Act 1993.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by New Zealand law. Any dispute should first be
        addressed through good-faith negotiation within 21 days before any
        litigation.
      </p>
    </LegalPage>
  );
}
