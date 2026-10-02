import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { OG_DEFAULTS } from "@/lib/og";

const DESCRIPTION =
  "The terms that apply to orders placed through the Angel Food online store — prices, delivery, receiving frozen meals, changes and cancellations.";

export const metadata: Metadata = {
  title: "Online Store Terms & Conditions — Angel Food",
  description: DESCRIPTION,
  alternates: { canonical: "/online-store-terms" },
  openGraph: {
    ...OG_DEFAULTS,
    url: "/online-store-terms",
    title: "Online Store Terms & Conditions — Angel Food",
    description: DESCRIPTION,
  },
};

export default function OnlineStoreTermsPage() {
  return (
    <LegalPage title="Online store terms &amp; conditions.">
      <p>
        <strong>Angel Food Ltd · Last updated 27 September 2026</strong>
      </p>
      <p>
        Thank you for shopping with Angel Food. These terms explain how orders
        placed through our online store work. If you have a question, email{" "}
        <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a> or call{" "}
        <a href="tel:0800115002">0800 115 002</a>.
      </p>

      <h2>1. About these terms</h2>
      <p>
        These terms apply to consumer purchases made directly through the Angel
        Food online store. By placing an order, you agree to them. Our separate{" "}
        <a href="/terms-of-trade">terms of trade</a> apply to wholesale and
        other business accounts.
      </p>
      <p>
        Nothing in these terms limits your rights under New Zealand consumer
        law.
      </p>

      <h2>2. Products and availability</h2>
      <p>
        We do our best to keep product descriptions, ingredients, prices and
        availability accurate. Products may change or sell out.
      </p>
      <p>
        If we cannot supply an item you ordered, we will contact you to arrange
        a suitable alternative with your agreement or refund the unavailable
        item. We will not substitute a product without checking with you first.
      </p>

      <h2>3. Prices and payment</h2>
      <p>
        Prices are displayed in New Zealand dollars. The total price, including
        any applicable GST and delivery charge, will be shown at checkout
        before you place your order.
      </p>
      <p>
        Payment is taken when you place your order using the payment methods
        offered at checkout. We may change prices from time to time, but a
        later price change will not affect an order we have already accepted.
      </p>

      <h2>4. Placing an order</h2>
      <p>
        When you place an order, we will send an acknowledgement to the email
        address you provide. Please check your order and delivery details
        carefully.
      </p>
      <p>
        We may contact you if an item is unavailable, payment cannot be
        processed, or we cannot deliver to your address. If we cannot fulfil
        your order, we will refund any amount paid for the items we cannot
        supply.
      </p>
      <p>Minimum order is 12 units.</p>

      <h2>5. Delivery areas and charges</h2>
      <p>
        We deliver to the New Zealand addresses available at checkout. Delivery
        charges depend on your location and will be shown before you pay.
      </p>
      <p>
        Some addresses, including rural addresses, may require a different
        delivery arrangement or may be outside our delivery area. If we cannot
        safely deliver a frozen order to your address, we will contact you and
        arrange a refund.
      </p>

      <h2>6. Dispatch and delivery</h2>
      <p>
        We plan dispatch around the needs of frozen food. Our current dispatch
        days and estimated delivery times are listed on our Shipping &amp;
        Delivery page: [insert link when published].
      </p>
      <p>
        Once your order has been dispatched, we will send you tracking
        information where available. Delivery estimates may change because of
        public holidays, weather, courier disruption or other circumstances. If
        there is a problem with delivery, please contact Angel Food so we can
        follow it up.
      </p>

      <h2>7. Receiving frozen meals</h2>
      <p>
        Our meals are snap-frozen to lock in freshness and packed for delivery.
        Please arrange for someone to bring your order inside promptly and
        store the meals according to the instructions on their packaging.
      </p>
      <p>
        If a meal arrives warm, fully thawed, damaged or in otherwise
        concerning condition, do not eat or refreeze it. Contact us promptly
        with your order number, a description of the issue and, if possible,
        photographs. We will assess what happened and arrange the appropriate
        remedy.
      </p>

      <h2>8. Changes and cancellations</h2>
      <p>
        If you need to change an order or delivery address, contact us as soon
        as possible. We will try to make the change if the order has not yet
        been packed or dispatched.
      </p>
      <p>
        If you change your mind, please contact us before dispatch. Because our
        products are perishable, we may be unable to cancel or accept a return
        after an order has been dispatched. This does not affect your rights if
        a product is faulty, unsafe, incorrectly supplied or otherwise fails to
        meet consumer guarantees.
      </p>

      <h2>9. Problems with an order</h2>
      <p>
        We want your order to arrive in good condition and match what you
        purchased. If something is missing, incorrect, damaged, unsafe or
        delayed, please contact{" "}
        <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a> or{" "}
        <a href="tel:0800115002">0800 115 002</a> with your order number.
      </p>
      <p>
        Letting us know promptly helps us investigate, especially for
        temperature-sensitive food. We may ask for photographs or other
        details, but there is no fixed 24-hour cut-off for your rights under
        consumer law.
      </p>
      <p>
        Depending on the issue and your rights, the remedy may include a
        replacement, refund or another appropriate solution. Angel Food will
        work with the delivery provider where necessary; you do not need to
        resolve a courier problem yourself before contacting us.
      </p>

      <h2>10. Ingredients, allergens and storage</h2>
      <p>
        Please read the ingredients, allergen, heating and storage information
        on the specific product pack before eating it. Product recipes and
        packaging may change, so the pack you receive is the most relevant
        source of information.
      </p>
      <p>
        If you have an allergy or a question about a product, contact us before
        ordering. Follow the date and storage instructions printed on the pack,
        and heat meals thoroughly as directed.
      </p>

      <h2>11. Website use</h2>
      <p>
        The content, images, names and branding on this website belong to Angel
        Food or are used with permission. You may use the website to learn
        about and purchase our products, but please do not copy or use its
        content commercially without our permission.
      </p>
      <p>
        We aim to keep the website available and accurate, although technical
        issues can occasionally occur. If a checkout error affects your order,
        contact us and we will help resolve it.
      </p>

      <h2>12. Privacy and governing law</h2>
      <p>
        We handle personal information in accordance with our{" "}
        <a href="/privacy-policy">Privacy Policy</a>. We use the details you
        provide to process and deliver orders and to contact you about them.
      </p>
      <p>These terms are governed by New Zealand law.</p>

      <h2>Contact us</h2>
      <p>
        Angel Food Ltd
        <br />
        Email: <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a>
        <br />
        Phone: <a href="tel:0800115002">0800 115 002</a>
      </p>
    </LegalPage>
  );
}
