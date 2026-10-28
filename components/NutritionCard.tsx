import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { getProductMeta, type NutritionEntry } from "@/lib/site";
import { ONLINE_STORE_OPEN } from "@/lib/pricing";

/**
 * Product tile used on the ingredients & nutrition index and on the "more
 * <category>" strip at the bottom of each detail page — pack shot, name, short
 * description, and a call to action pinned to the bottom-left of the card.
 */
export function NutritionCard({ entry }: { entry: NutritionEntry }) {
  const meta = getProductMeta(entry.product);

  // Only the meals are sold on the site. A Buy online button on a cheese
  // or a pastrami would lead to a shop that does not stock it.
  const buyable = entry.category === "Meals" && ONLINE_STORE_OPEN;

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-[0_18px_40px_-24px_rgba(20,66,44,0.45)]">
      <Link
        href={`/ingredients-nutrition-info/${entry.slug}`}
        aria-label={`${entry.product} — ingredients and nutrition`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      <div className="flex flex-1 items-start gap-5">
        {meta && (
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-cream">
            <Image
              src={meta.image}
              alt={`Angel Food ${entry.product}`}
              fill
              sizes="112px"
              className={`transition-transform duration-500 ease-out group-hover:scale-[1.07] ${
                // Cheeses and meats are pack shots, so they need room to
                // breathe; meals are photographs and should fill the tile.
                entry.category === "Meals"
                  ? "object-cover"
                  : "object-contain p-2"
              }`}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-green">
            {entry.product}
          </h3>
          {/* Shown whole, with line-clamp doing the shortening. A trim used to
              run here, written to drop a closing "Plant-based, vegan, ..."
              sentence that no blurb carries any more. It matched the phrase
              wherever it fell and took the rest of the sentence with it, so
              "Tender plant-based chicken in a silky tomato curry ..." read on
              the card as "Tender". */}
          {meta && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
              {meta.blurb}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-green">
          Ingredients &amp; nutrition
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>

        {/* Raised above the card's own link, which covers everything else.
            Without the z-index the overlay takes the click and someone
            reaching for the shop lands on the ingredients instead. */}
        {buyable && (
          <Link
            href={`/buy-now?meal=${entry.slug}`}
            className="relative z-20 inline-flex items-center gap-1.5 rounded-full bg-green px-3.5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-ink"
          >
            <ShoppingBag size={13} className="shrink-0" />
            Buy online
          </Link>
        )}
      </div>
    </div>
  );
}
