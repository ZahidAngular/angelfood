import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/legacy-slugs";

const nextConfig: NextConfig = {
  async redirects() {
    // Slugs that were renamed to match the old angelfood.co.nz URLs. The old
    // URL is what the site serves; these keep the earlier address alive.
    return legacyRedirects();
  },
};

export default nextConfig;
