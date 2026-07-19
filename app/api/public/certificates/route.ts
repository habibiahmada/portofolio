import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, okPaginated, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/public/certificates
 *
 * Query params:
 *   page       - page number (default 1)
 *   page_size  - items per page (default 50)
 *   pinned     - 'true' to show only pinned, 'false' for only non-pinned
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("page_size")) || 50));
    const pinned = searchParams.get("pinned");

    const supabase = await getSupabaseServerClient();

    let query = supabase
      .from("certificates")
      .select("*", { count: "exact" });

    if (pinned === "true") {
      query = query.eq("is_pinned", true);
    } else if (pinned === "false") {
      query = query.eq("is_pinned", false);
    }

    const { data, error, count } = await query
      .order("is_pinned", { ascending: false })
      .order("title", { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return NextResponse.json(serverError(error.message), { status: 500 });
    }

    return NextResponse.json(
      okPaginated(data || [], count || 0, page, pageSize),
    );
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
