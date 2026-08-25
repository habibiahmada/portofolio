import { NextRequest, NextResponse } from "next/server";
import { ok, fail } from "@/lib/supabase/api-response";
import { assertAgentBlogToken } from "@/lib/agent-blog";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { publishBlogPost, rejectBlogPost } from "@/lib/blog-publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/agent/blog/review — approve or reject a draft (agent-hub / Telegram).
 * Body: { id: string, action: "approve" | "reject" }
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog-review:${ip}`, 30, 60 * 60 * 1000)) {
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

  let body: { id?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail("Body must be valid JSON.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const action = body.action === "approve" || body.action === "reject" ? body.action : null;
  if (!id || !action) {
    return NextResponse.json(
      fail('id and action ("approve"|"reject") are required.', "VALIDATION_ERROR"),
      { status: 400 },
    );
  }

  if (action === "approve") {
    const published = await publishBlogPost(id);
    if (!published) {
      return NextResponse.json(
        fail("Draft not found or already handled.", "NOT_FOUND"),
        { status: 404 },
      );
    }
    return NextResponse.json(ok({ action: "approve", ...published }));
  }

  const rejected = await rejectBlogPost(id);
  if (!rejected) {
    return NextResponse.json(
      fail("Draft not found or already handled.", "NOT_FOUND"),
      { status: 404 },
    );
  }
  return NextResponse.json(ok({ action: "reject", ...rejected }));
}
