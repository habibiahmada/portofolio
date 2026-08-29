import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/supabase/api-response";
import { DATA_TAGS } from "@/lib/data/constants";
import { checkRateLimit, getClientIp } from "@/lib/security";
import {
  AGENT_BLOG_MAX_BODY_BYTES,
  assertAgentBlogToken,
  computeReadingTimeMinutes,
  createPreviewToken,
  jakartaDayWindow,
  reviewDeadlineFromNow,
  siteBaseUrl,
  validateAgentBlogPayload,
} from "@/lib/agent-blog";
import { getAgentBlogPost } from "@/lib/blog-publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/agent/blog?id= | ?slug= — fetch a post (including archived) for revision.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog-get:${ip}`, 60, 60 * 60 * 1000)) {
    return NextResponse.json(
      fail("Too many requests. Try again later.", "RATE_LIMIT_EXCEEDED"),
      { status: 429 },
    );
  }

  const tokenError = assertAgentBlogToken(request);
  if (tokenError) {
    return NextResponse.json(fail(tokenError.message, tokenError.code), {
      status: tokenError.status,
    });
  }

  const id = request.nextUrl.searchParams.get("id")?.trim() || "";
  const slug = request.nextUrl.searchParams.get("slug")?.trim() || "";
  if (!id && !slug) {
    return NextResponse.json(
      fail('Query "id" or "slug" is required.', "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  const post = await getAgentBlogPost({ id: id || undefined, slug: slug || undefined });
  if (!post) {
    return NextResponse.json(fail("Post not found.", "NOT_FOUND"), { status: 404 });
  }

  return NextResponse.json(ok(post));
}

/**
 * POST /api/agent/blog — create one draft for review (agent-hub).
 * Returns preview_url + review_deadline_at. Public URL only after approve/auto-publish.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      fail("Too many requests. Try again later.", "RATE_LIMIT_EXCEEDED"),
      { status: 429 },
    );
  }

  const tokenError = assertAgentBlogToken(request);
  if (tokenError) {
    return NextResponse.json(fail(tokenError.message, tokenError.code), {
      status: tokenError.status,
    });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json(fail("Could not read request body.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }
  if (Buffer.byteLength(raw, "utf8") > AGENT_BLOG_MAX_BODY_BYTES) {
    return NextResponse.json(
      fail(`Payload exceeds ${AGENT_BLOG_MAX_BODY_BYTES} bytes.`, "PAYLOAD_TOO_LARGE"),
      { status: 413 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(fail("Body must be valid JSON.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }
  const validated = validateAgentBlogPayload(parsed);
  if (!validated.ok) {
    return NextResponse.json(fail(validated.error.message, validated.error.code), {
      status: validated.error.status,
    });
  }
  const post = validated.value;

  const bodyObj =
    typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  const requestedMinutes = Number(bodyObj.review_minutes);
  const reviewMinutes =
    Number.isFinite(requestedMinutes) && requestedMinutes > 0
      ? Math.min(requestedMinutes, 24 * 60)
      : undefined;

  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", post.slug)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      fail(`Slug "${post.slug}" already exists. Pick another slug.`, "SLUG_CONFLICT"),
      { status: 409 },
    );
  }

  const window = jakartaDayWindow();
  const { count, error: quotaError } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact" })
    .eq("source", "agent")
    .gte("created_at", window.startIso)
    .lt("created_at", window.endIso);

  if (quotaError) {
    console.error("[BLOG_AGENT] quota check failed:", quotaError.message);
    return NextResponse.json(fail("Internal server error.", "INTERNAL_ERROR"), {
      status: 500,
    });
  }
  if ((count ?? 0) >= 1) {
    return NextResponse.json(
      fail(
        "Daily quota exceeded: at most one agent post per calendar day (Asia/Jakarta).",
        "QUOTA_EXCEEDED",
      ),
      { status: 429 },
    );
  }

  const previewToken = createPreviewToken();
  const reviewDeadline = reviewDeadlineFromNow(undefined, reviewMinutes);
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug: post.slug,
      title: post.title,
      description: post.description,
      body_md: post.body_md,
      category: post.category,
      tags: post.tags,
      locale: "en",
      status: "draft",
      cover_url: post.cover_url,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      canonical_url: null,
      reading_time_minutes: computeReadingTimeMinutes(post.body_md),
      source: "agent",
      preview_token: previewToken,
      review_deadline_at: reviewDeadline,
      published_at: null,
    })
    .select("id, slug, title, status, preview_token, review_deadline_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        fail(`Slug "${post.slug}" already exists. Pick another slug.`, "SLUG_CONFLICT"),
        { status: 409 },
      );
    }
    console.error("[BLOG_AGENT] insert failed:", error.message);
    return NextResponse.json(fail("Internal server error.", "INTERNAL_ERROR"), {
      status: 500,
    });
  }

  try {
    revalidateTag(DATA_TAGS.blog, "max");
  } catch (err) {
    console.error("[BLOG_AGENT] revalidateTag failed:", err);
  }

  const base = siteBaseUrl();
  const previewUrl = `${base}/blog/preview/${data.preview_token}`;
  console.log(`[BLOG_AGENT] draft slug=${data.slug} deadline=${reviewDeadline}`);

  return NextResponse.json(
    ok({
      id: data.id,
      slug: data.slug,
      title: data.title,
      status: data.status,
      preview_url: previewUrl,
      review_deadline_at: data.review_deadline_at,
      // Public URL only after approve — kept null for clarity
      url: null,
      created_at: nowIso,
    }),
    { status: 201 },
  );
}
