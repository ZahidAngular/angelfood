import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Social Media Giveaway Ts & Cs — Angel Food",
};

export default function GiveawayTermsPage() {
  return (
    <LegalPage title="Social media giveaway Ts & Cs.">
      <p>
        <strong>Angel Food Social Media Giveaway Terms &amp; Conditions</strong>
      </p>
      <ul>
        <li>
          For the purposes of these Terms and Conditions, &quot;The
          Promoter&quot; refers to Angel Food Ltd whose Instagram handle is
          @angelfoodcheese and Facebook handle is @AngelFoodCheese.
        </li>
        <li>
          By entering the competition you agree to be bound by these terms
          and conditions. All entries must be received by midnight NZT on the
          date specified in the relevant post. One (1) winner in Aotearoa New
          Zealand will be selected at random by The Promoter on the date
          specified in the relevant post and the winner will be notified on
          or after this date.
        </li>
        <li>
          The Promotor&apos;s competitions with entry via Instagram and/or
          Facebook are open only to residents of Aotearoa New Zealand. One
          (1) winner will be chosen at random from all entrants and across
          all platforms unless specified otherwise in the relevant posts.
        </li>
        <li>
          No purchase necessary. Winners will not be required to pay to enter
          the competition.
        </li>
        <li>Employees of The Promoter are not eligible to enter.</li>
        <li>
          Instagram or Facebook are not in any way affiliated or involved in
          the competition.
        </li>
        <li>
          The Promoter will not be held liable if the named prize becomes
          unavailable or cannot be fulfilled.
        </li>
        <li>
          The Promoter will not be held liable for any failure of receipt of
          entries. The Promoter takes no responsibility for any entries which
          are lost, delayed, illegible, corrupted, damaged, incomplete or
          otherwise invalid.
        </li>
        <li>
          To the extent permitted by applicable law, The Promoter&apos;s
          liability under or in connection with the competition or these
          terms and conditions shall be limited to the cost price of the
          Prize in question.
        </li>
        <li>
          To the extent permitted by applicable law, The Promoter shall not
          be liable under or in connection with these terms and conditions,
          the competition or any Prize for any indirect, special or
          consequential cost, expense, loss or damage suffered by a
          participant even if such cost, expense, loss or damage was
          reasonably foreseeable or might reasonably have been contemplated
          by the participant and the promoter and whether arising from
          breach of contract, tort, negligence, breach of statutory duty or
          otherwise.
        </li>
        <li>
          Prizes are non-negotiable, non-transferable and non-refundable. No
          cash alternative is available. Where a Prize becomes unavailable
          for any reason, the promoter reserves the right to substitute that
          prize for a prize of equal or higher value.
        </li>
        <li>
          The name, address, email address and phone number of the winner
          must be provided to The Promoter if requested and will be shared to
          enable fulfilment of the Prize.
        </li>
        <li>
          In the event of unforeseen circumstances beyond The Promoter&apos;s
          reasonable control, the promoter reserves the right to cancel,
          terminate, modify or suspend the competition or these terms and
          conditions, either in whole or in part, with or without notice.
        </li>
        <li>
          The Promoter&apos;s decision is final. No correspondence will be
          entered into.
        </li>
        <li>
          The winner&apos;s name and social media username may be posted on
          the social media profiles of The Promoter after the winner has
          been selected.
        </li>
      </ul>
    </LegalPage>
  );
}
