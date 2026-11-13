/**
 * ISR / cache window for public portfolio data. Every page that reads this
 * data inherits the window, and each rebuild costs ISR writes and CPU on the
 * shared Vercel Hobby quota. Projects, companies and certificates change a few
 * times a month, so one day is enough.
 */
export const DATA_REVALIDATE_SECONDS = 60 * 60 * 24;

/**
 * Blog posts change through the agent API, which calls revalidateTag("blog")
 * on every write, so new posts show up right away. The timer is only a fallback
 * for direct database edits.
 */
export const BLOG_REVALIDATE_SECONDS = 60 * 60 * 24;

export const DATA_TAGS = {
  projects: "projects",
  companies: "companies",
  certificates: "certificates",
  blog: "blog",
} as const;

/** Fixed category allowlist — docs/blog.md §17. No categories table in phase 1. */
export const BLOG_CATEGORIES = [
  "programming",
  "education",
  "web",
  "career",
  "opinion",
  "news-commentary",
] as const;

/** Post lifecycle statuses — docs/blog.md §6. */
export const BLOG_STATUSES = ["draft", "published", "archived"] as const;
