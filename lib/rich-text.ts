/**
 * Formatted text for recipe descriptions and notes.
 *
 * The dashboard's editor saves a small subset of HTML — paragraphs, line
 * breaks, bold, italic, lists, links, headings and tables — into the same
 * text fields that used to hold plain text, so the API needs no change. Older recipes are still
 * plain text with newlines, and everything here handles both.
 *
 * Nothing is trusted: whatever comes back from the API is rebuilt tag by tag
 * from an allowlist before it is shown, so a stray <script> or onclick never
 * reaches the page. This runs without a DOM, so it works in the static build
 * as well as in the browser.
 */

import { SITE_URL } from "./site";

/** Tags the editor may produce, mapped to what they are stored/shown as. */
const ALLOWED: Record<string, string> = {
  p: "p",
  div: "p",
  br: "br",
  strong: "strong",
  b: "strong",
  em: "em",
  i: "em",
  ul: "ul",
  ol: "ol",
  li: "li",
  a: "a",
  // The recipe title is the page's only <h1>, so a heading 1 written in the
  // editor is kept one level down.
  h1: "h2",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  table: "table",
  thead: "thead",
  tbody: "tbody",
  tr: "tr",
  th: "th",
  td: "td",
};

/** Tags whose content is dropped along with them. */
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "noscript", "template"]);

const VOID = new Set(["br"]);

/** Blocks that can be aligned left, centre or right. */
const ALIGNABLE = new Set(["p", "h2", "h3", "h4", "h5", "h6", "li", "th", "td"]);

/** The sizes a table can be given in the editor. */
export const TABLE_WIDTHS = new Set(["full", "three-quarter", "half", "fit"]);
export const TABLE_ROWS = new Set(["compact", "normal", "tall"]);

/** True when the text was written in the editor rather than as plain text. */
export function isRichText(value: string | null | undefined): boolean {
  return !!value && /<\/?(p|div|br|strong|b|em|i|ul|ol|li|a|h[1-6]|table)\b[^>]*>/i.test(value);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Only web links, mail links and links within this site are kept. */
function safeHref(raw: string): string | null {
  const href = decodeEntities(raw).trim();
  if (/^(https?:\/\/|mailto:)/i.test(href)) return href;
  if (/^[/#]/.test(href) && !href.startsWith("//")) return href;
  return null;
}

function isExternal(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    const own = new URL(SITE_URL).hostname.replace(/^www\./, "");
    return host !== own;
  } catch {
    return true;
  }
}

/**
 * Rebuilds the HTML from the allowlist. With `forDisplay`, links leaving the
 * site also open in a new tab; what is saved stays free of that.
 */
export function sanitizeRichText(html: string, { forDisplay = false } = {}): string {
  const out: string[] = [];
  const open: string[] = [];
  const token = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|([^<]+)|</g;
  let dropping: string | null = null;
  let m: RegExpExecArray | null;

  while ((m = token.exec(html))) {
    const [whole, rawTag, attrs, text] = m;

    if (dropping) {
      if (rawTag && whole.startsWith("</") && rawTag.toLowerCase() === dropping) dropping = null;
      continue;
    }

    if (text !== undefined || whole === "<") {
      out.push(escapeHtml(decodeEntities(text ?? whole)));
      continue;
    }
    if (!rawTag) continue; // a comment

    const tag = rawTag.toLowerCase();
    const closing = whole.startsWith("</");

    if (DROP_WITH_CONTENT.has(tag)) {
      if (!closing && !whole.endsWith("/>")) dropping = tag;
      continue;
    }

    const mapped = ALLOWED[tag];
    if (!mapped) continue; // unknown tag: keep its text, lose the tag

    if (VOID.has(mapped)) {
      if (!closing) out.push("<br>");
      continue;
    }

    if (closing) {
      const at = open.lastIndexOf(mapped);
      if (at === -1) continue;
      while (open.length > at) out.push(`</${open.pop()}>`);
      continue;
    }

    if (mapped === "a") {
      const hrefMatch = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
      const href = hrefMatch ? safeHref(hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "") : null;
      if (!href) continue; // a link with nowhere safe to go is just text
      const extra =
        forDisplay && isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
      out.push(`<a href="${escapeHtml(href)}"${extra}>`);
    } else if (mapped === "table") {
      // Size is chosen from fixed options, never free-form styles.
      const width = /\sdata-width\s*=\s*["']?([a-z-]+)/i.exec(attrs)?.[1];
      const rows = /\sdata-rows\s*=\s*["']?([a-z-]+)/i.exec(attrs)?.[1];
      const size =
        (width && TABLE_WIDTHS.has(width) ? ` data-width="${width}"` : "") +
        (rows && TABLE_ROWS.has(rows) ? ` data-rows="${rows}"` : "");
      out.push(`<table${size}>`);
    } else if (ALIGNABLE.has(mapped)) {
      // Text alignment is the one style kept, and only these four values.
      const align =
        /text-align\s*:\s*(left|center|right|justify)/i.exec(attrs)?.[1] ??
        /\salign\s*=\s*["']?(left|center|right|justify)/i.exec(attrs)?.[1];
      const lower = align?.toLowerCase();
      out.push(
        lower && lower !== "left" ? `<${mapped} style="text-align:${lower}">` : `<${mapped}>`
      );
    } else {
      out.push(`<${mapped}>`);
    }
    open.push(mapped);
  }
  while (open.length) out.push(`</${open.pop()}>`);

  const clean = out
    .join("")
    // Paragraphs and list items the editor leaves behind when emptied.
    .replace(/<(p|li|strong|em|h[2-6])>(\s|<br>)*<\/\1>/g, "")
    .replace(/<(ul|ol)>\s*<\/\1>/g, "")
    .trim();

  return richTextToPlain(clean) ? clean : "";
}

/** Plain text written before the editor, turned into editor HTML. */
export function plainToRichText(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Editor HTML for a stored value, whichever form it was saved in. */
export function toEditorHtml(value: string | null | undefined): string {
  if (!value) return "";
  return isRichText(value) ? sanitizeRichText(value) : plainToRichText(value);
}

/**
 * The words alone — for meta descriptions, schema, cards and search, where
 * markup has no place.
 */
export function richTextToPlain(value: string | null | undefined): string {
  if (!value) return "";
  if (!isRichText(value)) return value.trim();
  return decodeEntities(
    value
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|div|li|ul|ol|h[1-6]|t[dhr])>/gi, " ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}
