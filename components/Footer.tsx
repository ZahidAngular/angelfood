"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ArrowUpRight, Loader2, Check } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { submitLead } from "@/lib/formService";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialIcons";

type Status = "idle" | "submitting" | "success" | "error";

export function Footer() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "");

    setStatus("submitting");
    try {
      await submitLead({
        fullName: "",
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
    <footer className="bg-green text-cream">
      {/* Newsletter band */}
      <div className="border-b border-cream/15">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,5vw,3.8rem)] font-extrabold leading-[0.98] tracking-tight">
              Join the good <span className="text-gold">stuff.</span>
            </h2>
            <p className="mt-4 max-w-md text-cream/75">
              Recipes, new drops and the occasional cheesy pun — straight to your
              inbox. No spam, promise.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {status === "success" ? (
              <p className="flex items-center gap-2 font-medium text-gold">
                <Check size={18} /> You&apos;re in — welcome to the good stuff!
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-full border border-cream/20 bg-cream/[0.06] px-6 py-4 text-cream placeholder:text-cream/50 outline-none transition-colors focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-ink-on-accent transition-transform hover:scale-[1.04] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {status === "submitting" && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {status === "submitting" ? "Joining…" : "Subscribe"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm font-medium text-coral">
                Something went wrong — please try again.
              </p>
            )}
          </Reveal>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo.png"
              alt="Angel Food"
              width={120}
              height={120}
              className="h-24 w-auto [filter:brightness(0)_invert(1)]"
            />
            <p className="mt-4 max-w-xs text-cream/70">
              Aotearoa&apos;s original vegan cheese company, leading the way since
              2006. Doing good should taste incredible.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLinks
                size={18}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-gold hover:text-ink-on-accent"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-cream/80 transition-colors hover:text-cream"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Say hello
            </p>
            <ul className="mt-5 space-y-3 text-cream/80">
              <li>
                <a
                  href="mailto:info@angelfood.co.nz"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <Mail size={16} /> info@angelfood.co.nz
                </a>
              </li>
              <li>
                <a
                  href="tel:0800115002"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <Phone size={16} /> 0800 115002
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-8 text-sm text-cream/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Angel Food. Made with kindness in Aotearoa.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-cream">
              Privacy policy
            </Link>
            <Link href="/terms-of-website-use" className="hover:text-cream">
              Terms of website use
            </Link>
            <Link href="/terms-and-conditions-of-trade" className="hover:text-cream">
              Terms &amp; conditions of trade
            </Link>
            <Link href="/social-media-giveaway-terms" className="hover:text-cream">
              Social media giveaway Ts &amp; Cs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
