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
};

/**
 * Permanent redirects for the standalone pages above. Recipes are deliberately
 * absent — their route serves both slugs directly, so there is nothing to
 * redirect. These paths have no page of their own, so a redirect is the only
 * way to stop them 404ing.
 */
export function legacyRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  return Object.entries(LEGACY_PAGE_PATHS).map(([from, to]) => ({
    source: from,
    destination: to,
    permanent: true,
  }));
}
