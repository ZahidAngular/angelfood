import { cn } from "@/lib/utils";
import { isRichText, sanitizeRichText } from "@/lib/rich-text";

/** Styling for the tags the editor can produce. */
const RICH_TEXT_STYLES =
  "[&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_strong]:font-semibold [&_strong]:text-ink [&_a]:font-medium [&_a]:text-green [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-green/80";

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
