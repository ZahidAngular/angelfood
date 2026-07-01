import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions of Trade — Angel Food",
};

export default function TermsOfTradePage() {
  return (
    <LegalPage
      title="Terms & conditions of trade."
      intro="The terms that apply to wholesale and trade orders with Angel Food Limited."
    >
      <p>
        These terms apply to the supply of goods by Angel Food Limited
        (&ldquo;Angel Food&rdquo;) to its trade and wholesale customers
        (&ldquo;the Customer&rdquo;).
      </p>

      <h2>Orders &amp; pricing</h2>
      <p>
        Prices are as quoted at the time of order and may change with notice.
        Orders are accepted at Angel Food&apos;s discretion and subject to
        availability.
      </p>

      <h2>Payment</h2>
      <p>
        Unless otherwise agreed in writing, invoices are payable by the due date
        stated. Title in the goods remains with Angel Food until payment is
        received in full; risk passes to the Customer on delivery.
      </p>

      <h2>Delivery</h2>
      <p>
        Delivery dates are estimates only. Angel Food is not liable for delays
        outside its reasonable control.
      </p>

      <h2>Returns &amp; quality</h2>
      <p>
        Please inspect goods on delivery and notify us of any shortage or damage
        promptly. Your rights under the Consumer Guarantees Act 1993 and Fair
        Trading Act 1986 are not affected.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of New Zealand. For wholesale
        enquiries, contact{" "}
        <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a>.
      </p>
    </LegalPage>
  );
}
