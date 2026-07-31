import type { MetadataRoute } from "next";
import { recipeApi, recipeSlug, type Recipe } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "monthly", priority: 0.9 },
  { path: "/recipes", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/where-to-buy", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/ingredients-nutrition-info", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-of-website-use", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-and-conditions-of-trade", changeFrequency: "yearly", priority: 0.2 },
  { path: "/social-media-giveaway-terms", changeFrequency: "yearly", priority: 0.2 },
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

  return [...staticEntries, ...recipeEntries];
}
