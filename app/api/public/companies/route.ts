import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/data/companies";
import { ok, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/public/companies
 *
 * Progressive enhancement / client fetch — not the SSR first-paint path.
 * Prefer `lib/data/companies` from Server Components.
 */
export async function GET() {
  try {
    const data = await getCompanies();

    const response = NextResponse.json(ok(data));
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    return response;
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
