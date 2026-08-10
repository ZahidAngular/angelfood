import type { BlogBlock } from "@/lib/blog";

/**
 * Long-form body copy for a blog post. The first paragraph is set a step up
 * from the body, section headings are marked by a short brand rule, and lists
 * use the brand markers — so a plain sequence of blocks reads like an edited
 * article.
 *
 * `text-pretty` is set once here rather than per block: it applies to every
 * paragraph, heading and list item below and is what stops a single word
 * dropping onto its own line at the end of a run of copy.
 */
export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  const leadIndex = blocks.findIndex((b) => b.type === "p");

  return (
    <div className="text-pretty text-[1.0625rem] leading-[1.75] text-ink-soft sm:text-[1.125rem] sm:leading-[1.8]">
      {blocks.map((block, i) => {
        switch (block.type) {
          // A short gold rule instead of a full-width hairline: these posts run
          // to five or more sections, and a line spanning the whole measure
          // above each one chops the article into slabs. A stub reads as an
          // accent, and the wider top margin does the separating.
          case "h2":
            return (
              <h2
                key={i}
                className="mt-16 text-balance font-display text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink before:mb-5 before:block before:h-[3px] before:w-10 before:rounded-full before:bg-gold before:content-[''] first:mt-0 sm:mt-20 sm:text-[2rem]"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                className="mt-10 text-balance font-display text-xl font-bold leading-snug tracking-[-0.01em] text-ink sm:mt-12 sm:text-[1.375rem]"
              >
                {block.text}
              </h3>
            );

          case "ul":
            return (
              <ul key={i} className="mt-6 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="relative pl-7">
                    <span className="absolute left-0 top-[0.72em] h-[7px] w-[7px] rounded-full bg-gold ring-4 ring-gold/15" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          // Ordered lists in these posts are rankings ("my top 10"), so the
          // numbers stay visible rather than being decoration. `items-baseline`
          // sits each number on the first line of its entry instead of guessing
          // at a line-height, and the fixed width keeps the column of numbers
          // aligned once the count reaches double figures.
          case "ol":
            return (
              <ol key={i} className="mt-8 border-t border-line/70">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-baseline gap-5 border-b border-line/70 py-4 sm:gap-6"
                  >
                    <span className="w-7 shrink-0 font-display text-[1.0625rem] font-extrabold text-coral tabular-nums sm:text-lg">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink">{item}</span>
                  </li>
                ))}
              </ol>
            );

          // The lead sits one step above the body, not two: the post's
          // description already runs directly above it at 1.375rem, and
          // matching that size gave the page two standfirsts competing for the
          // same job.
          default:
            return (
              <p
                key={i}
                className={
                  i === leadIndex
                    ? "text-[1.1875rem] leading-[1.7] text-ink sm:text-[1.25rem] sm:leading-[1.75]"
                    : "mt-6"
                }
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
