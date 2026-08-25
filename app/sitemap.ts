import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-metadata";
import { getCaseStudySlugs } from "@/lib/data/case-studies";
import { getPublishedPosts } from "@/lib/data/blog";

/** All public indexable URLs for Google Search Console. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
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
      url: `${SITE.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  const projects: MetadataRoute.Sitemap = getCaseStudySlugs().map((slug) => ({
    url: `${SITE.url}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Blog posts from DB (published only, lastModified from published_at)
  const blogPosts = await getPublishedPosts();
  const blog: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...core, ...projects, ...blog];
}
