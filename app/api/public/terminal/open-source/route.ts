import { NextResponse } from "next/server";
import { OPEN_SOURCE_PROJECTS } from "@/lib/data/open-source";
import { ok } from "@/lib/supabase/api-response";

/**
 * GET /api/public/terminal/open-source
 *
 * Open source repositories for the Go terminal, from the same list the
 * home page and /projects render.
 */
export function GET() {
  const data = OPEN_SOURCE_PROJECTS.map((p) => ({
    slug: p.id,
    name: p.name,
    kind: p.kind,
    description: p.description,
    facts: p.facts,
    language: p.language,
    license: p.license,
    install: p.install ?? "",
    repo_url: p.repoUrl,
    site_url: p.siteUrl ?? "",
    site_label: p.siteLabel ?? "",
    fork_of: p.forkOf ? `${p.forkOf.name} (${p.forkOf.url})` : "",
  }));
  const response = NextResponse.json(ok(data));
  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  return response;
}
