import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { withAdmin, type AdminSession } from "@/lib/supabase/admin-auth";
import { ok, fail } from "@/lib/supabase/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin blog comments moderation API (Task 12.3).
 * GET: list all comments for a post (all statuses).
 * PATCH: approve/reject a comment.
 * DELETE: permanently remove a comment.
 */

async function handleGet(
  request: NextRequest,
  _session: AdminSession,
  postId: string,
) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("blog_comments")
    .select("*, blog_posts!inner(slug, title)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 500 });
  }

  return NextResponse.json(ok(data || []));
}

async function handlePatch(
  request: NextRequest,
  _session: AdminSession,
  postId: string,
) {
  let body: { comment_id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail("Body must be valid JSON.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }

  if (!body.comment_id || !body.status) {
    return NextResponse.json(
      fail("comment_id and status are required.", "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  if (!["approved", "rejected", "pending"].includes(body.status)) {
    return NextResponse.json(
      fail("status must be one of: approved, rejected, pending.", "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("blog_comments")
    .update({
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.comment_id)
    .eq("post_id", postId)
    .select("id, status")
    .single();

  if (error || !data) {
    return NextResponse.json(fail("Comment not found.", "NOT_FOUND"), { status: 404 });
  }

  console.log(`[BLOG_ADMIN] comment ${data.id} → ${data.status}`);
  return NextResponse.json(ok(data));
}

async function handleDelete(
  request: NextRequest,
  _session: AdminSession,
  postId: string,
) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("comment_id")?.trim();
  if (!commentId) {
    return NextResponse.json(fail("comment_id query param is required.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("blog_comments")
    .delete()
    .eq("id", commentId)
    .eq("post_id", postId);

  if (error) {
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 500 });
  }

  console.log(`[BLOG_ADMIN] deleted comment ${commentId}`);
  return NextResponse.json(ok({ deleted: commentId }));
}

export const GET = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) =>
  withAdmin(req, async (s) => {
    const { id } = await params;
    return handleGet(req, s, id);
  });

export const PATCH = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) =>
  withAdmin(req, async (s) => {
    const { id } = await params;
    return handlePatch(req, s, id);
  });

export const DELETE = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) =>
  withAdmin(req, async (s) => {
    const { id } = await params;
    return handleDelete(req, s, id);
  });
