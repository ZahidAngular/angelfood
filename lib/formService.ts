
const RECAPTCHA_SITE_KEY = "6LcSZSAkAAAAAFxJ_WfOQl4itrBsLPDcVkGGRmtI";


const ENABLE_RECAPTCHA = false;

const LEAD_API_URL = "https://webapi.webappconsulting.com.au/api/contactus/save";
const WEBSITE_ID = "27";
const FORM_TYPE = "1";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let recaptchaPromise: Promise<void> | null = null;

function loadRecaptcha(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is only available in the browser."));
  }
  if (window.grecaptcha) return Promise.resolve();
  if (recaptchaPromise) return recaptchaPromise;

  recaptchaPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    // script.src = https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY};
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      recaptchaPromise = null; // allow a retry on the next attempt
      reject(new Error("Could not load reCAPTCHA."));
    };
    document.head.appendChild(script);
  });
  return recaptchaPromise;
}

/** Reject if a promise hasn't settled within ms (so the form never hangs). */
function withTimeout<T>(p: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(message)), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      },
    );
  });
}

/** Resolve a fresh reCAPTCHA v3 token for the given action. */
function getRecaptchaToken(action = "submit"): Promise<string> {
  const token = new Promise<string>((resolve, reject) => {
    const gre = window.grecaptcha;
    if (!gre) {
      reject(new Error("reCAPTCHA is not ready."));
      return;
    }
    // ready()/execute() can in rare cases never settle (partial init) — the
    // timeout guarantees submitLead() rejects instead of hanging the form.
    gre.ready(() => {
      gre.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve).catch(reject);
    });
  });
  return withTimeout(token, 12000, "reCAPTCHA timed out.");
}

export interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  /** Free-text comment — we fold the city + message into this single field. */
  comment: string;
}

/**
 * Submit a lead to the WebAppConsulting CRM with a reCAPTCHA token. Throws on
 * failure (load error, token error, or non-2xx response) so the caller can
 * surface an error and decide whether to continue.
 */
export async function submitLead(data: LeadData): Promise<void> {
  let token = "";
  if (ENABLE_RECAPTCHA) {
    await loadRecaptcha();
    token = await getRecaptchaToken("submit");
  }

  const payload = {
    FullName: data.fullName,
    Email: data.email,
    Phone: data.phone,
    Comment: data.comment,
    WebSiteId: WEBSITE_ID,
    FormType: FORM_TYPE,
    RecaptchaToken: token,
  };

  const res = await fetch(LEAD_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit lead: ${res.statusText}`);
  }
}