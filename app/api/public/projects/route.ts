import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects";
import { okPaginated, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/public/projects
 *
 * Progressive enhancement / client fetch — not the SSR first-paint path.
 * Prefer `lib/data/projects` from Server Components for primary render.
 *
 * Query params:
 *   page       - page number (default 1)
 *   page_size  - items per page (default 50)
 *   year       - filter by year
 *   featured   - comma-separated project IDs to pin first
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("page_size")) || 50),
    );
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : undefined;
    const featured = searchParams.get("featured");
    const featuredIds = featured
      ? featured
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const { items, total } = await getProjects({
      page,
      pageSize,
      year: Number.isFinite(year) ? year : undefined,
      featuredIds,
    });

    const response = NextResponse.json(okPaginated(items, total, page, pageSize));
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    return response;
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
