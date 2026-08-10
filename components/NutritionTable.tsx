import type { NutritionFacts } from "@/lib/site";

export function NutritionTable({ facts }: { facts: NutritionFacts }) {
  const hasPerServe = facts.rows.some((r) => r.perServe);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      {facts.servingsPerPack && (
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm">
          <span className="font-semibold text-ink">Servings Per Pack</span>
          <span className="text-ink-soft">{facts.servingsPerPack}</span>
        </div>
      )}
      {facts.servingSize && (
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm">
          <span className="font-semibold text-ink">Serving Size</span>
          <span className="text-ink-soft">{facts.servingSize}</span>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cream-deep/60">
            <th className="px-4 py-2.5 text-left font-semibold text-ink">
              Nutritional Values
            </th>
            {hasPerServe && (
              <th className="px-4 py-2.5 text-right font-semibold text-ink">
                Per Serve
              </th>
            )}
            <th className="px-4 py-2.5 text-right font-semibold text-ink">
              Per 100g
            </th>
          </tr>
        </thead>
        <tbody>
          {facts.rows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <td className="px-4 py-2.5 text-ink-soft">{row.label}</td>
              {hasPerServe && (
                <td className="px-4 py-2.5 text-right text-ink">{row.perServe}</td>
              )}
              <td className="px-4 py-2.5 text-right text-ink">{row.per100g}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
