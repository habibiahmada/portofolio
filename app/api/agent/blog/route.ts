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
  jakartaDayWindow,
  validateAgentBlogPayload,
} from "@/lib/agent-blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/agent/blog — create one published post (agent-hub only).
 * Contract: docs/blog.md §7. Errors: 401 token, 409 slug, 429 quota, 400 validation.
 */
export async function POST(request: NextRequest) {
  // Extra per-IP rate limit on top of the daily quota (docs/blog.md §11: ~5/hour).
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      fail("Too many requests. Try again later.", "RATE_LIMIT_EXCEEDED"),
      { status: 429 },
    );
  }

  // 1. Timing-safe bearer token check. Admin client is only used after this passes.
  const tokenError = assertAgentBlogToken(request);
  if (tokenError) {
    return NextResponse.json(fail(tokenError.message, tokenError.code), {
      status: tokenError.status,
    });
  }

  // 2. Payload size limit before parsing.
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

  // 3. Schema validation (manual, matching repo style).
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

  const supabase = getSupabaseAdmin();

  // 4. Slug uniqueness → 409 so the agent can detect its own duplicates
  //    (idempotent retry) even when the daily quota is already spent.
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

  // 5. Daily quota: max 1 agent create per Asia/Jakarta calendar day.
  const window = jakartaDayWindow();
  const { count, error: quotaError } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact" })
    .eq("source", "agent")
    .gte("created_at", window.startIso)
    .lt("created_at", window.endIso);

  if (quotaError) {
    console.error("[BLOG_AGENT] quota check failed:", quotaError.message);
    return NextResponse.json(serverFail(), { status: 500 });
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

  // 6. Insert as published via service role.
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
      status: "published",
      cover_url: null,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      canonical_url: null,
      reading_time_minutes: computeReadingTimeMinutes(post.body_md),
      source: "agent",
      published_at: nowIso,
    })
    .select()
    .single();

  if (error) {
    // Postgres unique violation → race on the pre-check above.
    if (error.code === "23505") {
      return NextResponse.json(
        fail(`Slug "${post.slug}" already exists. Pick another slug.`, "SLUG_CONFLICT"),
        { status: 409 },
      );
    }
    console.error("[BLOG_AGENT] insert failed:", error.message);
    return NextResponse.json(serverFail(), { status: 500 });
  }

  // 7. Revalidate blog pages; a revalidation hiccup must not fail the create.
  try {
    revalidateTag(DATA_TAGS.blog, "max");
  } catch (err) {
    console.error("[BLOG_AGENT] revalidateTag failed:", err);
  }

  // 8. Audit log without any secrets.
  console.log(`[BLOG_AGENT] created slug=${post.slug}`);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  return NextResponse.json(ok({ id: data.id, slug: data.slug, url: `${siteUrl}/blog/${data.slug}` }), {
    status: 201,
  });
}

function serverFail() {
  return fail("Internal server error.", "INTERNAL_ERROR");
}
