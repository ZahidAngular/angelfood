/**
 * URL mapping between the slugs our title-based generator produces and the
 * slugs the old angelfood.co.nz site used.
 *
 * Recipes serve on BOTH addresses — the recipe route matches either slug, so
 * neither one 404s and no redirect is involved. The old URL is still the
 * canonical one (it carries the search rankings and inbound links), which the
 * page declares with a canonical link tag so search engines index just the one.
 *
 * No imports here on purpose: `next.config.ts` loads this file, so it has to
 * stay free of app-only dependencies.
 */

/** generated recipe slug -> live angelfood.co.nz recipe slug */
export const LEGACY_RECIPE_SLUGS: Record<string, string> = {
  "rich-chocolate-cheesecake": "chocolate-cheesecake",
  "vegan-sweetcorn-feta-muffins": "corn-feta-muffins",
  "easy-vegan-mac-cheese": "easy-vegan-mac-amp-cheese",
  "no-egg-sandwich-filling": "egg-free-sandwich-filling",
  "vegan-pizza-bianca-with-tempeh-bacon-and-nectarine":
    "pizza-bianca-tempeh-bacon-nectarine",
  "vegan-spiced-cauliflower-tacos": "spiced-cauli-tacos",
  "viral-big-mac-tacos": "vegan-big-mac-tacos",
  "lemon-spice-marinated-feta": "vegan-marinated-feta",
  "vegan-quiche-in-a-rosti-crust": "vegan-quiche-rosti-crust",
  "savoury-fennel-shortbread": "vegan-savoury-shortbread",
};

/**
 * Pages of the older sites with no single successor, grouped by the page
 * that now covers their subject: the old news posts by the blog, stockist
 * announcements by the store finder, the meringue-era recipes by the recipes
 * page. Collected from the Wayback Machine, checked to 404 on this site.
 *
 * live angelfood.co.nz path -> old paths
 */
