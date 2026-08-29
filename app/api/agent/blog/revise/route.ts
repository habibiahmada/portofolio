import { NextRequest, NextResponse } from "next/server";
import { ok, fail } from "@/lib/supabase/api-response";
import {
  AGENT_BLOG_MAX_BODY_BYTES,
  assertAgentBlogToken,
  validateAgentBlogPayload,
} from "@/lib/agent-blog";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { restoreBlogPostAsDraft } from "@/lib/blog-publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/agent/blog/revise — rewrite an archived/draft post in place
 * (same slug, no daily-create quota). Used after Telegram Reject + notes.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`agent-blog-revise:${ip}`, 20, 60 * 60 * 1000)) {
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

  const body =
    typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json(fail("id is required.", "VALIDATION_ERROR"), { status: 400 });
  }

  const validated = validateAgentBlogPayload(parsed);
  if (!validated.ok) {
    return NextResponse.json(fail(validated.error.message, validated.error.code), {
      status: validated.error.status,
    });
  }
  const post = validated.value;

  const requestedMinutes = Number(body.review_minutes);
  const reviewMinutes =
    Number.isFinite(requestedMinutes) && requestedMinutes > 0
      ? Math.min(requestedMinutes, 24 * 60)
      : undefined;

  const restored = await restoreBlogPostAsDraft(id, {
    title: post.title,
    description: post.description,
    body_md: post.body_md,
    category: post.category,
    tags: post.tags,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    cover_url: post.cover_url,
    reviewMinutes,
  });

  if (!restored) {
    return NextResponse.json(
      fail("Post not found, already published, or could not be restored.", "NOT_FOUND"),
      { status: 404 },
    );
  }

  return NextResponse.json(
    ok({
      action: "revise",
      ...restored,
      url: null,
    }),
  );
}
