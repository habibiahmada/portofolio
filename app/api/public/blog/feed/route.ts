import { NextRequest, NextResponse } from "next/server";
import {
  BLOG_PAGE_SIZE_MAX,
  getPostSummaries,
  isBlogCategory,
} from "@/lib/data/blog";
import { fail, ok, serverError } from "@/lib/supabase/api-response";

export const runtime = "nodejs";

/**
 * GET /api/public/blog/feed?offset=0&limit=10&category=web
 * Paged post summaries (no body_md) for the blog list's infinite scroll.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const offset = Number.parseInt(params.get("offset") ?? "0", 10);
  const limit = Number.parseInt(params.get("limit") ?? "10", 10);
  const rawCategory = params.get("category");

  if (!Number.isInteger(offset) || offset < 0 || offset > 10_000) {
    return NextResponse.json(fail("offset must be a whole number from 0.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > BLOG_PAGE_SIZE_MAX) {
    return NextResponse.json(
      fail(`limit must be between 1 and ${BLOG_PAGE_SIZE_MAX}.`, "VALIDATION_ERROR"),
      { status: 400 },
    );
  }
  if (rawCategory && !isBlogCategory(rawCategory)) {
    return NextResponse.json(fail("Unknown category.", "VALIDATION_ERROR"), { status: 400 });
  }

  try {
    const category = rawCategory && isBlogCategory(rawCategory) ? rawCategory : null;
    const { posts, total } = await getPostSummaries(category, offset, limit);
    return NextResponse.json(ok(posts, { total, offset, limit }), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("[BLOG_FEED]", err instanceof Error ? err.message : err);
    return NextResponse.json(serverError("Failed to load posts."), { status: 500 });
  }
}
