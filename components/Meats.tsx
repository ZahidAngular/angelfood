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
          title="Plant Based Meat Done Right"
          intro="Burgers, fish fingers, meatballs, pulled pork and more all your favourite meats, deliciously plant-based. Made for Kiwi kitchens that want real flavour without the meat."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {MEATS.map((product, i) => (
            <PackCard key={product.name} product={product} index={i} fit="contain" />
          ))}
        </div>
      </div>
    </section>
  );
}
