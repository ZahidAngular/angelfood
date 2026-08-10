import { MEATS } from "@/lib/site";
import { PackCard } from "./PackCard";
import { RangeSectionHeader } from "./RangeSectionHeader";

export function Meats() {
  return (
    <section id="meats" className="bg-cream-deep py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12">
        <RangeSectionHeader
          eyebrow="Meats"
          count={MEATS.length}
          title="Plant-based meat, done right."
          intro="Burgers, fish fingers, meatballs and pulled pork — all your favourites, deliciously plant-based."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {MEATS.map((product, i) => (
            <PackCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
