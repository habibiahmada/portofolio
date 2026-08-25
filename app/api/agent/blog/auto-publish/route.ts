import { NextRequest, NextResponse } from "next/server";
import { ok, fail } from "@/lib/supabase/api-response";
import { assertAgentBlogToken } from "@/lib/agent-blog";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { autoPublishExpiredDrafts } from "@/lib/blog-publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/agent/blog/auto-publish — publish drafts past review_deadline_at.
 * Called by agent-hub scheduler (one-shot).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog-auto:${ip}`, 10, 60 * 60 * 1000)) {
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

  try {
    const published = await autoPublishExpiredDrafts();
    console.log(`[BLOG_AGENT] auto-published count=${published.length}`);
    return NextResponse.json(ok({ count: published.length, published }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "auto-publish failed";
    console.error("[BLOG_AGENT] auto-publish failed:", message);
    return NextResponse.json(fail(message, "INTERNAL_ERROR"), { status: 500 });
  }
}
