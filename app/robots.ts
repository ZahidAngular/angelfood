import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Content never varies by request, so this is always safe to prerender —
// also required for a static export (Firebase Hosting) to build this route.
export const dynamic = "force-static";

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
