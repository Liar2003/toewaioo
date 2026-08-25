import type { MetadataRoute } from "next";

// PLACEHOLDER domain — replace before production deployment.
const SITE_URL = "https://example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
