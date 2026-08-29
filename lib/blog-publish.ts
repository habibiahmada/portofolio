import { revalidateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { DATA_TAGS } from "@/lib/data/constants";
import type { BlogPostRow } from "@/lib/supabase/types";
import {
  computeReadingTimeMinutes,
  createPreviewToken,
  reviewDeadlineFromNow,
  siteBaseUrl,
} from "@/lib/agent-blog";

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
export async function rejectBlogPost(
  postId: string,
): Promise<{ id: string; slug: string; title: string } | null> {
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
    .select("id, slug, title")
    .maybeSingle();

  if (error || !data) return null;
  revalidateBlog();
  console.log(`[BLOG] rejected/archived slug=${data.slug}`);
  return data;
}

export type AgentBlogPostDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_md: string;
  category: string;
  tags: string[];
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  cover_url: string | null;
  locale: string;
};

/** Load a post for agent revision (draft or archived). */
export async function getAgentBlogPost(opts: {
  id?: string;
  slug?: string;
}): Promise<AgentBlogPostDetail | null> {
  const id = typeof opts.id === "string" ? opts.id.trim() : "";
  const slug = typeof opts.slug === "string" ? opts.slug.trim().toLowerCase() : "";
  if (!id && !slug) return null;

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("blog_posts")
    .select(
      "id, slug, title, description, body_md, category, tags, status, seo_title, seo_description, cover_url, locale",
    );
  query = id ? query.eq("id", id) : query.eq("slug", slug);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as AgentBlogPostDetail;
}

export type RestoreDraftFields = {
  title: string;
  description: string;
  body_md: string;
  category?: string;
  tags?: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  cover_url?: string | null;
  reviewMinutes?: number;
};

export type RestoreDraftResult = {
  id: string;
  slug: string;
  title: string;
  status: "draft";
  preview_url: string;
  review_deadline_at: string;
};

/**
 * Restore an archived (or existing draft) post as a new review draft.
 * Same row / slug — does not count against the daily create quota.
 */
export async function restoreBlogPostAsDraft(
  postId: string,
  fields: RestoreDraftFields,
): Promise<RestoreDraftResult | null> {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: loadError } = await supabase
    .from("blog_posts")
    .select("id, slug, status")
    .eq("id", postId)
    .maybeSingle();

  if (loadError || !existing) return null;
  if (existing.status === "published") return null;

  const previewToken = createPreviewToken();
  const reviewDeadline = reviewDeadlineFromNow(undefined, fields.reviewMinutes);
  const nowIso = new Date().toISOString();

  const updateData: Record<string, unknown> = {
    title: fields.title,
    description: fields.description,
    body_md: fields.body_md,
    seo_title: fields.seo_title ?? null,
    seo_description: fields.seo_description ?? null,
    cover_url: fields.cover_url ?? null,
    status: "draft",
    preview_token: previewToken,
    review_deadline_at: reviewDeadline,
    published_at: null,
    reading_time_minutes: computeReadingTimeMinutes(fields.body_md),
    updated_at: nowIso,
  };
  if (fields.category) updateData.category = fields.category;
  if (fields.tags) updateData.tags = fields.tags;

  const { data, error } = await supabase
    .from("blog_posts")
    .update(updateData)
    .eq("id", postId)
    .neq("status", "published")
    .select("id, slug, title, status, preview_token, review_deadline_at")
    .maybeSingle();

  if (error || !data) return null;

  revalidateBlog();
  const base = siteBaseUrl();
  console.log(`[BLOG] restored draft slug=${data.slug} deadline=${reviewDeadline}`);
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: "draft",
    preview_url: `${base}/blog/preview/${data.preview_token}`,
    review_deadline_at: data.review_deadline_at || reviewDeadline,
  };
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
