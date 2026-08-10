import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/legacy-slugs";

// Firebase Hosting (Spark/free plan) can only serve a plain static export —
// no server, so no next.config `redirects()` (those need to run in Firebase's
// own hosting config instead — see firebase.json). Vercel keeps the normal
// server build, unaffected, since STATIC_EXPORT is only set for the Firebase
// build command.
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      images: { unoptimized: true },
    }
  : {
      async redirects() {
        // Slugs that were renamed to match the old angelfood.co.nz URLs. The
        // old URL is what the site serves; these keep the earlier address alive.
        return legacyRedirects();
      },
    };

export default nextConfig;
