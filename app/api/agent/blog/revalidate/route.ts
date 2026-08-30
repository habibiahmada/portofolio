import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ok, fail } from "@/lib/supabase/api-response";
import { DATA_TAGS } from "@/lib/data/constants";
import { assertAgentBlogToken } from "@/lib/agent-blog";
import { checkRateLimit, getClientIp } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/agent/blog/revalidate — purge ISR cache after direct DB maintenance. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog-revalidate:${ip}`, 30, 60 * 60 * 1000)) {
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
    revalidateTag(DATA_TAGS.blog, "max");
  } catch (err) {
    console.error("[BLOG_AGENT] revalidateTag failed:", err);
    return NextResponse.json(fail("Could not revalidate blog cache.", "REVALIDATE_FAILED"), {
      status: 500,
    });
  }

  return NextResponse.json(ok({ revalidated: true, tag: DATA_TAGS.blog }));
}
