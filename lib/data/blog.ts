import { unstable_cache } from "next/cache";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { BlogCategory, BlogPostRow } from "@/lib/supabase/types";
import {
  BLOG_CATEGORIES,
  BLOG_REVALIDATE_SECONDS,
  DATA_TAGS,
} from "./constants";

/**
 * Server-side blog queries (phase 1). Anon client only — RLS exposes
 * published rows. Cached via unstable_cache + DATA_TAGS.blog so agent
 * POSTs revalidate with a single revalidateTag("blog").
 * Never call these through client hooks for first paint (SSR/ISR only).
 */

async function queryPublishedPosts(): Promise<BlogPostRow[]> {
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** All published posts, newest first (cached). */
export const getPublishedPosts = unstable_cache(
  queryPublishedPosts,
  ["blog-published-all"],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: [DATA_TAGS.blog] },
);

async function queryPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

/** Single published post by slug, or null (cached per slug). */
export const getPostBySlug = unstable_cache(
  queryPostBySlug,
  ["blog-post-by-slug"],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: [DATA_TAGS.blog] },
);

/** Published posts in one category, newest first. */
export async function getPostsByCategory(
  category: BlogCategory,
): Promise<BlogPostRow[]> {
  const all = await getPublishedPosts();
  return all.filter((post) => post.category === category);
}

export function isBlogCategory(value: unknown): value is BlogCategory {
  return (
    typeof value === "string" &&
    (BLOG_CATEGORIES as readonly string[]).includes(value)
  );
}
