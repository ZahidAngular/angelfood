/**
 * Attribution for reCAPTCHA v3, shown under each form's submit button.
 *
 * v3 has no widget of its own — no checkbox, no puzzle — so the only thing a
 * visitor can see is Google's floating badge. That badge is hidden in
 * globals.css, which Google's branding terms permit on one condition: this
 * attribution has to appear wherever reCAPTCHA runs instead. The two go
 * together — hiding the badge without this line breaks the terms.
 *
 * `tone` picks the palette rather than the caller passing raw colours, so the
 * three forms can't drift apart: "light" for the cream-on-green footer,
 * "dark" for forms on paper.
 */
export function RecaptchaNotice({
  tone = "dark",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const base = tone === "light" ? "text-cream/55" : "text-ink-soft/70";
  const link =
    tone === "light"
      ? "text-cream/75 hover:text-cream"
      : "text-ink-soft hover:text-green";

  return (
    <p className={`text-[0.6875rem] leading-relaxed ${base} ${className}`}>
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 transition-colors ${link}`}
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 transition-colors ${link}`}
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
