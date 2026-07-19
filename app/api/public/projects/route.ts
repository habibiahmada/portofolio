import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, okPaginated, serverError } from "@/lib/supabase/api-response";
import type { ProjectRow } from "@/lib/supabase/types";

/**
 * GET /api/public/projects
 *
 * Query params:
 *   page       - page number (default 1)
 *   page_size  - items per page (default 50)
 *   year       - filter by year
 *   featured   - comma-separated project IDs to pin first
 *   locale     - 'en' | 'id' (default 'en')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("page_size")) || 50));
    const year = searchParams.get("year");
    const featured = searchParams.get("featured");

    const supabase = await getSupabaseServerClient();

    let query = supabase
      .from("projects")
      .select("*", { count: "exact" });

    if (year) {
      query = query.eq("year", Number(year));
    }

    if (featured) {
      const ids = featured.split(",").map((s) => s.trim()).filter(Boolean);
      if (ids.length > 0) {
        query = query.in("id", ids);
      }
    }

    const { data, error, count } = await query
      .order("year", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return NextResponse.json(serverError(error.message), { status: 500 });
    }

    // If featured IDs were provided, sort them to the top
    const items: ProjectRow[] = data || [];
    let sorted: ProjectRow[] = items;
    if (featured && sorted.length > 0) {
      const ids = featured.split(",").map((s) => s.trim()).filter(Boolean);
      const featuredItems: ProjectRow[] = [];
      const rest: ProjectRow[] = [];
      for (const item of sorted) {
        if (ids.includes(item.id)) featuredItems.push(item);
        else rest.push(item);
      }
      sorted = [...featuredItems, ...rest];
    }

    return NextResponse.json(
      okPaginated(sorted, count || 0, page, pageSize),
    );
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
