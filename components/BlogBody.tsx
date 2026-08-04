import type { BlogBlock } from "@/lib/blog";

/**
 * Long-form body copy for a blog post. The first paragraph is set larger as a
 * standfirst, headings get a hairline rule, and lists use the brand markers —
 * so a plain sequence of blocks reads like an edited article.
 */
export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  const leadIndex = blocks.findIndex((b) => b.type === "p");

  return (
    <div className="text-[1.0625rem] leading-[1.75] text-ink-soft sm:text-[1.125rem] sm:leading-[1.8]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="mt-14 border-t border-line pt-8 font-display text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-ink first:mt-0 sm:text-[2.125rem]"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                className="mt-10 font-display text-xl font-bold tracking-[-0.01em] text-ink sm:text-[1.375rem]"
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

          case "ol":
            return (
              <ol key={i} className="mt-8 space-y-0 border-t border-line">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-5 border-b border-line py-4 sm:gap-7"
                  >
                    <span className="shrink-0 font-display text-lg font-extrabold leading-[1.6] text-coral tabular-nums">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );

          default:
            return (
              <p
                key={i}
                className={
                  i === leadIndex
                    ? "text-[1.25rem] leading-[1.65] text-ink sm:text-[1.375rem]"
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
