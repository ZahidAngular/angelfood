export const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Our Story", href: "#story" },
  { label: "Values", href: "#values" },
  { label: "Where to Buy", href: "#stockists" },
  { label: "Contact", href: "#contact" },
];

export type Product = {
  name: string;
  blurb: string;
  tag: string;
  image: string;
  accent: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "Grated",
    blurb:
      "The MVP in your fridge for Friday pizza, taco Tuesday, and all your toastie cravings.",
    tag: "Melts",
    image: "/images/grated.png",
    accent: "var(--color-gold)",
  },
  {
    name: "Cream Cheese",
    blurb:
      "Our award-winning star for cheesecakes and bagels. Creamy, spreadable, luxurious.",
    tag: "Spread",
    image: "/images/cream-cheese.png",
    accent: "var(--color-green-bright)",
  },
  {
    name: "Sour Cream",
    blurb:
      "The creamy-tangy dollop on your nachos and the swirl in your pumpkin soup.",
    tag: "Spoon",
    image: "/images/sour-cream.png",
    accent: "var(--color-coral)",
  },
  {
    name: "Feta",
    blurb:
      "Bursting with the salty-creamy-tangy vibe you'd expect. A treat on pizza, in muffins and salads.",
    tag: "Crumble",
    image: "/images/feta.png",
    accent: "var(--color-green-bright)",
  },
  {
    name: "Cheddar Block",
    blurb:
      "The block-in-a-tub that will save your sandwiches and cosy up to your crackers.",
    tag: "Slice",
    image: "/images/cheddar.png",
    accent: "var(--color-gold)",
  },
  {
    name: "Mozza Block",
    blurb:
      "Tip it out of the tub and slice it or grate it onto your pizza or into your quesadilla.",
    tag: "Stretch",
    image: "/images/mozza.png",
    accent: "var(--color-coral)",
  },
  {
    name: "Parmesan",
    blurb:
      "The finishing touch for pasta — also great on baked beans, mash and fresh tomato.",
    tag: "Finish",
    image: "/images/parmesan.png",
    accent: "var(--color-gold)",
  },
];

export const MEALS = [
  { name: "Vege Lasagna", image: "/images/lasagna.png" },
  { name: "Vege Korma", image: "/images/korma.png" },
  { name: "Tofu & Greens", image: "/images/tofu-greens.png" },
  { name: "Creamy Butter Curry", image: "/images/butter-curry.png" },
];

export const VALUES = [
  {
    title: "Kindness",
    body: "Everything we make is entirely plant-based. We believe compassion belongs on your plate as much as anywhere else.",
    icon: "heart",
  },
  {
    title: "Sustainability",
    body: "Choosing plants over dairy means less land, less water, and far fewer greenhouse gases. Small swaps, real impact.",
    icon: "leaf",
  },
  {
    title: "Joy",
    body: "Food isn't just fuel. It's joy, culture, collaboration and community — and it should always taste incredible.",
    icon: "sun",
  },
];

export const IMPACT = [
  { value: "2006", label: "Leading the way since" },
  { value: "100%", label: "Plant-based, always" },
  { value: "7+", label: "Award-winning cheeses" },
  { value: "NZ", label: "Proudly made in Aotearoa" },
];

export const RETAILERS = [
  "PAK'nSAVE",
  "New World",
  "FreshChoice",
  "Gilmours",
  "Pizza Hut",
  "The Goodtime Pie Co",
];
