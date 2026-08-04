import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductMeta, type NutritionEntry } from "@/lib/site";

/**
 * Every product blurb ends with the same dietary sentence ("Plant-based, vegan,
 * …"). On a card that repeats for every tile and crowds out the part that
 * actually distinguishes the product, so trim it for the summary cards only.
 */
function cardBlurb(blurb: string): string {
  return blurb.replace(/\s*Plant-based[^.]*\.\s*$/i, "").trim();
}

/**
 * Product tile used on the ingredients & nutrition index and on the "more
 * <category>" strip at the bottom of each detail page — pack shot, name, short
 * description, and a call to action pinned to the bottom-left of the card.
 */
export function NutritionCard({ entry }: { entry: NutritionEntry }) {
  const meta = getProductMeta(entry.product);

  return (
    <Link
      href={`/ingredients-nutrition-info/${entry.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-[0_18px_40px_-24px_rgba(20,66,44,0.45)]"
    >
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
          {meta && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
              {cardBlurb(meta.blurb)}
            </p>
          )}
        </div>
      </div>

      <span className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.14em] text-green">
        Ingredients &amp; nutrition
        <ArrowRight
          size={13}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