const OLD_SITE_PATHS: Record<string, string[]> = {
  "/alices-vegan-food-blog": [
    "/3101-2",
    "/5-4-3-2-1-blast-off",
    "/alice-food-angel",
    "/angel-food-featured-chantal-organics-newsletter",
    "/angel-food-goes-local",
    "/angel-food-hiring",
    "/angel-food-in-vegan-nz",
    "/angel-food-uk",
    "/angel-food-vegan-cheddar-alternative-launch",
    "/aucklands-dally-alley",
    "/bellissimo-bite",
    "/better-recycling-options-now-available",
    "/blooming-marvellous",
    "/bringing-dairy-free-option-to-the-heart-of-central-otago",
    "/carterton",
    "/christchurch-in-store-tasting",
    "/dairy-free-cheese-maker-needs-to-grow-to-stay-ahead-of-the-herd-2",
    "/dairy-free-on-the-east-coast",
    "/dining-out",
    "/dough-bros",
    "/eating-out",
    "/entrepreneur-feature",
    "/equity-campaign-update",
    "/events",
    "/every-little-thing-makes-a-difference",
    "/farm-gate-deli-kitchen",
    "/featured-supermarket-news",
    "/fly-in-to-wigram-and-grab-some-angel-food-goodies",
    "/food-done-deliciously",
    "/food-for-the-soul",
    "/from-south-to-north",
    "/get-philosophical-in-hamilton",
    "/happy-birthday-hell",
    "/havelock-north",
    "/hell",
    "/hello-mt-roskill",
    "/hello-wellington-hastings-and-christchurch",
    "/hey-want-work-angel-food",
    "/huckleberry-esplanade-rd",
    "/in-the-supermarket-news",
    "/join-campaign-bring-even-vegan-cheesy-joy-nz",
    "/kapiti-coast-option",
    "/kilbirnie-but-not-in-scotland",
    "/liquid-smoke-in-the-bay",
    "/look-out-papakura",
    "/meet-our-office-manager",
    "/more-power-to-you",
    "/new-interview",
    "/new-video-tart-bakery",
    "/petone",
    "/phew-big-changes",
    "/pizza-paradise",
    "/ponsonby-news-talks-alice-angel-food",
    "/radio-radio",
    "/reach-out-and-well-be-there",
    "/reality-bites-cafe-grocer",
    "/salami-pre-sales",
    "/slices-of-the-angel-food-pie-for-sale",
    "/somethings-cooking-kitchen",
    "/spring-approaches",
    "/stay-safe",
    "/the-lime-room",
    "/the-stars-are-bright-in-twizel",
    "/theyve-been-in-business-since-1938",
    "/thoughts-uk-visit",
    "/tutto-benne-italian-restaurant",
    "/vegan-store-opens-wellington-today",
    "/vegeland-mairangi-bay",
    "/viva-angel-food",
    "/waikato-hiring",
  ],
  "/where-to-buy": [
    "/a-heap-of-new-stockists",
    "/bin-inn-orewa",
    "/bin-inn-papamoa",
    "/four-square-eketahuna",
    "/fresh-choice-glen-eden",
    "/fresh-choice-greytown",
    "/fresh-choice-ranui",
    "/hutt-city-new-world",
    "/moore-wilsons",
    "/new-north-island-stockists",
    "/new-stockist-in-south-auckland",
    "/new-stockists",
    "/new-stockists-2",
    "/new-stockists-pizza",
    "/new-waikato-stockist",
    "/new-wanganui-stockist",
    "/new-world-glenview",
    "/new-world-kawerau",
    "/new-world-kerikeri",
    "/new-world-motueka",
    "/new-world-nationwide",
    "/new-world-otaki",
    "/new-world-porirua",
    "/new-world-thorndon",
    "/new-world-waipukurau",
    "/newlands-new-world",
    "/our-first-pak-n-save",
    "/poetry-new-stockists",
    "/stockists-news",
    "/stockists-update",
    "/store-gore-2",
    "/three-new-stockists-today",
  ],
  "/recipes": [
    "/a-recipe-not-to-sneeze-at",
    "/baked_treats.htm",
    "/confectionery.htm",
    "/confectionery_baked_alaska.htm",
    "/confectionery_choc_al_meringue.htm",
    "/confectionery_choc_raz_marshie.htm",
    "/confectionery_cocoa_mallow.htm",
    "/confectionery_layer_cake.htm",
    "/confectionery_lemon_slice.htm",
    "/confectionery_marshie_cone.htm",
    "/confectionery_marshie_gallery.htm",
    "/confectionery_marshie_tips.htm",
    "/confectionery_meringue.htm",
    "/confectionery_meringue_gallery.htm",
    "/confectionery_mint_marshie.htm",
    "/confectionery_mmkit.htm",
    "/confectionery_raspberry_whip.htm",
    "/confectionery_sarah_pavlova.htm",
    "/making-creamy-sauces-soups-without-adding-dairy",
    "/marshmallows_video1.htm",
    "/marshmallows_video2.htm",
    "/meringue_inst01.htm",
    "/meringue_inst02.htm",
    "/meringue_inst03.htm",
    "/meringue_inst04.htm",
    "/meringue_inst05.htm",
    "/meringue_inst06.htm",
    "/meringue_inst07.htm",
    "/meringue_inst08.htm",
    "/meringue_inst09.htm",
    "/meringue_inst10.htm",
    "/new-delicious-easy",
    "/new-recipe",
    "/new-winter-recipe",
  ],
  "/products": [
    "/cheese.htm",
    "/dairyfree-cheesy-sauce-mix-alternative",
    "/heat-eat-dairy-free-cheese-sauce",
    "/own-brand.html",
    "/products/dairyfree",
    "/products/marshmallows",
    "/products/meringues",
    "/products/meringues/instructions.htm",
    "/products/meringues/instructions.php",
    "/tasty-version-of-our-cheesey-sauce",
  ],
  "/about": [
    "/go-dairy-free",
    "/imported.html",
    "/inspiration",
    "/links",
    "/links.htm",
    "/our-auckland-showroom.html",
    "/press_0706_northsouth.htm",
    "/press_0706_nz_housegarden.htm",
    "/press_0707_viva.htm",
    "/press_0709_viva.htm",
    "/press_0710_nz_gardener.htm",
    "/resources",
    "/see",
    "/vegan",
    "/vegan.html",
    "/videos",
    "/videos.html",
  ],
  "/ingredients-nutrition-info": [
    "/allergen_info.htm",
  ],
  "/ingredients-nutrition-info/sour-cream": [
    "/tasty-ideas-sour-cream-alternative",
  ],
  "/contact": [
    "/contact/order.htm",
    "/customer-survey",
  ],
  "/": [
    "/2013",
    "/a",
    "/sold",
  ],
};

/**
 * Standalone pages whose route folder was renamed to the old site's URL. The
 * name we had used first still resolves, via a redirect.
 *
 * old path we used -> live angelfood.co.nz path
 */
