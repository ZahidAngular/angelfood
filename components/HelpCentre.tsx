import Link from "next/link";
import { ChevronDown, Mail, Phone } from "lucide-react";

/**
 * The help centre.
 *
 * Built on <details>, not React state: the browser handles opening and
 * closing, every answer is in the markup for search engines to index and for
 * a reader to find with ctrl-F, and it all works before any JavaScript
 * arrives. The first question starts open so the page does not read as a
 * list of closed boxes.
 */

type Question = {
  q: string;
  /** Rich rather than a string, because several answers carry links. */
  a: React.ReactNode;
};

type Section = { heading: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    heading: "Delivery",
    questions: [
      {
        q: "Where do you deliver?",
        a: (
          <>
            We&apos;re preparing to deliver our snap-frozen meals directly to
            homes across New Zealand. Available delivery areas will appear at
            checkout. If your address isn&apos;t accepted, get in touch and
            we&apos;ll see what options are available.
          </>
        ),
      },
      {
        q: "When will my order arrive?",
        a: (
          <>
            We dispatch frozen meal orders on [confirmed dispatch days]. Once
            your order is on its way, we&apos;ll email you a tracking link.
            Delivery times may vary by location and around public holidays.
          </>
        ),
      },
      {
        q: "How much is delivery?",
        a: (
          <>
            Your delivery charge will be shown at checkout before you pay.
            [Add confirmed regional rates and any free-delivery thresholds.]
          </>
        ),
      },
      {
        q: "Do I need to be home?",
        a: (
          <>
            Please arrange for someone to bring your order inside as soon as it
            arrives and place the meals in the freezer. We pack orders for
            delivery with temperature control in mind, but frozen food should
            not be left unattended for longer than necessary.
          </>
        ),
      },
      {
        q: "My order is delayed. What should I do?",
        a: (
          <>
            Check the tracking link in your dispatch email first. If the
            delivery appears delayed or you&apos;re concerned about the
            condition of your meals, contact us at{" "}
            <a href="mailto:info@angelfood.co.nz">info@angelfood.co.nz</a> or{" "}
            <a href="tel:0800115002">0800 115 002</a>. Please include your
            order number so we can help quickly.
          </>
        ),
      },
    ],
  },
  {
    heading: "Ordering",
    questions: [
      {
        q: "Is there a minimum order?",
        a: (
          <>
            [Add the confirmed minimum order or carton size.] You&apos;ll see
            any minimum requirement before completing checkout.
          </>
        ),
      },
      {
        q: "I can't check out with my address. What should I do?",
        a: (
          <>
            First, check that your street address and postcode are correct. If
            you still can&apos;t place your order, contact us and we&apos;ll
            check whether delivery is available in your area.
          </>
        ),
      },
      {
        q: "Can I change my order?",
        a: (
          <>
            Get in touch as soon as possible with your order number. We&apos;ll
            do our best to help if your order hasn&apos;t been packed or
            dispatched.
          </>
        ),
      },
    ],
  },
  {
    heading: "Our products",
    questions: [
      {
        q: "What can I order from Angel Food?",
        a: (
          <>
            Angel Food makes plant-based cheeses, meats and ready-to-go meals.
            Our direct-delivery range will begin with meals, snap-frozen to
            lock in freshness and ready to heat when you need them.
          </>
        ),
      },
      {
        q: "Where can I buy Angel Food in stores?",
        a: (
          <>
            You can find Angel Food products at supermarkets and foodservice
            outlets across New Zealand. Visit our{" "}
            <Link href="/where-to-buy">Where to Buy</Link> page to look for a
            nearby stockist. Ranges vary by store, so it&apos;s best to check
            availability before making a special trip.
          </>
        ),
      },
      {
        q: "Where can I find ingredients and allergen information?",
        a: (
          <>
            Each product has its own ingredients, nutrition information and
            allergen details on the pack and on our{" "}
            <Link href="/ingredients-nutrition-info">
              Ingredients and Nutrition
            </Link>{" "}
            page. Please check the details for the specific product before
            eating, particularly if you have an allergy.
          </>
        ),
      },
    ],
  },
  {
    heading: "Heating and storage",
    questions: [
      {
        q: "Will my meals arrive frozen?",
        a: (
          <>
            Our meals are snap-frozen to lock in freshness and packed for
            delivery. Put them in the freezer promptly when they arrive. If a
            meal arrives thawed, warm, or with damaged packaging, contact us
            before consuming it.
          </>
        ),
      },
      {
        q: "How do I heat my meal?",
        a: (
          <>
            Follow the instructions printed on your meal&apos;s packaging.
            Heating times vary between meals and appliances. Make sure the meal
            is thoroughly heated all the way through before eating.
          </>
        ),
      },
      {
        q: "How long will my meals keep?",
        a: (
          <>
            Keep your meals frozen and follow the date and storage instructions
            printed on each pack. Those instructions take precedence over
            general guidance because they are specific to the product.
          </>
        ),
      },
      {
        q: "Can I refreeze a thawed meal?",
        a: (
          <>
            Please follow the instructions on the pack. If your delivery has
            thawed in transit and you&apos;re unsure whether it is safe to
            keep, contact us with your order number and a photo of the product.
          </>
        ),
      },
    ],
  },
];

export function HelpCentre() {
  let index = 0;

  return (
    <section className="bg-cream pb-24 sm:pb-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        {SECTIONS.map((section) => (
          <div key={section.heading} className="mt-12 first:mt-0">
            <h2 className="mb-4 font-display text-2xl font-bold tracking-[-0.02em] text-ink">
              {section.heading}
            </h2>

            <div className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
              {section.questions.map((question) => {
                const first = index++ === 0;
                return (
                  <details
                    key={question.q}
                    open={first}
                    className="group border-b border-line last:border-b-0"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink transition-colors hover:bg-cream focus-visible:bg-cream focus-visible:outline-none sm:px-6">
                      {question.q}
                      <ChevronDown
                        size={18}
                        className="shrink-0 text-green transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>
                    <div
                      className="px-5 pb-5 text-sm leading-relaxed text-ink-soft sm:px-6
                        [&_a]:font-semibold [&_a]:text-green [&_a]:underline [&_a]:decoration-green/30 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:hover:text-ink"
                    >
                      {question.a}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-12 rounded-[1.75rem] border border-line bg-paper p-6 text-center sm:p-8">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
            Still need a hand?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            We&apos;d love to help — email us, call us, or use the form on our
            contact page.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:info@angelfood.co.nz"
              className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
            >
              <Mail size={15} /> info@angelfood.co.nz
            </a>
            <a
              href="tel:0800115002"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-green transition-colors hover:bg-cream"
            >
              <Phone size={15} /> 0800 115 002
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-green transition-colors hover:bg-cream"
            >
              Contact form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
