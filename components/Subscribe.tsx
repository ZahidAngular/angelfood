"use client";

import { useState } from "react";
import Image from "next/image";
import { ChefHat, Gift, Loader2, Check, Sparkles } from "lucide-react";
import { submitLead, preloadRecaptcha } from "@/lib/formService";
import { RecaptchaNotice } from "./RecaptchaNotice";
import { Reveal } from "./Reveal";

type Status = "idle" | "submitting" | "success" | "error";

const PERKS = [
  {
    icon: ChefHat,
    title: "New recipes first",
    body: "Fresh plant-based recipes straight from our kitchen, before they hit the blog.",
  },
  {
    icon: Gift,
    title: "Exclusive drops & offers",
    body: "Be the first to know about new products, restocks and subscriber-only deals.",
  },
  {
    icon: Sparkles,
    title: "The occasional cheesy pun",
    body: "A short, friendly email — never a flood of marketing noise.",
  },
];

const FAQS = [
  {
    q: "How often will I hear from you?",
    a: "Roughly once or twice a month — new recipes, new products and the occasional offer. Never a daily inbox flood.",
  },
  {
    q: "Can I unsubscribe easily?",
    a: "Yes, any time. Every email has a one-click unsubscribe link at the bottom, no questions asked.",
  },
  {
    q: "Is my email kept private?",
    a: "Always. We never sell or share your details with third parties — it's used only to send you the Angel Food newsletter.",
  },
  {
    q: "What if I'm already a customer?",
    a: "Even better — you'll get first look at new products and recipes before they go live anywhere else.",
  },
];

export function Subscribe() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const fullName = String(data.get("name") || "");

    setStatus("submitting");
    try {
      await submitLead({
        fullName,
        email,
        phone: "",
        comment: "Newsletter signup",
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden bg-cream pb-24 sm:pb-32">
      <div className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-green-bright/15 blur-[130px]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Perks */}
        <div>
          <Reveal>
            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-[2rem] border border-line">
              <Image
                src="/images/recipes/choc-cherry-cake.webp"
                alt="Chocolate cherry cake made with Angel Food sour cream"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="space-y-4">
            {PERKS.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <Reveal key={perk.title} delay={i * 0.08}>
                  <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper/70 p-5 transition-colors hover:bg-paper">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green/25 bg-green/5 text-green">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold tracking-tight text-ink">
                        {perk.title}
                      </p>
                      <p className="mt-1 text-ink-soft">{perk.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Form card */}
        <Reveal delay={0.15} className="h-full">
          <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] border border-line bg-green p-8 text-cream shadow-[0_24px_60px_-24px_rgba(20,66,44,0.45)] sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/25 blur-[90px]" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                ✦ Free, always
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight">
                Get the good stuff in your inbox.
              </h2>
              <p className="mt-4 text-cream/75">
                No spam, no third parties, unsubscribe anytime — just the
                occasional email worth opening.
              </p>

              {status === "success" ? (
                <p className="mt-8 flex items-center gap-2 font-semibold text-gold">
                  <Check size={20} /> You&apos;re in — welcome to the good stuff!
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  onFocus={preloadRecaptcha}
                  className="mt-8 flex flex-col gap-3"
                >
                  <input
                    name="name"
                    type="text"
                    placeholder="First name (optional)"
                    className="w-full rounded-full border border-cream/20 bg-cream/[0.08] px-6 py-4 text-cream placeholder:text-cream/50 outline-none transition-colors focus:border-gold"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="w-full rounded-full border border-cream/20 bg-cream/[0.08] px-6 py-4 text-cream placeholder:text-cream/50 outline-none transition-colors focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-ink transition-transform hover:scale-[1.04] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {status === "submitting" && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {status === "submitting" ? "Joining…" : "Subscribe"}
                  </button>
                </form>
              )}

              {status === "error" && (
                <p className="mt-3 text-sm font-medium text-coral">
                  Something went wrong — please try again.
                </p>
              )}

              {status !== "success" && (
                <RecaptchaNotice tone="light" className="mt-4" />
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* FAQ */}
      <div className="relative mx-auto mt-12 max-w-6xl px-5 sm:px-8">
        <div className="rounded-[2rem] border border-line bg-paper p-8 sm:p-12">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-coral">
              ✦ Good to know
            </p>
          </Reveal>
          <div className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="flex gap-4">
                  <span className="font-display text-2xl font-extrabold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold tracking-tight text-ink">
                      {item.q}
                    </p>
                    <p className="mt-2 text-ink-soft">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