export const LEGACY_PAGE_PATHS: Record<string, string> = {
  "/social-media-giveaway-terms": "/social-media-giveaway-ts-cs",
  "/terms-and-conditions-of-trade": "/terms-of-trade",
  // The old Squarespace site served the homepage at /home as well as /.
  "/home": "/",
  // Dead links carried over from the old site's earlier URL structure —
  // both www.angelfood.co.nz and this rebuild 404 at these exact paths, but
  // the content lives on under /ingredients-nutrition-info/<slug> now.
  "/feta": "/ingredients-nutrition-info/feta",
  "/grated-cheese": "/ingredients-nutrition-info/grated-cheese",
  "/sour-cream": "/ingredients-nutrition-info/sour-cream",
  "/dairyfree-cheddar-alternative": "/ingredients-nutrition-info/cheddar-block",
  "/dairyfree-mozzarella-alternative": "/ingredients-nutrition-info/mozza-block",
  "/dairy-free-parmesan-alternative": "/ingredients-nutrition-info/parmesan",
  "/recipes/quick-pickled-onions": "/recipes/quick-pickled-red-onions",

  // Older generations of the site, still linked from elsewhere on the web.
  // Ahrefs followed those links into 404s and reported broken redirects; each
  // now lands on the page that took over its content.
  "/product/dairy-free-cheddar-alternative": "/ingredients-nutrition-info/cheddar-block",
  "/product/dairy-free-mozzarella-alternative": "/ingredients-nutrition-info/mozza-block",
  "/product/dairy-free-sour-cream-alternative": "/ingredients-nutrition-info/sour-cream",
  "/product/dairy-free-parmesan-alternative-smoky": "/ingredients-nutrition-info/parmesan",
  "/product/angel-food-dairy-free-parmesan-alternative": "/ingredients-nutrition-info/parmesan",
  "/store/dairy-free-parmesan-alternative": "/ingredients-nutrition-info/parmesan",
  "/dairyfree-feta-alternative": "/ingredients-nutrition-info/feta",
  "/dairy-free-cream-cheese-alternative": "/ingredients-nutrition-info/cream-cheese",
  "/dairyfree-smoky-parmesan-alternative": "/ingredients-nutrition-info/parmesan",
  "/dairyfree-smoked-cheddar-alternative": "/ingredients-nutrition-info/cheddar-block",
  "/dairyfree-cheddar-alternative-2": "/ingredients-nutrition-info/cheddar-block",
  "/parmesan-100g": "/ingredients-nutrition-info/parmesan",
  "/grated-smoked-cheddar": "/ingredients-nutrition-info/grated-cheese",
  "/all-products": "/products",
  "/our-products.html": "/products",
  "/our-story": "/about",
  "/our-story-1": "/about",
  "/ourstory": "/about",
  "/about.htm": "/about",
  "/press.htm": "/about",
  "/media-kit": "/about",
  "/contact-us": "/contact",
  "/faqs": "/help-centre",
  "/suitability-angel-food-products": "/help-centre",
  "/sign-up": "/subscribe",
  "/terms.html": "/terms-of-website-use",
  "/index.htm": "/",
  "/index.php": "/",
  "/news": "/alices-vegan-food-blog",
  "/news.html": "/alices-vegan-food-blog",
  "/old-news": "/alices-vegan-food-blog",
  "/stockists.htm": "/where-to-buy",
  "/shops.html": "/where-to-buy",
  "/online-retailers.html": "/where-to-buy",
  "/shopping.html": "/where-to-buy",
  "/buy-online.html": "/where-to-buy",
  "/order.htm": "/where-to-buy",
  "/buy-bay-plenty": "/where-to-buy",
  "/buy-gisborne-hawkes-bay": "/where-to-buy",
  "/buy-manawatu-wanganui": "/where-to-buy",
  "/buy-nelson-marlborough-golden-bay": "/where-to-buy",
  "/buy-otago-southland": "/where-to-buy",
  "/buy-wellington-wairarapa": "/where-to-buy",
  ...Object.fromEntries(
    Object.entries(OLD_SITE_PATHS).flatMap(([to, froms]) =>
      froms.map((from) => [from, to])
    )
  ),
};

/**
 * Whole sections of the old site, redirected along with everything under
 * them: the old news and blog posts to the blog, old recipe and product pages
 * to their listings. Their posts have no one-to-one successor, so the section
 * page is the nearest thing to what the link promised.
 *
 * Never list a path that is also a route here. Firebase applies redirects
 * before it serves files, so `/products/**` would redirect the route's own
 * prefetch files (`/products/__next.products.txt`) along with it.
 *
 * old section -> live angelfood.co.nz path
 */
export const LEGACY_SECTION_PATHS: Record<string, string> = {
  "/our-news": "/alices-vegan-food-blog",
  "/blog": "/alices-vegan-food-blog",
  "/blog-my-vegan-life": "/alices-vegan-food-blog",
  "/recipe": "/recipes",
  "/product": "/products",
  "/stockists": "/where-to-buy",
  "/shop": "/where-to-buy",
  "/press": "/about",
  "/newsletter": "/subscribe",
  "/classes": "/cheese-made-easy-and-dairy-free",
  // The old catalogue system's product and category pages.
  "/webapps": "/products",
  // Search results, scripts and stray CMS paths: nothing to succeed them.
  "/search": "/",
  "/uploads": "/",
  "/taf": "/",
  "/Pacific": "/",
  "/244997": "/",
};

/**
 * Permanent redirects for the standalone pages and sections above. Recipes
 * are deliberately absent — their route serves both slugs directly, so there
 * is nothing to redirect. These paths have no page of their own, so a
 * redirect is the only way to stop them 404ing.
 *
 * firebase.json carries the same list by hand, with `/**` for `:path*`.
 */
export function legacyRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const pages = Object.entries(LEGACY_PAGE_PATHS);
  const sections = Object.entries(LEGACY_SECTION_PATHS).map(
    ([from, to]) => [`${from}/:path*`, to] as const
  );
  return [...pages, ...sections].map(([from, to]) => ({
    source: from,
    destination: to,
    permanent: true,
  }));
}
