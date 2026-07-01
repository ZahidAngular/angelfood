import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Social Media Giveaway Ts & Cs — Angel Food",
};

export default function GiveawayTermsPage() {
  return (
    <LegalPage
      title="Social media giveaway Ts & Cs."
      intro="The terms that apply to competitions and giveaways run by Angel Food on social media."
    >
      <p>
        These terms apply to giveaways and competitions run by Angel Food Limited
        on its social media channels (such as Instagram and Facebook), unless
        stated otherwise in a specific promotion.
      </p>

      <h2>Eligibility</h2>
      <ul>
        <li>Open to New Zealand residents unless otherwise stated</li>
        <li>Entrants under 18 should have parent or guardian permission</li>
        <li>Employees of Angel Food and their immediate families are not eligible</li>
      </ul>

      <h2>How to enter</h2>
      <p>
        Follow the entry instructions in the relevant post. No purchase is
        necessary. Entries that don&apos;t follow the instructions may be
        disqualified.
      </p>

      <h2>Winners &amp; prizes</h2>
      <p>
        Winners are chosen as described in the promotion and notified via social
        media or direct message. Prizes are not transferable or redeemable for
        cash. If a winner cannot be contacted within a reasonable time, Angel
        Food may select an alternative winner.
      </p>

      <h2>General</h2>
      <p>
        This promotion is in no way sponsored, endorsed or administered by, or
        associated with, any social media platform. Angel Food may amend these
        terms or cancel a promotion where reasonably necessary. Questions? Email{" "}
        <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a>.
      </p>
    </LegalPage>
  );
}
