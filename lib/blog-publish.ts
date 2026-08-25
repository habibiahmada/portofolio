import { revalidateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { DATA_TAGS } from "@/lib/data/constants";
import type { BlogPostRow } from "@/lib/supabase/types";
import { siteBaseUrl } from "@/lib/agent-blog";

function revalidateBlog() {
  try {
    revalidateTag(DATA_TAGS.blog, "max");
  } catch (err) {
    console.error("[BLOG] revalidateTag failed:", err);
  }
}

export type PublishResult = {
  id: string;
  slug: string;
  url: string;
  title: string;
};

/** Promote a draft to published and invalidate preview token. */
export async function publishBlogPost(postId: string): Promise<PublishResult | null> {
  const supabase = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      status: "published",
      published_at: nowIso,
      preview_token: null,
      review_deadline_at: null,
      updated_at: nowIso,
    })
    .eq("id", postId)
    .eq("status", "draft")
    .select("id, slug, title")
    .maybeSingle();

  if (error || !data) return null;

  revalidateBlog();
  const base = siteBaseUrl();
  console.log(`[BLOG] published slug=${data.slug}`);
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    url: `${base}/blog/${data.slug}`,
  };
}

/** Reject/skip a draft: archive and drop preview. */
export async function rejectBlogPost(postId: string): Promise<{ id: string; slug: string } | null> {
  const supabase = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      status: "archived",
      preview_token: null,
      review_deadline_at: null,
      updated_at: nowIso,
    })
    .eq("id", postId)
    .eq("status", "draft")
    .select("id, slug")
    .maybeSingle();

  if (error || !data) return null;
  revalidateBlog();
  console.log(`[BLOG] rejected/archived slug=${data.slug}`);
  return data;
}

/** Load draft by preview token (service role; not cached). */
export async function getDraftByPreviewToken(
  token: string,
): Promise<BlogPostRow | null> {
  if (!token || token.length < 16) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("preview_token", token)
    .eq("status", "draft")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/** Publish all drafts whose review_deadline_at has passed. */
export async function autoPublishExpiredDrafts(): Promise<PublishResult[]> {
  const supabase = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data: due, error } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("status", "draft")
    .not("review_deadline_at", "is", null)
    .lte("review_deadline_at", nowIso);

  if (error) throw new Error(error.message);

  const published: PublishResult[] = [];
  for (const row of due || []) {
    const result = await publishBlogPost(row.id);
    if (result) published.push(result);
  }
  return published;
}
