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
