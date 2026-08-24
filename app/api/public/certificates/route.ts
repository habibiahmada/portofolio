import { NextRequest, NextResponse } from "next/server";
import { getCertificates } from "@/lib/data/certificates";
import { okPaginated, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/public/certificates
 *
 * Progressive enhancement / load-more — not the SSR first-paint path.
 * Prefer `lib/data/certificates` from Server Components for pinned + page 1.
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
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("page_size")) || 50),
    );
    const pinnedParam = searchParams.get("pinned");
    const pinned =
      pinnedParam === "true"
        ? true
        : pinnedParam === "false"
          ? false
          : undefined;

    const { items, total } = await getCertificates({ page, pageSize, pinned });

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
