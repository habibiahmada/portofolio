import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/supabase/api-response";
import { checkRateLimit, getClientIp } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/public/blog/[id]/view — increment view_count (best-effort).
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await context.params;
  if (!postId) {
    return NextResponse.json(fail("id is required.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`blog-view:${ip}:${postId}`, 40, 60 * 60 * 1000)) {
    return NextResponse.json(fail("Too many requests.", "RATE_LIMITED"), {
      status: 429,
    });
  }

  const admin = getSupabaseAdmin();
  const { data: row, error: readError } = await admin
    .from("blog_posts")
    .select("id, status, view_count")
    .eq("id", postId)
    .eq("status", "published")
    .maybeSingle();

  if (readError || !row) {
    return NextResponse.json(fail("Post not found.", "NOT_FOUND"), {
      status: 404,
    });
  }

  const next = (Number((row as { view_count?: number }).view_count) || 0) + 1;
  const { error: updateError } = await admin
    .from("blog_posts")
    .update({ view_count: next, updated_at: new Date().toISOString() })
    .eq("id", postId);

  if (updateError) {
    return NextResponse.json(fail(updateError.message, "DB_ERROR"), {
      status: 400,
    });
  }

  return NextResponse.json(ok({ view_count: next }));
}
