import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-metadata";

/**
 * Search Console / crawler rules.
 * Public pages are allowed; admin, login, and APIs stay out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin/", "/admin", "/login/", "/login", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/projects", "/blog", "/services", "/sitemap.xml"],
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/about", "/projects", "/blog", "/services", "/sitemap.xml"],
        disallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/images/", "/data/", "/open-graph/", "/icons/"],
        disallow,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url.replace(/^https?:\/\//, ""),
  };
}
