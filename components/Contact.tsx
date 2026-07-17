"use client";

import { useState } from "react";
import { Mail, Phone, ArrowUpRight, Loader2, Check } from "lucide-react";
import { WHOLESALE } from "@/lib/site";
import { submitLead } from "@/lib/formService";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";
import { Magnetic } from "./Magnetic";

type Status = "idle" | "submitting" | "success" | "error";

const CREDIT_APP_URL = "mailto:info@angelfood.co.nz?subject=Wholesale%20credit%20application";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setError("");

    try {
      await submitLead({
        fullName: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        comment: String(data.get("message") || ""),
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong sending your message — please try again.");
    }
  }

  return (
    <section id="contact" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — contact */}
          <div>
            <Parallax amount={30}>
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                  ✦ Say hello
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink">
                  Got questions? We&apos;d love to hear from you.
                </h2>
              </Reveal>
            </Parallax>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-lg text-ink-soft">
                Drop us a line and we&apos;ll get back to you ASAP. Suggestions,
                cheese cravings, collabs — all welcome.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              {status === "success" ? (
                <div className="mt-9 flex items-center gap-3 rounded-2xl border border-green/20 bg-cream-deep px-6 py-5 text-green">
                  <Check size={20} />
                  <p className="font-medium">
                    Thanks — your message is in! We&apos;ll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-9 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-line bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-green"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email address"
                      className="w-full rounded-2xl border border-line bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-green"
                    />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Phone number"
                    className="w-full rounded-2xl border border-line bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-green"
                  />
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Your message"
                    className="w-full resize-none rounded-2xl border border-line bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-green"
                  />
                  {status === "error" && (
                    <p className="text-sm font-medium text-coral">{error}</p>
                  )}
                  <Magnetic strength={0.35} className="inline-block">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      data-cursor="send"
                      className="inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 font-semibold text-cream transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {status === "submitting" && (
                        <Loader2 size={18} className="animate-spin" />
                      )}
                      {status === "submitting" ? "Sending…" : "Send message"}
                    </button>
                  </Magnetic>
                </form>
              )}
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-ink-soft">
                <a
                  href="mailto:info@angelfood.co.nz"
                  className="inline-flex items-center gap-2 font-medium transition-colors hover:text-green"
                >
                  <Mail size={18} /> info@angelfood.co.nz
                </a>
                <a
                  href="tel:0800115002"
                  className="inline-flex items-center gap-2 font-medium transition-colors hover:text-green"
                >
                  <Phone size={18} /> 0800 115002
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — wholesale */}
          <Reveal delay={0.15} className="lg:pt-16">
            <div className="rounded-[2.5rem] bg-green p-8 text-cream sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                Wholesale &amp; food service
              </p>
              <h3 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-tight tracking-tight">
                Want to stock or cook with Angel Food?
              </h3>
              <p className="mt-4 text-cream/80">
                Use the contact form below or{" "}
                <a
                  href={CREDIT_APP_URL}
                  className="font-semibold text-gold underline underline-offset-2 hover:text-cream"
                >
                  click here
                </a>{" "}
                to apply for a wholesale account. Our products are available
                in catering sizes from{" "}
                {WHOLESALE.map((w, i) => (
                  <span key={w}>
                    {w}
                    {i < WHOLESALE.length - 2
                      ? ", "
                      : i === WHOLESALE.length - 2
                        ? " and "
                        : ""}
                  </span>
                ))}
                .
              </p>
              <Magnetic strength={0.35} className="mt-8 inline-block">
                <a
                  href={CREDIT_APP_URL}
                  data-cursor="apply"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-ink transition-transform hover:scale-[1.03]"
                >
                  Apply for a wholesale account <ArrowUpRight size={18} />
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
