import { cn } from "@/lib/utils";
import { isRichText, sanitizeRichText } from "@/lib/rich-text";

/** Styling for the tags the editor can produce. */
const RICH_TEXT_STYLES = [
  "[&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1",
  "[&_strong]:font-semibold [&_strong]:text-ink",
  "[&_a]:font-medium [&_a]:text-green [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-green/80",
  "[&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink",
  "[&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink",
  "[&_h4]:mt-4 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-ink",
  "[&_h5]:mt-3 [&_h5]:text-sm [&_h5]:font-bold [&_h5]:text-ink",
  "[&_h6]:mt-3 [&_h6]:text-xs [&_h6]:font-bold [&_h6]:uppercase [&_h6]:tracking-wider [&_h6]:text-ink",
  "[&_:is(h2,h3,h4,h5,h6):first-child]:mt-0",
  // Wide tables scroll sideways on a phone instead of stretching the page.
  "overflow-x-auto",
  "[&_table]:mt-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "md:[&_table[data-width=three-quarter]]:w-3/4 md:[&_table[data-width=half]]:w-1/2 [&_table[data-width=fit]]:w-auto",
  "[&_th]:min-w-[5rem] [&_th]:border [&_th]:border-line [&_th]:bg-gold/15 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink",
  "[&_td]:min-w-[5rem] [&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
  "[&_table[data-rows=compact]_:is(td,th)]:py-1 [&_table[data-rows=tall]_:is(td,th)]:py-4",
].join(" ");

/**
 * Shows a recipe description or note: editor HTML, cleaned before it is
 * rendered, or older plain text exactly as it always appeared.
 */
export function RichText({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  if (!value) return null;

  if (!isRichText(value)) {
    return <div className={cn("whitespace-pre-line", className)}>{value}</div>;
  }

  return (
    <div
      className={cn(RICH_TEXT_STYLES, className)}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(value, { forDisplay: true }) }}
    />
  );
}

export { RICH_TEXT_STYLES };
