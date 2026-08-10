/**
 * Renders a JSON-LD block. A server component with no state — it exists only so
 * pages stop repeating the script tag and the dangerouslySetInnerHTML dance,
 * and so every block on the site is serialised the same way.
 *
 * Accepts one object or several, because most pages emit a couple (a page-level
 * type plus a breadcrumb trail).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
