"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Lock,
  Pencil,
  ShoppingCart,
} from "lucide-react";
import { AddressSearch } from "./AddressSearch";
import { OrderNotice, ProductThumb, Totals } from "./BuyNow";
import { clearOrder, useOrder } from "@/lib/cart";
import { placeOrder, rememberReceipt } from "@/lib/orders";
import type { AddressSuggestion } from "@/lib/address-search";
import {
  rememberPostcode,
  useDeliveryPostcode,
  useDeliveryRate,
} from "@/lib/delivery";
import { DELIVERY, formatPrice, islandFor, orderTotals } from "@/lib/pricing";
import { NZ_REGIONS } from "@/lib/stores";
import {
  errorsForStep,
  saveCustomer,
  stepForField,
  usePaymentCancelled,
  useSavedCustomer,
  CHECKOUT_STEPS,
  type CheckoutCustomer,
  type CheckoutStep,
  type FieldErrors,
} from "@/lib/checkout";

export function CheckoutForm() {
  const { lines, bundle, items, remaining } = useOrder();
  // The delivery step's postcode does two jobs: it says which island the
  // order is going to, which is what freight is charged on, and it is
  // looked up against the rate card to check we run a truck there at all.
  const storedPostcode = useDeliveryPostcode();
  const rateState = useDeliveryRate(storedPostcode);
  const totals = orderTotals({
    lines,
    bundle,
    island: islandFor(storedPostcode),
  });

  // What was typed here last time, and whatever has been typed since. Keeping
  // the two apart means the saved details can arrive from the browser after
  // the first render without trampling anything already being filled in.
  const saved = useSavedCustomer();
  const [edits, setEdits] = useState<Partial<CheckoutCustomer>>({});
  const customer = useMemo(() => ({ ...saved, ...edits }), [saved, edits]);

  const cancelled = usePaymentCancelled();
  const [step, setStep] = useState<CheckoutStep>("details");
  // How far they have got: steps behind this can be jumped back to, ones
  // ahead can't be skipped into.
  const [reached, setReached] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepIndex = CHECKOUT_STEPS.findIndex((s) => s.id === step);

  // Moving between steps replaces everything on the page, which a screen
  // reader has no reason to notice — so focus lands on the new heading and
  // lets it be read out. Skipped on the first render, where nothing moved.
  const landed = useRef(false);
  useEffect(() => {
    if (landed.current) headingRef.current?.focus();
    landed.current = true;
  }, [step]);

  const set = (field: keyof CheckoutCustomer) => (value: string) => {
    if (field === "postcode") rememberPostcode(value);
    setEdits((prev) => ({ ...prev, [field]: value }));
    // Clear the complaint as soon as they start fixing it, rather than
    // leaving it shouting until the next press.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  /** A picked address fills the fields; anything it can't say is left alone. */
  function applyAddress(found: AddressSuggestion) {
    setEdits((prev) => ({
      ...prev,
      // A suburb match has no street of its own — it fills in everything
      // around one, so don't wipe a street already typed.
      address1: found.address1 || prev.address1 || "",
      // Freight is quoted off this, so the store hears about it too.
      suburb: found.suburb || prev.suburb || "",
      city: found.city || prev.city || "",
      region: found.region || prev.region || "",
      postcode: found.postcode || prev.postcode || "",
    }));
    if (found.postcode) rememberPostcode(found.postcode);
    setErrors({});

    // Picking a suburb leaves exactly one thing to type; put the cursor in it.
    if (found.kind === "locality") {
      setTimeout(() => {
        formRef.current?.querySelector<HTMLElement>('[name="address1"]')?.focus();
      }, 0);
    }
  }

  function goTo(next: CheckoutStep) {
    setErrors({});
    setSubmitError("");
    setStep(next);
    setReached((prev) =>
      Math.max(
        prev,
        CHECKOUT_STEPS.findIndex((s) => s.id === next)
      )
    );
  }

  /** Checks this step, then moves on — or stops on the first thing missing. */
  function advance() {
    const found = errorsForStep(customer, step);
    setErrors(found);

    const firstBad = Object.keys(found)[0] as keyof CheckoutCustomer | undefined;
    if (firstBad) {
      // A problem from an earlier step sends them back to where it's asked.
      const owner = stepForField(firstBad);
      if (owner !== step) setStep(owner);
      // Let that step render before reaching for its field.
      setTimeout(() => {
        formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      }, 0);
      return;
    }

    // We only run trucks to the postcodes on the rate card, and rural
    // addresses are not among them. Better to say so now than to take the
    // money for a delivery we can't make.
    if (step === "delivery" && rateState.status === "not-delivered") {
      setErrors({
        postcode: "Sorry, we don't deliver here — and we can't do rural delivery.",
      });
      setTimeout(() => {
        formRef.current?.querySelector<HTMLElement>('[name="postcode"]')?.focus();
      }, 0);
      return;
    }

    goTo(CHECKOUT_STEPS[stepIndex + 1].id);
  }

  /**
   * Places the order.
   *
   * There is no payment step: the order is taken and settled with the
   * customer afterwards, which is not something the website says out loud.
   * The figures on this page are a quote — the server prices the order again
   * from the catalogue, and what it returns is what was actually charged.
   */
  async function placeTheOrder() {
    setSubmitting(true);
    setSubmitError("");
    saveCustomer(customer);

    try {
      const order = await placeOrder(customer, lines, bundle);

      // Kept before navigating so the confirmation page has something to show
      // even though the order itself is about to be cleared.
      rememberReceipt(order);
      clearOrder();

      window.location.assign(
        `/checkout/success?order=${encodeURIComponent(order.orderNumber)}` +
          `&token=${encodeURIComponent(order.trackingToken)}`
      );
    } catch (err) {
      console.error("[checkout] could not place the order:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    // One form across every step, so Enter does the obvious thing throughout.
    if (step === "review") void placeTheOrder();
    else advance();
  }

  // Nothing to pay for, or a carton that isn't exactly full — either way
  // the form has no business being here, and the cart is where it's fixed.
  if (items === 0 || !totals.bundleComplete) {
    return <NotReadyToPay items={items} bundle={bundle} remaining={remaining} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-green"
      >
        <ArrowLeft size={15} /> Back to your order
      </Link>

      <h1 className="mt-6 font-display text-[clamp(2rem,5.5vw,3.4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
        Checkout
      </h1>

      {cancelled && (
        <p className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-ink">
          Payment cancelled — nothing was charged, and your order is exactly as
          you left it.
        </p>
      )}

      <StepBar current={stepIndex} reached={reached} onJump={goTo} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <form ref={formRef} onSubmit={onSubmit} noValidate>
          <div className="rounded-[1.75rem] border border-line bg-paper p-5 sm:p-7">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-xl font-bold tracking-[-0.02em] text-ink outline-none sm:text-2xl"
            >
              {CHECKOUT_STEPS[stepIndex].heading}
            </h2>

            {/* Keyed so React swaps the whole thing on a step change, which
                replays the CSS entrance. Deliberately not an animated exit:
                that would gate the next step's fields behind an animation
                finishing, and a checkout must never depend on that. */}
            <div key={step} className="af-step mt-6">
                {step === "details" && (
                  <DetailsStep customer={customer} errors={errors} set={set} />
                )}
                {step === "delivery" && (
                  <DeliveryStep
                    customer={customer}
                    errors={errors}
                    set={set}
                    onPickAddress={applyAddress}
                  />
                )}
                {step === "review" && (
                  <ReviewStep
                    customer={customer}
                    lines={lines}
                    totals={totals}
                    rateState={rateState}
                    onEdit={goTo}
                  />
                )}
            </div>
          </div>

          {submitError && (
            <p
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-2xl border border-coral/40 bg-coral/10 px-5 py-4 text-sm text-ink"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-coral" />
              <span>{submitError}</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => goTo(CHECKOUT_STEPS[stepIndex - 1].id)}
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-green transition-colors hover:bg-paper"
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}
            <StepButton step={step} total={totals.total ?? 0} submitting={submitting} />
          </div>
        </form>

        <OrderPanel totals={totals} rateState={rateState} lines={lines} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

function StepBar({
  current,
  reached,
  onJump,
}: {
  current: number;
  reached: number;
  onJump: (step: CheckoutStep) => void;
}) {
  return (
    <ol className="mt-8 flex items-center gap-1.5 sm:gap-3">
      {CHECKOUT_STEPS.map((step, i) => {
        const done = i < current;
        const now = i === current;
        // Somewhere they have already been is somewhere they can go back to.
        const reachable = i <= reached && !now;

        const marker = (
          <>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done || now
                  ? "bg-green text-cream"
                  : "border border-line bg-paper text-ink-soft"
              } ${now ? "ring-4 ring-green/15" : ""}`}
            >
              {done ? <Check size={15} /> : i + 1}
            </span>
            <span
              className={`text-[0.7rem] font-bold uppercase tracking-[0.1em] sm:text-xs ${
                now ? "text-ink" : "text-ink-soft"
              }`}
            >
              {step.label}
            </span>
          </>
        );

        return (
          <li key={step.id} className="flex flex-1 items-center gap-1.5 sm:gap-3">
            {reachable ? (
              <button
                type="button"
                onClick={() => onJump(step.id)}
                className="flex items-center gap-2 transition-opacity hover:opacity-70"
              >
                {marker}
                <span className="sr-only">— go back to this step</span>
              </button>
            ) : (
              <span
                className="flex items-center gap-2"
                aria-current={now ? "step" : undefined}
              >
                {marker}
              </span>
            )}
            {i < CHECKOUT_STEPS.length - 1 && (
              <span
                aria-hidden
                className={`hidden h-px flex-1 sm:block ${done ? "bg-green" : "bg-line"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepButton({
  step,
  total,
  submitting,
}: {
  step: CheckoutStep;
  total: number;
  submitting: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 sm:flex-none sm:px-8"
    >
      {step !== "review" ? (
        <>
          Continue <ArrowRight size={15} />
        </>
      ) : submitting ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Placing your order…
        </>
      ) : (
        <>
          {/* Not "Pay": nothing is charged here. The button should promise
              what the next screen actually does. */}
          <Check size={16} /> Place order · {formatPrice(total)}
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

type StepProps = {
  customer: CheckoutCustomer;
  errors: FieldErrors;
  set: (field: keyof CheckoutCustomer) => (value: string) => void;
};

function DetailsStep({ customer, errors, set }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        name="firstName"
        label="First name"
        required
        value={customer.firstName}
        error={errors.firstName}
        onChange={set("firstName")}
        autoComplete="given-name"
      />
      <Field
        name="lastName"
        label="Last name"
        required
        value={customer.lastName}
        error={errors.lastName}
        onChange={set("lastName")}
        autoComplete="family-name"
      />
      <Field
        name="email"
        label="Email"
        type="email"
        required
        value={customer.email}
        error={errors.email}
        onChange={set("email")}
        autoComplete="email"
        hint="Your receipt and delivery updates go here."
      />
      <Field
        name="phone"
        label="Phone"
        type="tel"
        required
        value={customer.phone}
        error={errors.phone}
        onChange={set("phone")}
        autoComplete="tel"
        hint="In case the courier needs to reach you."
      />
      <div className="sm:col-span-2">
        <Field
          name="company"
          label="Company"
          optional
          value={customer.company}
          onChange={set("company")}
          autoComplete="organization"
        />
      </div>
    </div>
  );
}

function DeliveryStep({
  customer,
  errors,
  set,
  onPickAddress,
}: StepProps & { onPickAddress: (address: AddressSuggestion) => void }) {
  return (
    <>
      <div className="mb-6">
        <AddressSearch onPick={onPickAddress} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            name="address1"
            label="Street address"
            required
            value={customer.address1}
            error={errors.address1}
            onChange={set("address1")}
            autoComplete="address-line1"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            name="address2"
            label="Apartment, unit, floor"
            optional
            value={customer.address2}
            onChange={set("address2")}
            autoComplete="address-line2"
          />
        </div>
        <Field
          name="suburb"
          label="Suburb"
          optional
          value={customer.suburb}
          onChange={set("suburb")}
          autoComplete="address-level3"
        />
        <Field
          name="city"
          label="Town or city"
          required
          value={customer.city}
          error={errors.city}
          onChange={set("city")}
          autoComplete="address-level2"
        />
        <SelectField
          name="region"
          label="Region"
          optional
          value={customer.region}
          onChange={set("region")}
          options={NZ_REGIONS}
        />
        <Field
          name="postcode"
          label="Postcode"
          required
          inputMode="numeric"
          value={customer.postcode}
          error={errors.postcode}
          onChange={set("postcode")}
          autoComplete="postal-code"
        />
        <div className="sm:col-span-2">
          <Field
            name="deliveryNotes"
            label="Delivery instructions"
            optional
            multiline
            value={customer.deliveryNotes}
            onChange={set("deliveryNotes")}
            hint="Where to leave it, gate codes, a safe spot."
          />
        </div>
      </div>

      <p className="mt-5 text-xs text-ink-soft">
        New Zealand only: {formatPrice(DELIVERY.northIsland)} to the North
        Island, {formatPrice(DELIVERY.southIsland)} to the South, and free on
        orders of {DELIVERY.freeFrom}. Sorry, no rural delivery.
      </p>
    </>
  );
}

function ReviewStep({
  customer,
  lines,
  totals,
  rateState,
  onEdit,
}: {
  customer: CheckoutCustomer;
  lines: ReturnType<typeof useOrder>["lines"];
  totals: ReturnType<typeof orderTotals>;
  rateState: ReturnType<typeof useDeliveryRate>;
  onEdit: (step: CheckoutStep) => void;
}) {
  const addressLines = [
    customer.address1,
    customer.address2,
    [customer.suburb, customer.city].filter(Boolean).join(", "),
    [customer.region, customer.postcode].filter(Boolean).join(" "),
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <ReviewCard title="Your details" onEdit={() => onEdit("details")}>
        <p className="font-semibold text-ink">
          {customer.firstName} {customer.lastName}
        </p>
        {customer.company && <p>{customer.company}</p>}
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
      </ReviewCard>

      <ReviewCard title="Delivering to" onEdit={() => onEdit("delivery")}>
        {addressLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>New Zealand</p>
        {customer.deliveryNotes && (
          <p className="mt-2 italic">“{customer.deliveryNotes}”</p>
        )}
      </ReviewCard>

      {/* The panel beside this carries the same figures on a wide screen; on a
          phone it is folded away up top, so the order is repeated here where
          it matters most — right before paying. */}
      <section className="rounded-2xl border border-line bg-cream p-4 sm:p-5 lg:hidden">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-green">
          Your order
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          {lines.map((line) => (
            <li key={line.code} className="flex justify-between gap-3">
              <span className="text-ink-soft">
                {line.quantity} × {line.name}
              </span>
              <span className="shrink-0 font-semibold text-ink">
                {formatPrice(line.quantity * line.unitPrice)}
              </span>
            </li>
          ))}
        </ul>
        <Totals totals={totals} rateState={rateState} className="mt-3 border-t border-line pt-3" />
      </section>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
        <Lock size={13} className="mt-0.5 shrink-0 text-green" />
        We&apos;ll email your confirmation straight away, and again each time
        your order moves. Nothing is charged on this page.
      </p>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-cream p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-green">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-green"
        >
          <Pencil size={12} /> Edit<span className="sr-only"> {title}</span>
        </button>
      </div>
      <div className="mt-2.5 space-y-0.5 text-sm text-ink-soft">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Order summary                                                       */
/* ------------------------------------------------------------------ */

function OrderPanel({
  lines,
  totals,
  rateState,
}: {
  lines: ReturnType<typeof useOrder>["lines"];
  totals: ReturnType<typeof orderTotals>;
  rateState: ReturnType<typeof useDeliveryRate>;
}) {
  // On a phone the order would push the form itself below the fold, so it
  // starts folded away behind its own total — and sits open on a wide screen,
  // where there is a column going spare.
  const [open, setOpen] = useState(false);

  return (
    <aside className="order-first lg:order-none lg:sticky lg:top-32 lg:h-fit">
      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="order-panel-lines"
          className="flex w-full items-center justify-between gap-3 p-5 text-left lg:hidden"
        >
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-green">
            Your order
            <span className="ml-2 font-medium normal-case tracking-normal text-ink-soft">
              ({totals.items} {totals.items === 1 ? "meal" : "meals"})
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="font-display text-lg font-extrabold text-ink">
              {totals.total === null ? "—" : formatPrice(totals.total)}
            </span>
            <ChevronDown
              size={16}
              className={`text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        <h2 className="hidden px-6 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-green lg:block">
          Your order
        </h2>

        <div
          id="order-panel-lines"
          className={`px-5 pb-5 sm:px-6 sm:pb-6 ${open ? "block" : "hidden"} lg:block`}
        >
          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <li key={line.code} className="flex items-center gap-3 py-3 lg:first:pt-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <ProductThumb src={line.image} name={line.name} sizes="48px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{line.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {line.quantity} × {formatPrice(line.unitPrice)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-ink">
                  {formatPrice(line.quantity * line.unitPrice)}
                </span>
              </li>
            ))}
          </ul>

          <Totals
            totals={totals}
            rateState={rateState}
            className="mt-4 border-t border-line pt-4"
          />
          <p className="mt-1.5 text-xs text-ink-soft">
            GST included. Delivery is a flat{" "}
            {formatPrice(DELIVERY.northIsland)} North Island,{" "}
            {formatPrice(DELIVERY.southIsland)} South — free on{" "}
            {DELIVERY.freeFrom}.
          </p>
          <OrderNotice totals={totals} rateState={rateState} className="mt-4" />

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
            <Lock size={12} /> We&apos;ll confirm your order by email.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */

const fieldClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-cream px-3.5 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-green focus:ring-2 focus:ring-green/15 ${
    invalid ? "border-coral" : "border-line"
  }`;

function Field({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  required = false,
  optional = false,
  multiline = false,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
}) {
  const describedBy = [error ? `${name}-error` : null, hint ? `${name}-hint` : null]
    .filter(Boolean)
    .join(" ");

  const shared = {
    id: name,
    name,
    value,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    autoComplete,
    className: fieldClass(!!error),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>}
      </label>

      {multiline ? (
        <textarea {...shared} rows={3} className={`${fieldClass(!!error)} resize-y`} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} />
      )}

      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-coral"
        >
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  optional = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass(false)}
      >
        <option value="">Choose a region</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty                                                               */
/* ------------------------------------------------------------------ */

function NotReadyToPay({
  items,
  bundle,
  remaining,
}: {
  items: number;
  bundle: number;
  remaining: number;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-line bg-paper text-ink-soft">
        <ShoppingCart size={26} />
      </div>
      <h1 className="mt-8 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
        {items === 0
          ? "Nothing to pay for"
          : remaining > 0
            ? "Not quite a full carton"
            : "That's a carton and a bit"}
      </h1>
      <p className="mt-5 text-lg text-ink-soft">
        {items === 0
          ? `Your order is empty — pick ${bundle} meals to get started.`
          : remaining > 0
            ? `${remaining} more and your ${bundle}-meal carton is full.`
            : `That's ${-remaining} too many for a ${bundle}-meal carton.`}
      </p>
      <Link
        href="/buy-now"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-green px-8 py-4 font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.04]"
      >
        Shop meals
      </Link>
    </div>
  );
}
