const ITEMS = [
  "Dairy-free",
  "Award-winning",
  "100% plant-based",
  "Made in Aotearoa",
  "No compromise",
  "Since 2006",
  "Big on doing good",
  "Melts · Spreads · Crumbles",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-green/15 bg-green py-5 text-cream">
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {item}
            </span>
            <span className="mx-7 text-2xl text-gold sm:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
