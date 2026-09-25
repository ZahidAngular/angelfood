"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  PackageX,
  RefreshCw,
  Truck,
} from "lucide-react";
import { ProductThumb } from "./BuyNow";
import { formatPrice } from "@/lib/pricing";
import { useHydrated } from "@/lib/use-hydrated";
import {
  fetchTracking,
  readReceipt,
  OrderNotFoundError,
  type OrderTracking as Tracking,
} from "@/lib/orders";

/** How often an open tracking page re-asks where the order has got to. */
const POLL_MS = 60_000;

/**
 * Following an order.
 *
 * Reachable with nothing but the link from the confirmation email: the order
 * number and its token are both in the URL, so there is no account to make and
 * no password to forget. The page then keeps itself current while it is open,
 * because the thing people do with a tracking page is leave it open.
 */
/**
 * The order to follow, from the URL.
 *
 * Memoised on the query string because reading it has to give the same object
 * every render — a fresh one each time would restart the fetch effect forever.
 */
let cachedSearch: string | null = null;
let cachedKey: { order: string; token: string } | null = null;

function readKey() {
  const search = window.location.search;
  if (search === cachedSearch) return cachedKey;

  cachedSearch = search;
  const params = new URLSearchParams(search);
  const order = params.get("order");
  const token = params.get("token");

  if (order && token) {
    cachedKey = { order, token };
  } else {
    // Falling back to the last order kept on this device means "track my
    // order" works from the same browser without going back to the email.
    const saved = readReceipt();
    cachedKey = saved
      ? { order: saved.orderNumber, token: saved.trackingToken }
      : null;
  }

  return cachedKey;
}

