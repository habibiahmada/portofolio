import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/data/blog";
import { ok, serverError } from "@/lib/supabase/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/public/blog — list published posts for TUI / external clients.
 * Query: page_size (default 50, max 100)
 */
export async function GET(request: NextRequest) {
  try {
    const rawSize = request.nextUrl.searchParams.get("page_size");
    let pageSize = rawSize ? parseInt(rawSize, 10) : 50;
    if (Number.isNaN(pageSize) || pageSize < 1) pageSize = 50;
    if (pageSize > 100) pageSize = 100;

    const rows = await getPublishedPosts();
    const slice = rows.slice(0, pageSize).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      body_md: p.body_md,
      category: p.category,
      tags: p.tags ?? [],
      reading_time_minutes: p.reading_time_minutes ?? 0,
      published_at: p.published_at ?? "",
    }));

    return NextResponse.json(
      ok(slice, { total: rows.length, page: 1, page_size: pageSize }),
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load blog posts";
    return NextResponse.json(serverError(message), { status: 500 });
  }
}
