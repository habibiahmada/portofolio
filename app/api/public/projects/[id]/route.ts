import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/data/projects";
import { ok, notFound, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/public/projects/:id
 *
 * Client/detail fetch — prefer `getProjectById` from Server Components when possible.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getProjectById(id);

    if (!data) {
      return NextResponse.json(notFound("Project not found"), { status: 404 });
    }

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
