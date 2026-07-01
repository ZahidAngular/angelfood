export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Recipes", href: "/recipes" },
  { label: "Our Story", href: "/about" },
  { label: "Where to Buy", href: "/where-to-buy" },
  { label: "Contact", href: "/contact" },
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
  "SuperValue",
  "Gilmours",
  "Green Giant",
];

export type IngredientGroup = {
  heading?: string;
  items: string[];
};

export type Recipe = {
  slug: string;
  title: string;
  blurb: string;
  tag: string;
  image: string;
  serves?: string;
  ingredients: IngredientGroup[];
  method: string[];
  tip?: string;
};

export const RECIPES: Recipe[] = [
  {
    slug: "chocolate-cherry-cake-with-sour-cream-ganache",
    title: "Chocolate Cherry Cake with Sour Cream Ganache",
    blurb:
      "A rich celebration cake with sour cream ganache — not too sweet, but seriously indulgent.",
    tag: "Sweet",
    image: "/images/recipes/choc-cherry-cake.jpg",
    ingredients: [
      {
        heading: "Cake",
        items: [
          "2 cups flour",
          "1¾ cups sugar",
          "½ cup cocoa powder",
          "4 teaspoons baking powder",
          "½ teaspoon salt",
          "1¼ cups warm water",
          "½ cup vegetable oil",
          "2 teaspoons apple cider vinegar",
          "2 teaspoons vanilla extract",
          "1 cup fresh, canned or frozen cherries",
        ],
      },
      {
        heading: "Ganache",
        items: ["340g vegan chocolate", "400g Angel Food sour cream"],
      },
      {
        heading: "Decoration",
        items: ["Fresh cherries", "Chocolate pieces and shavings"],
      },
    ],
    method: [
      "Preheat the oven to 180°C and line two round cake tins with baking paper.",
      "Whisk together the flour, sugar, cocoa, baking powder and salt in a large bowl.",
      "Add the warm water, oil, vinegar and vanilla, and whisk until smooth. Fold through the cherries.",
      "Divide between the tins and bake for 35–45 minutes, until a skewer comes out clean. Cool completely.",
      "For the ganache, gently melt the chocolate with the sour cream over a double boiler, stirring until glossy and smooth, then cool until spreadable.",
      "Slice each cake in half horizontally, layer with ganache, then cover the outside. Decorate with fresh cherries and chocolate shavings.",
    ],
    tip: "Use fresh cherries if they're in season, but canned or frozen cherries work just as well.",
  },
  {
    slug: "gingerbread-cheesecake",
    title: "Gingerbread Cheesecake",
    blurb: "Super-indulgent and sweetly spiced. The ultimate cosy dessert.",
    tag: "Dessert",
    image: "/images/recipes/gingerbread-cheesecake.jpg",
    ingredients: [
      {
        heading: "Base",
        items: ["300g vegan gingernuts", "200g vegan butter, melted"],
      },
      {
        heading: "Filling",
        items: [
          "700g Angel Food cream cheese, room temperature",
          "⅔ cup icing sugar",
          "1 teaspoon vanilla extract",
          "2 teaspoons ground ginger",
          "½ teaspoon cinnamon",
          "250ml vegan whipping cream",
          "Crumbled gingernut biscuits, to top",
          "Vegan whipped cream, to top",
        ],
      },
    ],
    method: [
      "Blitz the gingernuts to a fine crumb, then stir through the melted butter until it holds together.",
      "Line a cake tin with baking paper, grease the sides, and press the mixture firmly into the base. Refrigerate.",
      "Beat the softened cream cheese until smooth, then mix in the icing sugar, vanilla and spices.",
      "Whip the vegan cream separately until mostly thickened, fold into the cheese mixture, then beat until thick and creamy.",
      "Pour the filling onto the biscuit base and spread evenly. Refrigerate overnight to set.",
      "Run a thin knife around the edge to release, top with whipped cream and crumbled biscuits, then slice and serve.",
    ],
  },
  {
    slug: "vegan-lemon-curd",
    title: "Vegan Lemon Curd",
    blurb: "Zingy, creamy and sweet — lemon curd without eggs or butter!",
    tag: "Sweet",
    image: "/images/recipes/lemon-curd.jpg",
    ingredients: [
      {
        items: [
          "250g golden kumara",
          "¾ cup sugar",
          "⅓ cup freshly-squeezed lemon juice",
          "Zest of 1 large lemon",
        ],
      },
    ],
    method: [
      "Peel the kumara, taking care to remove any dark-coloured bits. Cut into even-sized chunks and steam until very tender. Set aside with the lid off so it cools and some of the moisture evaporates.",
      "Zest the lemon — if you don't have a zester, use a potato peeler (avoiding the white pith) and chop the strips of peel finely.",
      "Blend the cooked kumara with the sugar, lemon juice and zest in a food processor until very smooth.",
      "Spoon into a clean jar and refrigerate until ready to use.",
    ],
    tip: "Golden kumara gives the warm yellow colour we expect from lemon curd. Other kumara varieties will still be delicious, just a different colour.",
  },
  {
    slug: "upside-down-onion-tart",
    title: "Upside-Down Onion Tart",
    blurb: "A savoury version of the classic French apple tart.",
    tag: "Savoury",
    image: "/images/recipes/onion-tart.jpg",
    ingredients: [
      {
        items: [
          "2 teaspoons sugar",
          "½ teaspoon salt, divided",
          "2 teaspoons cider or wine vinegar",
          "2 tablespoons neutral oil",
          "2 medium red or brown onions, sliced into rounds",
          "½ teaspoon mixed herbs",
          "Black pepper and/or chilli flakes",
          "½ cup grated Angel Food cheddar",
          "1 sheet pastry (puff or shortcrust), thawed",
          "To serve: hummus and tasty leaves",
        ],
      },
    ],
    method: [
      "Preheat the oven to 200°C.",
      "Scatter the sugar, half the salt, vinegar and oil over the base of an oven-proof frying pan.",
      "Arrange the onion rounds tightly over the base, sprinkle with the remaining salt, mixed herbs and pepper or chilli.",
      "Cook on the stovetop over medium heat for a few minutes until the onions start to soften and caramelise underneath.",
      "Scatter the grated cheddar over the onions.",
      "Cut the pastry to fit the pan, lay it over the top and tuck the edges down around the onions.",
      "Bake for 20–25 minutes until the pastry is puffed and golden.",
      "Rest for a few minutes, then carefully invert onto a serving plate. Top with a big dollop of hummus and some tasty leaves.",
    ],
  },
  {
    slug: "roast-cabbage-with-feta",
    title: "Roast Cabbage with Feta",
    blurb:
      "Crunchy, sweet, salty — this recipe brings out the very best in cabbage.",
    tag: "Savoury",
    image: "/images/recipes/roast-cabbage-feta.jpg",
    ingredients: [
      {
        items: [
          "1 small green savoy or red cabbage (or half and half)",
          "3 tablespoons vegetable oil",
          "1 teaspoon salt",
          "1 teaspoon caraway seeds",
          "60g Angel Food feta, roughly cubed",
          "½ cup toasted pistachios or other nuts or seeds",
          "Lemon wedges, to serve",
        ],
      },
    ],
    method: [
      "Preheat the oven to 220°C.",
      "Trim any tough or broken leaves off the cabbage. Cut into 8–12 wedges, keeping some stem on each wedge to help it hold together during baking.",
      "Toss the cabbage wedges with the oil, salt and caraway seeds.",
      "Place on a baking tray lined with baking paper, spaced out in a single layer.",
      "Bake for approximately 15 minutes until tender with crispy edges, adding another 5 minutes if needed.",
      "Transfer to a serving platter and sprinkle over the feta and toasted nuts or seeds.",
      "Serve hot or warm, with lemon wedges, pita bread and lashings of your favourite hummus.",
    ],
  },
  {
    slug: "roasted-harissa-chickpeas-barley-stuffed-kumara",
    title: "Roasted Harissa Chickpeas & Barley Stuffed Kumara",
    blurb: "Glorious flavour, great looks, lovely texture — win, win, win!",
    tag: "Mains",
    image: "/images/recipes/harissa-kumara.jpg",
    serves: "Serves 4",
    ingredients: [
      {
        items: [
          "4 large kumara, washed",
          "Olive oil",
          "Salt & pepper",
          "1 can chickpeas, drained",
          "1 red onion, sliced",
          "1 tablespoon harissa paste",
          "½ cup barley, rinsed",
          "1½ cups vegetable stock",
        ],
      },
      {
        heading: "Dressing",
        items: [
          "3 tablespoons olive oil",
          "2 tablespoons balsamic vinegar",
          "1 tablespoon maple syrup",
          "Salt & pepper",
        ],
      },
      {
        heading: "To serve",
        items: ["Angel Food feta, crumbled", "Parsley, chopped"],
      },
    ],
    method: [
      "Preheat the oven to 200°C.",
      "Brush the washed kumara over with olive oil and sprinkle with salt and pepper. Place whole in the oven and cook for 40–50 minutes until a knife goes through easily.",
      "Meanwhile, cook the barley in the vegetable stock for 20–30 minutes until tender.",
      "Toss the chickpeas and red onion with a little oil and the harissa paste, and roast for 20 minutes until golden.",
      "Make the dressing by placing all the ingredients in a jar and shaking to combine.",
      "Split each kumara open, fluff the flesh, and fill with the barley and harissa chickpeas. Drizzle with dressing and top with feta and parsley.",
    ],
  },
  {
    slug: "colins-bolognese",
    title: "Colin's Bolognese",
    blurb: "An easy and tasty meal that's a real crowd-pleaser.",
    tag: "Mains",
    image: "/images/recipes/bolognese.jpg",
    serves: "Serves 4",
    ingredients: [
      {
        items: [
          "100g dry TVP mince",
          "1 cup hot water (for soaking the TVP)",
          "3 tablespoons olive oil",
          "1 medium onion, finely diced",
          "2 garlic cloves, finely diced",
          "1 red capsicum, diced",
          "150g mushrooms, diced",
          "1 teaspoon smoked paprika",
          "1 teaspoon chilli flakes (to taste)",
          "½ teaspoon cinnamon",
          "2 tablespoons dried mixed herbs",
          "1 x 400g tin chopped tomatoes in juice",
          "1 teaspoon sugar",
          "1 teaspoon balsamic vinegar",
          "200ml water",
          "2 tablespoons red lentils",
          "3 teaspoons vege stock powder",
          "2 tablespoons tomato paste",
        ],
      },
    ],
    method: [
      "Measure the TVP and hot water into a bowl and set aside to soak.",
      "Heat a large pot on medium-high and add the oil, onion, garlic, capsicum and mushrooms. Sauté for 5–10 minutes, stirring occasionally, until the onion is translucent and softening.",
      "Add the soaked TVP and the rest of the ingredients, and stir well.",
      "Cover with a lid and simmer for 20 minutes, until the vegetables and red lentils are cooked through.",
      "Serve over pasta and top with Angel Food grated cheddar or parmesan.",
    ],
  },
  {
    slug: "roast-pumpkin-soup",
    title: "Roast Pumpkin Soup",
    blurb:
      "Made extra tasty by roasting the veg first, then a creamy sour-cream swirl.",
    tag: "Comfort",
    image: "/images/recipes/pumpkin-soup.jpg",
    ingredients: [
      {
        items: [
          "1 medium pumpkin (approx. 800g), chopped",
          "2 large carrots, chopped",
          "1 tablespoon + 1 teaspoon vegetable oil",
          "2 medium onions, chopped",
          "1 teaspoon paprika (smoked or regular)",
          "½ teaspoon cumin seeds",
          "1 x 400g can cannellini beans (don't drain or rinse)",
          "Approx. 1½ cups water",
          "1 teaspoon vegetable stock powder",
          "1 teaspoon salt",
        ],
      },
      {
        heading: "Toppings",
        items: [
          "Toasted pumpkin seeds",
          "Fresh chopped parsley",
          "Grated Angel Food cheddar, feta or sour cream",
          "Chilli sauce, tahini, croutons",
        ],
      },
    ],
    method: [
      "Preheat the oven to 180°C.",
      "Toss the pumpkin, carrot and onion with the oil, and roast for 30–40 minutes until soft and caramelised at the edges.",
      "Transfer the roasted vegetables to a large pot with the paprika, cumin, cannellini beans (and their liquid), water, stock powder and salt.",
      "Bring to a simmer and cook for 10 minutes to let the flavours combine.",
      "Blend until completely smooth, adding more water if you'd like a thinner soup.",
      "Taste and adjust the seasoning, then ladle into bowls.",
      "Add the toppings just before serving.",
    ],
  },
  {
    slug: "cheesy-zucchini-fritters",
    title: "Cheesy Zucchini Fritters",
    blurb: "Cheesy, plant-based and gluten-free = win, win, win!",
    tag: "Snack",
    image: "/images/recipes/zucchini-fritters.jpg",
    ingredients: [
      {
        items: [
          "3 cups grated zucchini",
          "1 cup grated Angel Food cheddar",
          "1½ cups corn kernels",
          "3 garlic cloves, minced",
          "1¼ cups chickpea flour",
          "2 teaspoons cumin",
          "1 teaspoon oregano",
          "1 teaspoon thyme",
          "1 teaspoon salt and pepper",
          "¾ cup finely chopped green onions",
        ],
      },
    ],
    method: [
      "In a large bowl, combine the zucchini, corn, cheddar, green onions, chickpea flour, garlic, cumin, oregano, thyme, salt and pepper.",
      "Stir together until well combined, then let it sit for at least 5 minutes — the flour will absorb moisture from the zucchini and form a batter.",
      "Warm a large non-stick skillet over medium heat and grease with a little oil.",
      "Scoop ¼ cup of the mixture at a time into the pan and cook for 3–5 minutes on each side, until light golden brown.",
      "Drain briefly on paper towels and serve warm.",
    ],
  },
  {
    slug: "broccoli-cheddar-beans",
    title: "Broccoli Cheddar Beans",
    blurb: "Need dinner in 10? This hits the spot.",
    tag: "Quick",
    image: "/images/recipes/broccoli-cheddar-beans.jpg",
    serves: "3–4 servings",
    ingredients: [
      {
        items: [
          "1 tablespoon olive oil",
          "½ teaspoon salt",
          "½ teaspoon vege stock powder",
          "1 medium onion, finely chopped",
          "3 (or more) garlic cloves, chopped",
          "2 x 400g cans cannellini beans — not drained",
          "1 large head broccoli, chopped into bite-sized pieces",
          "Approx. 1 cup grated Angel Food cheddar",
        ],
      },
      {
        heading: "To garnish",
        items: ["Fresh parsley", "Black pepper"],
      },
    ],
    method: [
      "Heat a large pot on medium. Once hot, add the oil, salt, stock powder, onion and garlic.",
      "Cook, stirring regularly, for about 5 minutes, until the onion is softened.",
      "Add the beans (brine and all!), broccoli and cheese, and stir gently.",
      "Bring to a simmer, pop the lid on, and cook until the broccoli is as cooked as you like it.",
      "Serve in bowls, topped with parsley and black pepper, with bread for dipping and scooping.",
    ],
  },
  {
    slug: "smoky-cheese-sauce",
    title: "Smoky Cheese Sauce",
    blurb: "Tasty cheese sauce topped with smoked paprika oil.",
    tag: "Sauce",
    image: "/images/recipes/smoky-cheese-sauce.jpg",
    ingredients: [
      {
        items: [
          "¾ cup white flour",
          "¾ cup vegan margarine",
          "220g Angel Food cheddar, grated",
          "2 cups soy milk",
          "Salt and pepper, to taste",
          "A pinch + 1½ teaspoons smoked paprika",
          "125ml olive oil",
        ],
      },
    ],
    method: [
      "Melt the margarine over low heat in a saucepan.",
      "Slowly add the flour while stirring until smooth, and cook the roux for at least 10 minutes.",
      "Gradually mix in the soy milk, stirring until smooth.",
      "Add salt, pepper and a pinch of smoked paprika.",
      "Add the grated cheese, stirring until melted through.",
      "Reheat gently before serving, adding more soy milk if you'd like a thinner sauce.",
      "For the smoked paprika oil, heat the olive oil and remaining smoked paprika on low for 5 minutes, cool, then strain through a coffee filter or muslin cloth.",
      "Drizzle the smoked paprika oil over the sauce to serve.",
    ],
    tip: "Recipe from our friends at Burgernaut.",
  },
  {
    slug: "vegan-pizza-rolls",
    title: "Vegan Pizza Rolls",
    blurb:
      "Tasty, snackable and portable — perfect for picnics and packed lunches.",
    tag: "Snack",
    image: "/images/recipes/pizza-rolls.jpg",
    ingredients: [
      {
        heading: "Dough",
        items: [
          "2 cups plain flour",
          "⅔ cup warm water",
          "2½ teaspoons instant dry yeast",
          "2 tablespoons olive oil",
          "1 teaspoon sugar",
          "½ teaspoon salt",
        ],
      },
      {
        heading: "Filling",
        items: [
          "⅓ cup tomato pizza sauce",
          "1 cup Angel Food cheese, grated",
          "1 medium onion, finely chopped",
          "200g mushrooms, finely chopped",
          "¼ cup olives, roughly chopped",
          "¼ cup sun-dried tomatoes, finely chopped",
        ],
      },
    ],
    method: [
      "Combine the warm water, yeast and sugar and leave for a few minutes until foamy.",
      "Mix in the flour, oil and salt to form a dough. Knead for 5–8 minutes until smooth, then rest covered for about 30 minutes until puffy.",
      "While the dough rests, cook the onion and mushroom in a little oil until soft.",
      "Roll the dough into a large rectangle. Spread with pizza sauce, then scatter over the onion, mushroom, olives, sun-dried tomatoes and cheese.",
      "Roll up tightly from the long edge, then slice into rounds.",
      "Arrange the rolls cut-side up on a lined baking tray, spaced apart.",
      "Bake at 200°C for 15–20 minutes until golden brown.",
      "Serve warm or at room temperature.",
    ],
  },
  {
    slug: "zingy-aubergine",
    title: "Zingy Aubergine",
    blurb:
      "Luscious pan-steamed eggplant with a flavour-packed fresh and crunchy topping.",
    tag: "Savoury",
    image: "/images/recipes/zingy-aubergine.jpg",
    ingredients: [
      {
        items: [
          "2 medium or large eggplants",
          "Vegetable oil, for frying",
          "¼ cup water",
          "Zest and juice of half a lemon",
          "2 tablespoons olive oil",
          "About 1 cup fresh herbs (parsley and coriander), roughly chopped",
          "Chilli, to taste (about 3 fresh bird's eye chillies, deseeded and finely sliced)",
          "½ cup roasted salted peanuts, roughly chopped",
          "½ cup Angel Food sour cream",
        ],
      },
    ],
    method: [
      "Trim the eggplant stalks and cut lengthwise into eight wedges.",
      "Sear the eggplant pieces in a hot, oiled pan on both cut sides until marked; repeat in batches.",
      "Return all the wedges to the pan skin-side down over medium heat with a splash of water; cover and steam for about 5 minutes until soft, adding more water if it dries out.",
      "Arrange on a serving dish and pour over the lemon juice, zest and olive oil.",
      "Top with the sour cream, peanuts, chilli and fresh herbs.",
      "Serve hot or at room temperature.",
    ],
  },
  {
    slug: "best-potato-salad",
    title: "Best Potato Salad",
    blurb: "A crowd-pleaser of a retro dish, made creamy and kind.",
    tag: "Side",
    image: "/images/recipes/potato-salad.jpg",
    ingredients: [
      {
        items: [
          "1kg potatoes (waxy rather than floury)",
          "1 small red onion, finely chopped",
          "2–3 spring onions, finely chopped",
          "6–8 cornichons, finely chopped",
          "A few sprigs fresh dill, finely chopped (or 1 teaspoon dried dill)",
          "200g Angel Food sour cream",
          "Salt, to season",
        ],
      },
    ],
    method: [
      "Peel the potatoes and cut into 1cm dice.",
      "Boil in salted water until al dente, then drain and allow to cool completely (can be done a day ahead).",
      "Pour half the potatoes into your largest mixing bowl.",
      "Add half the chopped onion, spring onion, cornichon and dill.",
      "Using a spatula, gently stir through about half the sour cream, with a good pinch of salt.",
      "Top with the second half of the ingredients and stir gently again.",
      "Tip into your serving dish and enjoy!",
    ],
  },
  {
    slug: "eggplant-muffaletta",
    title: "Eggplant Muffaletta",
    blurb:
      "A make-ahead stuffed sandwich crammed with smoky eggplant, capsicum and cream cheese.",
    tag: "Lunch",
    image: "/images/recipes/eggplant-muffaletta.jpg",
    ingredients: [
      {
        heading: "Marinated eggplant",
        items: [
          "2 medium or 1 large eggplant, sliced 3–4mm thick",
          "3 tablespoons soy sauce",
          "3 tablespoons red wine vinegar",
          "2 teaspoons sugar",
          "½ teaspoon liquid smoke",
          "1 garlic clove, minced",
          "1 teaspoon paprika",
          "½ teaspoon chilli flakes",
          "Black pepper",
          "2 tablespoons olive oil",
        ],
      },
      {
        heading: "Olive salad",
        items: [
          "1 cup stoned olives",
          "¼ cup sun-dried tomatoes",
          "2 tablespoons capers",
          "A handful fresh parsley",
        ],
      },
      {
        heading: "Sandwich",
        items: [
          "Pesto",
          "2 large roast capsicums",
          "1 round sourdough loaf",
          "100g Angel Food cream cheese, sliced",
        ],
      },
    ],
    method: [
      "Whisk together the soy sauce, vinegar, sugar, liquid smoke, garlic, paprika, chilli flakes and pepper to make a marinade.",
      "Toss the eggplant slices through the marinade and set aside while you prepare the rest.",
      "Roast the capsicums until softened and blistered, then peel and slice.",
      "Blitz the olive salad ingredients together until roughly chopped.",
      "Pan-fry the marinated eggplant in the olive oil, in batches, until tender and lightly charred.",
      "Slice the top off the sourdough loaf and hollow out the middle, keeping the bread for another use.",
      "Spread the base with pesto, then layer in the eggplant, roast capsicum, olive salad and cream cheese.",
      "Replace the lid, wrap tightly in cling film, and press with a weight for a few hours or overnight in the fridge.",
      "Unwrap, slice into wedges and serve.",
    ],
  },
  {
    slug: "easy-vegan-pesto",
    title: "Easy Vegan Pesto",
    blurb: "Fresh pesto is a real treat that's real easy to make!",
    tag: "Sauce",
    image: "/images/recipes/vegan-pesto.jpg",
    ingredients: [
      {
        items: [
          "1 cup packed fresh basil (remove large stems, thin ones are fine)",
          "¼ cup walnuts or sunflower seeds",
          "1 clove garlic",
          "2 teaspoons lemon juice",
          "1 tablespoon Angel Food parmesan",
          "¼ teaspoon salt",
          "3 tablespoons olive oil",
        ],
      },
    ],
    method: [
      "Use a food processor or small blender to blitz all the ingredients to a loose paste, scraping down the sides as necessary.",
      "Add more oil (or water) to make a runnier pesto if you like.",
      "Taste for seasoning and add more salt, lemon or parmesan as desired.",
      "Use immediately, or store in a small covered container in the fridge for up to a week.",
    ],
    tip: "Freezes well in portions and will keep for about three months frozen.",
  },
  {
    slug: "super-summer-pudding",
    title: "Super Summer Pudding",
    blurb:
      "The English classic veganised — with a luscious layer of cheesecake mousse.",
    tag: "Dessert",
    image: "/images/recipes/summer-pudding.jpg",
    ingredients: [
      {
        heading: "Berry filling",
        items: [
          "400g mixed berries (fresh or frozen)",
          "¼ cup water",
          "2 tablespoons strawberry jam",
          "2 tablespoons sugar",
          "Zest of 1 lemon",
        ],
      },
      {
        heading: "Cheesecake mousse",
        items: [
          "150g Angel Food cream cheese",
          "100g Angel Food sour cream",
          "¼ cup icing sugar",
          "½ teaspoon vanilla extract",
        ],
      },
      {
        heading: "Assembly",
        items: [
          "About half a loaf thin-sliced white bread (vegan)",
          "Optional: fresh berries and mint leaves",
        ],
      },
    ],
    method: [
      "Simmer the berries, water, jam, sugar and lemon zest together for a few minutes until juicy. Strain, keeping both the fruit and the liquid.",
      "Beat the cream cheese, sour cream, icing sugar and vanilla together until smooth to make the mousse.",
      "Trim the crusts from the bread and dip each slice quickly in the reserved berry liquid.",
      "Line a pudding basin with the soaked bread, covering the base and sides with no gaps.",
      "Spoon in half the berries, then a layer of the cheesecake mousse, then the remaining berries.",
      "Top with a final layer of soaked bread to seal.",
      "Cover with a plate and weight, and refrigerate overnight.",
      "Turn out onto a serving plate just before serving.",
      "Decorate with fresh berries and mint leaves, if using.",
      "Slice and serve chilled.",
    ],
  },
  {
    slug: "chocolate-cheesecake",
    title: "Rich Chocolate Cheesecake",
    blurb: "Super-luxurious dessert that's a cinch to make and always a hit.",
    tag: "Dessert",
    image: "/images/recipes/choc-cheesecake.jpg",
    ingredients: [
      {
        items: [
          "1¾ cups (260g) vegan cookie crumbs",
          "3 tablespoons (70g) vegan margarine",
          "1 x 400ml can coconut cream",
          "1 x 250g block dark chocolate (50%)",
          "240g Angel Food cream cheese",
        ],
      },
    ],
    method: [
      "Line a 20cm cake tin with baking paper.",
      "Melt the margarine and combine with the cookie crumbs.",
      "Press into the base of the tin and bake at 180°C for 10 minutes. Cool.",
      "Place the coconut cream, chocolate and cream cheese in a double boiler and warm over medium heat, stirring often, until melted and smooth.",
      "Pour into a food processor and blend until silky, then pour over the cookie base.",
      "Refrigerate for several hours, or until firm enough to slice — this can be made 1–2 days ahead.",
      "Serve with fresh fruit or a raspberry sauce.",
    ],
    tip: "Keeps in the fridge for several days, or freeze in single-serve portions for a few months.",
  },
  {
    slug: "vanilla-cheesecake",
    title: "Vanilla Cheesecake",
    blurb:
      "Luscious, rich and creamy cheesecake — perfect with your favourite fruity toppings.",
    tag: "Dessert",
    image: "/images/recipes/vanilla-cheesecake.jpg",
    serves: "8 servings (12cm tin)",
    ingredients: [
      {
        items: [
          "90g plain vegan biscuits",
          "60g vegan butter or margarine, melted",
          "550g Angel Food cream cheese",
          "160ml full-fat coconut cream",
          "⅓ cup icing sugar",
          "½ teaspoon vanilla extract",
        ],
      },
    ],
    method: [
      "Blitz the biscuits into crumbs, combine with the melted margarine and stir well.",
      "Press the mixture evenly into the base of a springform or loose-bottom cake tin. Refrigerate.",
      "Gently heat the cream cheese and coconut cream until soft, then blend with the icing sugar and vanilla in a food processor until smooth.",
      "Pour the cream cheese filling onto the biscuit base.",
      "Refrigerate the cheesecake overnight to set.",
      "Slide a thin knife around the edges to release, then top with your desired toppings.",
    ],
  },
  {
    slug: "strawberry-icebox-cake",
    title: "Strawberry Icebox Cake",
    blurb:
      "Super-summery make-ahead dessert, rich with cream cheese and fresh strawberries.",
    tag: "Sweet",
    image: "/images/recipes/strawberry-icebox.jpg",
    ingredients: [
      {
        items: [
          "200g Angel Food cream cheese",
          "300g coconut cream",
          "200g firm tofu",
          "¾ cup icing sugar",
          "Big pinch of salt",
          "1½ teaspoons vanilla extract",
          "140g plain or vanilla vegan cookies (gluten-free if required)",
          "500g fresh strawberries, hulled and very thinly sliced",
        ],
      },
    ],
    method: [
      "Line a 9-inch loaf pan with parchment paper.",
      "Blend the cream cheese and tofu until smooth, then add the coconut cream, icing sugar, salt and vanilla and blend again until creamy.",
      "Set aside 1 cup of the cream cheese mix for the top layer.",
      "Cover the base of the loaf tin with about 1cm of the cream cheese mix.",
      "Layer the cookies over the top, breaking as needed for even coverage.",
      "Top with a third of the sliced strawberries, spread evenly.",
      "Repeat the layers — cream, biscuits, strawberries — twice more.",
      "Finish the final strawberry layer with the reserved cream.",
      "Refrigerate overnight.",
      "Turn out onto a serving dish, decorate with fresh fruit, and slice to serve.",
    ],
  },
];

export const WHOLESALE = [
  "Moore Wilson",
  "Bidfood",
  "Davis Trading",
  "Gilmours",
  "Service Foods",
];
