import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  // Sandbox preview is fully disallowed. Production config would allow public
  // pages and disallow private/transactional routes (auth is the real control).
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: "https://example.invalid/sitemap.xml",
  };
}
