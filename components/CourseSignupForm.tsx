"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { submitLead, preloadRecaptcha } from "@/lib/formService";
import { RecaptchaNotice } from "./RecaptchaNotice";

type Status = "idle" | "submitting" | "success" | "error";

/** Email capture for the free "Cheese Made Easy (and Dairy-Free)" mini course. */
export function CourseSignupForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "");

    setStatus("submitting");
    try {
      await submitLead({
        fullName: "",
        email,
        phone: "",
        comment: "Cheese Made Easy (and Dairy-Free) — 4-day email course signup",
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-10 flex items-center gap-2 font-semibold text-green">
        <Check size={18} /> You&apos;re in — check your inbox for day one!
      </p>
    );
  }

  return (
    <div className="mt-10">
      <form
        onSubmit={handleSubmit}
        onFocus={preloadRecaptcha}
        className="max-w-md"
      >
        <label
          htmlFor="course-email"
          className="block text-sm font-semibold text-ink"
        >
          Email <span className="font-normal text-ink-soft">(required)</span>
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="course-email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className="w-full rounded-full border border-line bg-paper px-6 py-4 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-green"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-green px-7 py-4 font-semibold uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.04] disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "submitting" && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {status === "submitting" ? "Sending…" : "Show me how!"}
          </button>
        </div>
        <RecaptchaNotice className="mt-4" />
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm font-medium text-coral">
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}
