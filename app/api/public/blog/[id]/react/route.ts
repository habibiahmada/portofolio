import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/supabase/api-response";
import { checkRateLimit, getClientIp } from "@/lib/security";
import type { BlogReactionRow } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_REACTIONS = ["like", "insightful", "useful"] as const;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * POST /api/public/blog/[id]/react — add or change a reaction (Task 10.2).
 * One visitor = one reaction total per post (PK: post_id + visitor_key).
 * visitor_key = SHA-256(IP + User-Agent) for anon fingerprinting.
 */

function hashVisitorKey(ip: string, userAgent: string): string {
  // Simple hash for visitor fingerprinting (not crypto-secure, just anti-spam)
  const raw = `${ip}:${userAgent.slice(0, 200)}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `v_${Math.abs(hash).toString(36)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;

  // Rate limit per IP
  const ip = getClientIp(request);
  if (!checkRateLimit(`blog-react:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      fail("Too many requests. Try again later.", "RATE_LIMIT_EXCEEDED"),
      { status: 429 },
    );
  }

  // Parse body
  let body: { reaction?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      fail("Body must be valid JSON.", "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  const reaction = body.reaction;
  if (!reaction || !VALID_REACTIONS.includes(reaction as typeof VALID_REACTIONS[number])) {
    return NextResponse.json(
      fail(
        `"reaction" must be one of: ${VALID_REACTIONS.join(", ")}.`,
        "VALIDATION_ERROR",
      ),
      { status: 400 },
    );
  }

  // Generate visitor key from IP + User-Agent
  const userAgent = request.headers.get("user-agent") || "";
  const visitorKey = hashVisitorKey(ip, userAgent);

  const supabase = getSupabaseAdmin();

  // Verify post exists and is published
  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("id, status")
    .eq("id", postId)
    .eq("status", "published")
    .maybeSingle();

  if (postError || !post) {
    return NextResponse.json(
      fail("Post not found.", "NOT_FOUND"),
      { status: 404 },
    );
  }

  // Upsert reaction (one per visitor per post)
  const { error: upsertError } = await supabase
    .from("blog_reactions")
    .upsert(
      {
        post_id: postId,
        reaction: reaction as BlogReactionRow["reaction"],
        visitor_key: visitorKey,
      },
      { onConflict: "post_id,visitor_key" },
    );

  if (upsertError) {
    console.error("[BLOG_REACT] upsert failed:", upsertError.message);
    return NextResponse.json(
      fail("Failed to save reaction.", "DB_ERROR"),
      { status: 500 },
    );
  }

  // Get updated counts
  const { data: counts } = await supabase
    .from("blog_reactions")
    .select("reaction")
    .eq("post_id", postId);

  const reactionCounts: Record<string, number> = {};
  for (const r of counts || []) {
    reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1;
  }

  // Update denormalized reaction_counts on blog_posts
  await supabase
    .from("blog_posts")
    .update({ reaction_counts: reactionCounts })
    .eq("id", postId);

  return NextResponse.json(
    ok({ reaction, counts: reactionCounts, visitor_key: visitorKey }),
  );
}

/**
 * GET /api/public/blog/[id]/react — get reaction counts for a post.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;

  const supabase = getSupabaseAdmin();

  const { data: counts } = await supabase
    .from("blog_reactions")
    .select("reaction")
    .eq("post_id", postId);

  const reactionCounts: Record<string, number> = {};
  for (const r of counts || []) {
    reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1;
  }

  return NextResponse.json(ok(reactionCounts));
}
