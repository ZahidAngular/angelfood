import type { MetadataRoute } from "next";
import { recipeApi, recipeSlug, type Recipe } from "@/lib/api";
import { SITE_URL, NUTRITION_INFO } from "@/lib/site";
import { BLOG_BASE_PATH, getBlogPosts } from "@/lib/blog";
import { STORE_PRODUCTS } from "@/lib/store";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "monthly", priority: 0.9 },
  { path: "/recipes", changeFrequency: "weekly", priority: 0.9 },
  { path: BLOG_BASE_PATH, changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/where-to-buy", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/ingredients-nutrition-info", changeFrequency: "monthly", priority: 0.6 },
  { path: "/cheese-made-easy-and-dairy-free", changeFrequency: "monthly", priority: 0.6 },
  { path: "/store", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-of-website-use", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-of-trade", changeFrequency: "yearly", priority: 0.2 },
  { path: "/social-media-giveaway-ts-cs", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const recipes: Recipe[] = await recipeApi.getAll().catch(() => []);
  const recipeEntries: MetadataRoute.Sitemap = recipes.map((r) => ({
    url: `${SITE_URL}/recipes/${recipeSlug(r.title)}`,
    lastModified: r.updatedAt ? new Date(r.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const nutritionEntries: MetadataRoute.Sitemap = NUTRITION_INFO.map((n) => ({
    url: `${SITE_URL}/ingredients-nutrition-info/${n.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const blogEntries: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${SITE_URL}${BLOG_BASE_PATH}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const storeEntries: MetadataRoute.Sitemap = STORE_PRODUCTS.map((product) => ({
    url: `${SITE_URL}/store/p/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticEntries,
    ...recipeEntries,
    ...nutritionEntries,
    ...blogEntries,
    ...storeEntries,
  ];
}
