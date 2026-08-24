import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-metadata";
import { getCaseStudySlugs } from "@/lib/data/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const projectPages = getCaseStudySlugs().map((slug) => ({
    url: `${SITE.url}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE.url}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...projectPages,
  ];
}