export function OrderTracking() {
  const [data, setData] = useState<Tracking | null>(null);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [nudge, setNudge] = useState(0);

  // The link lives in the address bar, which the server cannot see. Reading it
  // during the first render would have the server draw "no link" and the
  // browser draw the spinner — a hydration mismatch. So both draw the spinner
  // until hydration is done, and only then is the URL consulted.
  const hydrated = useHydrated();
  const key = useMemo(() => (hydrated ? readKey() : null), [hydrated]);

  // Derived rather than stored, so no effect has to correct it afterwards.
  const loading = !hydrated || (key !== null && data === null && error === "");

  // Whether anything is on screen yet, as a ref so a failed background refresh
  // can check it without making `load` depend on `data` — which would rebuild
  // the poll on every successful tick.
  const showing = useRef(false);

  const load = useCallback(
    async (quiet: boolean) => {
      if (!key) return;
      if (quiet) setRefreshing(true);

      try {
        const next = await fetchTracking(key.order, key.token);
        showing.current = true;
        setData(next);
        setError("");
      } catch (err) {
        // A refresh that fails leaves what is already on screen alone — a
        // dropped connection should not blank out an order someone is reading.
        if (!quiet || !showing.current) {
          setError(
            err instanceof OrderNotFoundError
              ? err.message
              : "We couldn't reach the order right now. Try again in a moment."
          );
        }
      } finally {
        setRefreshing(false);
      }
    },
    [key]
  );

  // The fetch, and the poll that keeps it current. One effect, because they
  // are the same job: ask now, then keep asking while the tab is watched. A
  // backgrounded tab polling all night is just noise on someone's data plan.
  useEffect(() => {
    if (!key) return;

    let stopped = false;
    const ask = (quiet: boolean) => {
      if (!stopped) void load(quiet);
    };

    ask(false);

    const onVisible = () => {
      if (document.visibilityState === "visible") ask(true);
    };

    const timer = window.setInterval(onVisible, POLL_MS);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [key, load, nudge]);

  /** The Refresh button, routed through the same effect. */
  const refresh = () => setNudge((n) => n + 1);

  if (loading) {
    return (
      <Centered>
        <Loader2 size={26} className="animate-spin text-green" />
        <p className="mt-4 text-sm text-ink-soft">Finding your order…</p>
      </Centered>
    );
  }

  if (!key) return <NoLink />;
  if (error && !data) return <Problem message={error} />;
  if (!data) return null;

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">
          Order {data.orderNumber}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5.5vw,3.2rem)] font-extrabold leading-[1] tracking-[-0.03em] text-ink">
          {data.isCancelled
            ? "This order was cancelled."
            : `${greeting(data.firstName)}${data.statusHeadline}.`}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          {data.statusDescription}
        </p>
      </header>

      {error && (
        <p className="mt-6 flex items-start gap-2 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-gold" />
          {error}
        </p>
      )}

      {data.isCancelled ? (
        <div className="mt-8 rounded-[1.75rem] border border-coral/30 bg-coral/10 p-6 text-center">
          <PackageX size={26} className="mx-auto text-coral" />
          <p className="mt-3 text-sm leading-relaxed text-ink">
            If that&apos;s a surprise, email{" "}
            <a href="mailto:info@angelfood.co.nz" className="font-semibold underline">
              info@angelfood.co.nz
            </a>{" "}
            quoting {data.orderNumber}
            {" and we'll sort it out."}
          </p>
        </div>
      ) : (
        <Ladder steps={data.steps} />
      )}

      {data.trackingReference && !data.isCancelled && (
        <div className="mt-6 rounded-2xl border border-line bg-paper px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-green">
            Courier consignment
          </p>
          <p className="mt-1 font-semibold text-ink">
            {data.trackingUrl ? (
              <a
                href={data.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green underline"
              >
                {data.trackingReference} <ArrowRight size={14} />
              </a>
            ) : (
              data.trackingReference
            )}
          </p>
        </div>
      )}

      <section className="mt-8 rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-green">
            Your {data.bundleSize}-meal carton
          </h2>
          {refreshing && <Loader2 size={13} className="animate-spin text-ink-soft" />}
        </div>

        <ul className="mt-4 divide-y divide-line">
          {data.lines.map((line, i) => (
            <li key={`${line.productName}-${i}`} className="flex items-center gap-3 py-3 first:pt-0">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream">
                <ProductThumb
                  src={line.image}
                  name={line.productName || "?"}
                  sizes="48px"
                  className="text-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {line.productName}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {line.quantity} × {formatPrice(line.unitPrice)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-ink">
                {formatPrice(line.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">{data.itemCount} meals</dt>
            <dd className="font-semibold text-ink">{formatPrice(data.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              Delivery{data.island ? ` (${data.island})` : ""}
            </dt>
            <dd className="font-semibold text-ink">
              {data.deliveryCharge === 0 ? (
                <span className="text-green">Free</span>
              ) : (
                formatPrice(data.deliveryCharge)
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-2.5">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-display text-2xl font-extrabold text-ink">
              {formatPrice(data.total)}
            </dd>
          </div>
        </dl>

        {data.deliverTo && (
          <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
            Delivering to <span className="font-semibold text-ink">{data.deliverTo}</span>
            {data.deliveryDay && (
              <>
                , usually on a{" "}
                <span className="font-semibold text-ink">{data.deliveryDay}</span>
              </>
            )}
            .
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-green transition-colors hover:bg-paper disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
        <Link
          href="/buy-now"
          className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.03]"
        >
          Order again
        </Link>
      </div>
    </div>
  );
}

const greeting = (firstName: string | null) =>
  firstName ? `${firstName}, ` : "";

/** The journey, with everything reached so far ticked off. */
function Ladder({ steps }: { steps: Tracking["steps"] }) {
  return (
    <ol className="mt-8 rounded-[1.75rem] border border-line bg-paper p-5 sm:p-6">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.statusId} className="flex gap-4">
            {/* The rail is drawn per row rather than behind the list, so it
                stops cleanly at the last rung instead of running past it. */}
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  step.current
                    ? "border-green bg-green text-cream"
                    : step.reached
                      ? "border-green bg-green/10 text-green"
                      : "border-line bg-cream text-ink-soft/40"
                }`}
              >
                {step.reached ? <Check size={15} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </span>
              {!last && (
                <span
                  className={`w-0.5 flex-1 ${step.reached ? "bg-green/40" : "bg-line"}`}
                  style={{ minHeight: "1.75rem" }}
                />
              )}
            </div>

            <div className={last ? "pb-0 pt-1" : "pb-6 pt-1"}>
              <p
                className={`text-sm font-bold ${
                  step.reached ? "text-ink" : "text-ink-soft/60"
                }`}
              >
                {step.label}
              </p>
              {step.reachedDate && (
                <p className="mt-0.5 text-xs text-ink-soft">
                  {formatWhen(step.reachedDate)}
                </p>
              )}
              {step.note && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The server sends UTC. Rendered in the reader's own timezone, which for a
 * New Zealand customer is the difference between "8pm yesterday" and the
 * morning it actually happened.
 */
function formatWhen(iso: string): string {
  const stamp = iso.endsWith("Z") ? iso : `${iso}Z`;
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8">
      {children}
    </div>
  );
}

function NoLink() {
  return (
    <Centered>
      <Truck size={30} className="text-green" />
      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
        Track your order
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Open the <strong>Track this order</strong> link in your confirmation
        email — it carries everything we need to find it.
      </p>
      <Link
        href="/buy-now"
        className="mt-8 inline-flex rounded-full bg-green px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream"
      >
        Shop the range
      </Link>
    </Centered>
  );
}

function Problem({ message }: { message: string }) {
  return (
    <Centered>
      <AlertCircle size={30} className="text-coral" />
      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
        We couldn&apos;t find that order
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">{message}</p>
      <p className="mt-3 max-w-md text-sm text-ink-soft">
        Still stuck? Email{" "}
        <a href="mailto:info@angelfood.co.nz" className="font-semibold text-green underline">
          info@angelfood.co.nz
        </a>{" "}
        and we&apos;ll look it up.
      </p>
    </Centered>
  );
}
