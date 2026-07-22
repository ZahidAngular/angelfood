import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions of Trade — Angel Food",
};

export default function TermsOfTradePage() {
  return (
    <LegalPage title="Terms & conditions of trade.">
      <p>
        <strong>Angel Food Ltd Terms Of Trade</strong>
      </p>

      <h2>1. Credit terms</h2>
      <p>
        Credit is made available to customers at the sole discretion of
        Angel Food Ltd and is subject to a continuing history of prompt
        payment of invoices.
      </p>
      <p>New customers may be required to pre-pay for their first order.</p>

      <h2>2. Ownership of goods</h2>
      <p>
        All goods supplied remain the property of Angel Food Ltd until
        payment has been made in full.
      </p>

      <h2>3. Condition of goods</h2>
      <p>
        Angel Food Ltd will act in good faith to deliver goods in prime
        condition. In the unlikely event that we supply substandard goods,
        please advise us as soon as possible so that we can discuss credit
        or replacement. Angel Food Ltd reserves the right to inspect the
        goods in question.
      </p>

      <h2>4. Payment</h2>
      <p>
        Invoices are payable on the 20th of the month following unless
        agreed otherwise in writing.
      </p>
      <p>
        Payment can be made by direct credit, to the bank account specified
        on your invoice.
      </p>
      <p>We do not accept cheques.</p>
      <p>
        If you think one of our invoices is incorrect, please contact us
        before payment is due.
      </p>
      <p>
        If a customer&apos;s accounts are overdue, Angel Food Ltd reserves
        the right to request advance payment for future orders. Overdue
        invoices may incur interest of 1.5% per month, compounded monthly
        plus an additional $10 administration fee for each reminder notice
        or follow-up phone call. The customer is liable for any additional
        costs of collection, including charges added by any debt collection
        agency.
      </p>

      <h2>5. Acceptance</h2>
      <p>
        By placing an order with Angel Food Ltd or its authorised agents,
        the customer is deemed to have accepted these terms and conditions.
      </p>
    </LegalPage>
  );
}
