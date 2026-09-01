import { NextResponse } from "next/server";
import { buildTerminalProjects } from "@/lib/data/terminal-export";
import { ok, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/public/terminal/projects
 *
 * Enriched project list for the Go terminal (slug, featured, sanitized URLs).
 */
export async function GET() {
  try {
    const data = await buildTerminalProjects();
    const response = NextResponse.json(ok(data));
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(serverError(message), { status: 500 });
  }
}
