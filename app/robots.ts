import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Signed-in areas hold no public content and shouldn't be indexed.
      disallow: ["/dashboard", "/dashboard/", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
