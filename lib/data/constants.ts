/** ISR / cache defaults for public portfolio data */
export const DATA_REVALIDATE_SECONDS = 60;

/** Blog pages revalidate less often; agent POSTs call revalidateTag on create. */
export const BLOG_REVALIDATE_SECONDS = 300;

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
