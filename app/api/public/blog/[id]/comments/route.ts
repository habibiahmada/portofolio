import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAnonClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/supabase/api-response";
import { checkRateLimit, getClientIp } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/public/blog/[id]/comments — list approved comments (public).
 * POST /api/public/blog/[id]/comments — submit a new comment (authenticated, goes to pending).
 */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_BODY_LENGTH = 2000;
const MAX_URLS_IN_BODY = 2;

function containsExcessiveUrls(body: string): boolean {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const matches = body.match(urlPattern);
  return (matches?.length ?? 0) > MAX_URLS_IN_BODY;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;
  const supabase = getSupabaseAnonClient();

  const { data, error } = await supabase
    .from("blog_comments")
    .select("id, body, created_at, user_id")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      fail("Failed to load comments.", "DB_ERROR"),
      { status: 500 },
    );
  }

  return NextResponse.json(ok(data || []));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;

  // Rate limit per IP
  const ip = getClientIp(request);
  if (!checkRateLimit(`blog-comment:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      fail("Too many requests. Try again later.", "RATE_LIMIT_EXCEEDED"),
      { status: 429 },
    );
  }

  // Parse body
  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      fail("Body must be valid JSON.", "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  const commentBody = body.body?.trim();
  if (!commentBody || commentBody.length === 0) {
    return NextResponse.json(
      fail("Comment body is required.", "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  if (commentBody.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      fail(`Comment must be at most ${MAX_BODY_LENGTH} characters.`, "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  // Spam check: excessive URLs
  if (containsExcessiveUrls(commentBody)) {
    return NextResponse.json(
      fail("Comment contains too many URLs.", "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  // Authenticate user
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      fail("Authentication required to comment.", "UNAUTHORIZED"),
      { status: 401 },
    );
  }

  // Verify post exists and is published
  const anonClient = getSupabaseAnonClient();
  const { data: post } = await anonClient
    .from("blog_posts")
    .select("id")
    .eq("id", postId)
    .eq("status", "published")
    .maybeSingle();

  if (!post) {
    return NextResponse.json(
      fail("Post not found.", "NOT_FOUND"),
      { status: 404 },
    );
  }

  // Insert comment (status: pending by default)
  const { data, error } = await supabase
    .from("blog_comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      body: commentBody,
      status: "pending",
    })
    .select("id, body, created_at, status")
    .single();

  if (error) {
    console.error("[BLOG_COMMENT] insert failed:", error.message);
    return NextResponse.json(
      fail("Failed to submit comment.", "DB_ERROR"),
      { status: 500 },
    );
  }

  console.log(`[BLOG_COMMENT] pending comment id=${data.id} post=${postId} user=${user.id}`);

  return NextResponse.json(
    ok({ ...data, message: "Comment submitted for moderation." }),
    { status: 201 },
  );
}
