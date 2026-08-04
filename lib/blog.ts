/**
 * Alice's vegan food blog — content carried over verbatim from the Squarespace
 * site at angelfood.co.nz/alices-vegan-food-blog. The route and post slugs match
 * the old site exactly so the existing search rankings and inbound links keep
 * working.
 */

export const BLOG_BASE_PATH = "/alices-vegan-food-blog";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  author: string;
  /** Topic chip shown on cards and above the headline. */
  category: string;
  /** ISO date, used for <time> and structured data. */
  date: string;
  /** Hero image shown at the top of the post. */
  image: string;
  imageAlt: string;
  /** Thumbnail used on the blog index — the old site used a different crop. */
  cardImage: string;
  /** Italic caption printed under the hero image. */
  caption?: string;
  body: BlogBlock[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "great-vegan-sandwiches",
    title: "Great Vegan Sandwiches",
    description:
      "Sandwiches are easy to make and commonplace but that doesn’t mean they can’t be spectacular!",
    author: "Alice Shopland",
    category: "Sandwiches",
    date: "2025-12-07",
    image:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/b624ab77-580a-421f-a467-2239590b1991/unsplash-image-Z7X1PPL_r2k.jpg",
    imageAlt: "A stacked sandwich cut in half, filled with fresh vegetables.",
    cardImage:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/1765102433138-O1W4DQ8QXR9LGBNMI4PV/IMG_1859.jpg",
    caption:
      "Sumptuous sandwiches are easy when you keep a few guidelines in mind.",
    body: [
      {
        type: "p",
        text: "Sandwiches are so easy to make and so commonplace that it can be easy to forget how spectacular they can be!",
      },
      {
        type: "p",
        text: "There are a few practical basics you need to get right, but once you’ve got those covered the options are endless.",
      },
      { type: "h2", text: "The practical stuff:" },
      {
        type: "ul",
        items: [
          "Moisture is important. Nobody wants a dry sandwich, so be generous with the sauces and spreads.",
          "Freshly-made sandwiches are usually the best sandwiches, but that’s not always possible - so think about how well your ingredients are going to last the distance (e.g. if the filling is too wet, will the bread get soggy?)",
          "Cohesiveness is something you only realise the importance of when you take the first of a big beautiful sandwich… and half the fillings fall out into your lap.",
        ],
      },
      { type: "p", text: "Some of my favourite vegan sandwich combos are:" },
      {
        type: "ul",
        items: [
          "Fresh juicy tomato + basil pesto + Angel Food mozzarella",
          "Crunchy iceberg lettuce + red cabbage sauerkraut + Angel Food cheddar",
          "Fresh rocket leaves + fried aubergine + Angel Food cheddar",
          "Beetroot relish + grated carrot + Angel Food cream cheese",
        ],
      },
      {
        type: "p",
        text: "Plant-based sandwiches can make a delicious meal - there’s no shortage of options. They’re great for a picnic, an office or school lunch, or a quick meal or snack at home.",
      },
      {
        type: "p",
        text: "For more great vegan sandwich fillings, try mixing and matching from these suggestions:",
      },
      { type: "h3", text: "Angel Food plant-based cheeses:" },
      { type: "ul", items: ["Cheddar", "Mozzarella", "Cream cheese"] },
      { type: "h3", text: "Spreads and sauces:" },
      {
        type: "ul",
        items: [
          "Pesto",
          "Hummus",
          "Baba ganoush",
          "Guacamole",
          "Aioli",
          "Mayo",
          "Relish",
          "Mustard",
          "Chilli sauce",
          "Tapenade",
          "Tahini",
          "Nut butter (e.g. peanut, almond, hazelnut)",
          "Refried beans",
        ],
      },
      { type: "h3", text: "Vegetables:" },
      {
        type: "ul",
        items: [
          "Finely diced celery",
          "Capsicum, fresh or roasted",
          "Bean sprouts",
          "Leafy greens",
          "Fried mushrooms",
          "Slices of fresh peach or pear",
          "Coleslaw",
          "Chargrilled courgette",
        ],
      },
      { type: "h3", text: "Extra bits:" },
      {
        type: "ul",
        items: [
          "Tamari sunflower seeds",
          "Roasted salted pumpkin seeds (toss ‘em with smoked paprika!)",
          "Sliced olives",
          "Capers",
          "Finely diced preserved lemon",
          "Angel Food parmesan",
          "Sliced pickled onion or gherkin",
        ],
      },
      {
        type: "p",
        text: "Yum! Go forth and make the plant-based sandwich of your dreams!!",
      },
      { type: "h2", text: "A bit of history and miscellany:" },
      {
        type: "ul",
        items: [
          "The sandwich is named after 18th-century English aristocrat John Montagu, the 4th Earl of Sandwich. Depending which source you trust, Lord Sandwich wanted the convenience of a hand-held meal either because of his love of gambling on card games, or because of his dedication to the Navy, politics and the arts required long hours at his desk. Although sandwiches began as an aristocratic evening snack, they really grew in popularity when industrialisation created a new working class needing fast, portable, and inexpensive meals. (It’s not that nobody had eaten a sandwich prior to this, but they were known as \"bread and meat\" or \"bread and cheese\".)",
          "In 2006 a US court ruled that a sandwich includes at least two slices of bread - this came about because a burrito company wanted to set up shop in a shopping centre where another restaurant had a no-compete clause in its lease prohibiting other \"sandwich\" shops.",
          "“Double Irish with a Dutch sandwich” refers to schemes for tax evasion.",
        ],
      },
      { type: "h3", text: "Other names for sandwich:" },
      {
        type: "ul",
        items: [
          "Butty - north of England",
          "Sanger - Australia",
          "Piece - Scotland (refers either to a sandwich or a light meal, especially one that includes a sandwich - a ‘jeely piece’ is a jam sandwich)",
          "Sammich or sammidge - SE United States",
          "Sando or sandoichi - Japan",
        ],
      },
    ],
  },

  {
    slug: "top-toppings-vegan-pizza",
    title: "10 Top Vegan Pizza Toppings",
    description:
      "A luscious array of creative vegan pizza inspo, and tips for vege prep and flavour balance.",
    author: "Alice Shopland",
    category: "Pizza",
    date: "2019-03-11",
    image:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/6816bd90-fe31-4d4c-8c8a-36521f786b98/583294056_1296963249138887_8101186080251408191_n.jpg",
    imageAlt: "A vegan pizza loaded with colourful vegetable toppings.",
    cardImage:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/1763894645938-Z8VFKZTT9FS5J0R4XREF/583294056_1296963249138887_8101186080251408191_n.jpg",
    caption: "Vegan pizza: all the fun, none of the FOMO.",
    body: [
      {
        type: "p",
        text: "There are so many delicious vegan pizza toppings to get creative with! Here are my top 10, and I’ll mention some of the others below for further inspiration.",
      },
      {
        type: "ol",
        items: [
          "Roast beetroot wedges",
          "Falafel patties, cut in half",
          "Tempeh (sliced, diced or grated, marinated or au naturel)",
          "Pickled red onion",
          "Canned baby corn (slice in half lengthwise)",
          "Whole roasted garlic cloves",
          "Tofu ricotta",
          "Barbecue sauce (stir into your base sauce for extra flavour or swirl on top after baking)",
          "Slices of fresh nectarine (or other firm juicy fruit)",
          "Carrot salmon (with dill and cream cheese)",
        ],
      },
      {
        type: "p",
        text: "More vegan and dairy-free pizza ideas at the end of this blog post.",
      },
      { type: "h2", text: "To pineapple or not to pineapple?" },
      {
        type: "p",
        text: "Let’s get the big question out of the way! I was strictly in the ‘no way’ camp until we visited a pizza place in Hobart, Tasmania. The chef came to our table and explained that one of the toppings in the vegan pizza we’d chosen was unavailable that night and would we be okay with pineapple on our pizza in its place because it would add the vital sweetness and tang? We said yes, of course, because it was so obvious he was going to deliver a great result. I was very touched by the tender loving care for pizzas and patrons. And it made me realise that the controversy is amusing but rather ridiculous – pineapple simply offers another texture and flavour option.",
      },
      { type: "h2", text: "Success with vegetables on pizza" },
      {
        type: "p",
        text: "I love veges on my pizza but I’ve learned that precooking will often give a better result. That’s because a lot of vegetables have a high water content, so they take longer to cook. Precooking your vegetables means you drive out some of the water, giving a more intense flavour, less chance of a soggy pizza, and – importantly – it’s easier to make sure all the toppings are cooked the way you want them.",
      },
      { type: "h2", text: "How many toppings?" },
      {
        type: "p",
        text: "I’m always tempted to really load the pizza up with a big variety of toppings but I actually think the best pizzas have just a few carefully chosen toppings. Five at the most, I reckon (that’s not counting the base sauce and the vegan cheese).",
      },
      { type: "h2", text: "What about the cheese?" },
      {
        type: "p",
        text: "Don’t worry, we’ve got you covered there too! Angel Food was made for this. It’s natural to reach for our ready grated cheese for pizza night but our mozzarella and cheddar blocks are great options too. Our cream cheese works surprisingly well on pizza too – give it a go! – and you can’t go wrong with a generous shake of our powdered parmesan on top just before serving. Whatever your reasons for choosing dairy-free, we’ve got your back – and your pizza.",
      },
      { type: "h2", text: "More vegan pizza toppings:" },
      {
        type: "ul",
        items: [
          "Finely chopped spring onions or chives",
          "Walnuts, fresh or toasted",
          "Crisp chilli oil",
          "Roasted broccolini (cut into bite-size pieces)",
          "Mushrooms (precook them – fry or roast – for more intense flavour)",
          "Your favourite olives",
          "Kumara/sweet potato (diced and roasted is fab, but if you’re in a hurry you can use pre-frozen kumara fries!)",
          "Sundried tomatoes (for their intense flavour and meaty texture)",
          "Herbs (dried herbs in your tomato sauce and fresh herbs on top after cooking)",
          "Red or orange or yellow capsicum (unbeatable colour and flavour, raw or precooked)",
          "Artichoke hearts (they’re expensive, but just a few will go a long way if you slice them thinly)",
          "Pesto (spread on the base or dollop on top of other toppings)",
        ],
      },
      { type: "p", text: "Happy vegan pizza making!" },
    ],
  },

  {
    slug: "top-tips-vegan-pasta",
    title: "Plant-Based Pasta Perfection",
    description:
      "A guide to easy vegan pasta with clever swaps and simple tricks for flavourful plant-based meals.",
    author: "Alice Shopland",
    category: "Pasta",
    date: "2019-03-11",
    image:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/1f8c50a7-f274-4ac7-a395-41cf80a0948d/pasta+pics+11-2025-6.png",
    imageAlt:
      "A bowl of spaghetti topped with falafel patties in a rich tomato sauce.",
    cardImage:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/1764081363219-3LICVZ6ZWJSF7YM2K592/pasta%2Bpics%2B11-2025-6.png",
    caption:
      "Falafel patties make it easy to make a vegan version of spaghetti and meatballs.",
    body: [
      {
        type: "p",
        text: "Pasta is delicious and satisfying, and it can also be quick and cheap. It’s perfect for feeding a crowd and with a few tricks up your sleeve it’s no problem to produce vegan versions of old favourites.",
      },
      { type: "h2", text: "Is pasta vegan?" },
      {
        type: "p",
        text: "While fresh pasta often contains egg, most dried pasta does not – it’s just flour and water, no egg required. If you’re looking for gluten-free options there is a wide range of noodles made from non-wheat ingredients such as lentils and other legumes (for a high-protein version), rice and even sweet potato. If you’re keen to make your own high-protein pasta you could try Wendy the Food Scientist’s tofu pasta.",
      },
      { type: "h2", text: "Saucing separately" },
      {
        type: "p",
        text: "Recipes that cook the pasta and the sauce together are very time efficient and can be a real life saver for hurried weeknight meals. But if you’re cooking the pasta and the sauce separately, make the most of it in your presentation. Add a little of the sauce to the pasta, to add some flavour and loosen it, then add the rest of the sauce on top.",
      },
      { type: "h2", text: "Which shape to use?" },
      {
        type: "p",
        text: "It always surprises me how much of a difference the shape of pasta makes – because it’s all made of the same basic ingredients. Although it tastes the same, the different textures mean a different eating experience and we all have our favourites. My favourites are orzo and mini lasagna noodles.",
      },
      {
        type: "p",
        text: "In general thin pasta shapes are best for smooth sauces and wider pasta suits chunkier sauces.",
      },
      { type: "h2", text: "Should I salt the water?" },
      {
        type: "p",
        text: "I started salting my pasta water because I thought it would lower the boiling point – turns out it doesn’t really make any difference in that regard. But I still do it because it seasons the pasta and makes it taste great.",
      },
      { type: "h2", text: "Saucy suggestions" },
      {
        type: "p",
        text: "It’s easy to make a vegan tomato sauce for pasta but if you’re not used to vegan cooking them creamy sauces can take a bit more thought. I often use a base of:",
      },
      {
        type: "ul",
        items: [
          "Pureed cannellini beans, chickpeas or lentils",
          "Silken tofu",
          "White sauce with vegan cheese",
          "Coconut cream",
        ],
      },
      { type: "h2", text: "Not just about the sauce" },
      {
        type: "p",
        text: "Not every pasta dish needs a sauce. You can simply stir dairy-free pesto through cooked pasta, for example (try the plant-based pesto from Genoese Foods). And the classic Italian dish aglio et olio is simply olive oil and fresh garlic stirred through cooked pasta, and sprinkled with parmesan (try our vegan version of parmesan).",
      },
      { type: "h2", text: "Not meatballs" },
      {
        type: "p",
        text: "Spaghetti and meatballs is a classic combination – falafel patties (I like the Danny’s ones best) make a great vegan version.",
      },
      { type: "h2", text: "Vegan pasta salads" },
      {
        type: "p",
        text: "Chunky pasta shapes like macaroni, shells and bowties make great salad bases.",
      },
      { type: "p", text: "I love to add:" },
      {
        type: "ul",
        items: [
          "Vegan mayo or sour cream",
          "Fresh leafy herbs like coriander or basil",
          "Salty tasty mix-ins like olives, sundried tomatoes and capers",
          "Crunchy toasted nuts and seeds",
          "Sweetcorn, either canned or fresh",
          "Diced colourful veges, raw (eg capsicum) or roasted (eg kumara or carrot)",
          "Vegan feta",
          "Edamame beans or other tinned beans",
        ],
      },
      { type: "h2", text: "Bonus question: Is bronze better?" },
      {
        type: "p",
        text: "Apparently pasta made using bronze dies – the perforated metal plates that cut and shape the pasta – is superior because the finished product has a rough, porous texture and therefore it absorbs more sauce. Personally I find the cheapest pasta to be perfectly satisfactory.",
      },
    ],
  },

  {
    slug: "vegan-cheeseboard",
    title: "Ultimate Vegan Cheeseboard",
    description:
      "With a few well chosen ingredients you can wow your guests with a gorgeous satisfying plant-based cheeseboard.",
    author: "Alice Shopland",
    category: "Entertaining",
    date: "2019-03-11",
    image:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/adc15a08-c59e-4431-8fd6-caa3292793fa/IMG_1499.jpg",
    imageAlt:
      "A plant-based cheeseboard with vegan cheeses, crackers, grapes, olives and fresh herbs.",
    cardImage:
      "https://images.squarespace-cdn.com/content/v1/68e201541a1074642988c437/1764337573390-INOX11XLYLGT2AEAB8HK/IMG_1495.jpg",
    caption:
      "A fun and tasty plant-based cheeseboard features vegan cheeses with a wide range of ingredients chosen for their colour, texture, shape and flavour.",
    body: [
      {
        type: "p",
        text: "Cheeseboards are great – they can be as fancy or as basic as you like and they can definitely be plant-based. Anything goes, but we’ve got a few suggestions to help make your dairy-free cheeseboard a success!",
      },
      {
        type: "p",
        text: "Use an interesting mix of ingredients: this makes sure there’s something to suit everybody’s taste, and a mixture of colours, sizes, shapes and textures makes it gorgeous to look at and delightful to eat.",
      },
      {
        type: "p",
        text: "Two or three vegan cheese options will be the starting point. Angel Food cheddar or feta blocks are perfect for this. A dish of Angel Food sour cream topped with sweet chilli sauce is a great addition - and you could also cube your feta and serve in olive oil and herbs. We also love using the fermented nut cheeses made by Savour and One Love Planet on our vegan snack platters.",
      },
      { type: "h2", text: "Going crackers" },
      {
        type: "p",
        text: "A selection of crackers is the next step – these can be gourmet or everyday (do you know that Snax crackers are vegan?) – and some small slices or cubes of bread if you like. If you really want to impress, make a batch of our delicious savoury shortbread for your cheeseboard.",
      },
      { type: "h2", text: "Sweet on you" },
      {
        type: "p",
        text: "Your cheeseboard doesn’t have to be all savoury: some sweet items will definitely be appreciated. That might be dried apricots, red and green grapes, squares of dark chocolate or slices of persimmon.",
      },
      { type: "h2", text: "Keep it crunchy" },
      {
        type: "p",
        text: "Snacky favourites like nuts, potato chips, pretzels and breadsticks pair well with all the other cheeseboard ingredients.",
      },
      { type: "h2", text: "Salty goodness" },
      {
        type: "p",
        text: "Olives, pickled chillies, sliced gherkins and pink pickled onions all work beautifully. These all tend to be quite wet and they’ll make your other ingredients soggy if you put them straight on the board. I like to put them in small dishes and put a small fork with each.",
      },
      { type: "h2", text: "Colour and freshness" },
      {
        type: "p",
        text: "Add some freshness and joy with brightly coloured radishes, cherry tomatoes (fresh or roasted), capsicum and edible flowers. Tuck some sprigs of fresh herbs in too for extra appeal: parsley, thyme and rosemary all work well.",
      },
      { type: "h2", text: "Build the board" },
      {
        type: "p",
        text: "Start by placing your large items – the blocks of cheese and the small dishes of ‘wet’ items like pickles – evenly around the board. (You might like to slice the cheeses on a separate board first, then move them across so they’re easier for guests to grab.) Then gradually fill in the gaps between them with your other ingredients.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Posts newest first, matching the order the old blog index used. */
export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

/** "07/12/2025" — the day/month/year format the old site displayed. */
export function formatBlogDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** "7 December 2025" — the longer form used in the post header. */
export function formatBlogDateLong(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Rounded-up minutes to read, at a 220 words-per-minute pace. */
export function readingTime(post: BlogPost): number {
  const words = post.body.reduce((total, block) => {
    const text =
      block.type === "ul" || block.type === "ol"
        ? block.items.join(" ")
        : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 220));
}

/** First initial of each name part, e.g. "Alice Shopland" -> "AS". */
export function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
