import { MEALS } from "@/lib/site";
import { PackCard } from "./PackCard";
import { RangeSectionHeader } from "./RangeSectionHeader";

export function Meals() {
  return (
    <section id="meals" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12">
        <RangeSectionHeader
          eyebrow="Meals"
          count={MEALS.length}
          title="Ready-to-go plant goodness."
          intro="Wholesome vegan meals for the nights you'd rather not cook — all the comfort, none of the compromise."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {MEALS.map((meal, i) => (
            // Meal photography is 4:3; matching the frame to it means the shot
            // fills the card with no letterboxing and no meaningful crop.
            <PackCard key={meal.name} product={meal} index={i} aspect="4/3" />
          ))}
        </div>
      </div>
    </section>
  );
}
