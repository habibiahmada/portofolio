import { getProjectTaxonomy } from "./project-taxonomy";
import type { ProjectRow } from "@/lib/supabase/types";

/** Presentation helpers for project cards (data lives in Supabase `projects` table). */
export type ProjectMeta = {
  role: string;
  outcome?: string;
};

const WEBEKSPRES_ROLE = "Web Developer (Webekspres team)";

/** Role + outcome from a catalog row; falls back to taxonomy for Webekspres origin. */
export function getProjectMeta(project: Pick<ProjectRow, "id" | "role" | "outcome">): ProjectMeta | undefined {
  const tax = getProjectTaxonomy(project.id);
  const role = project.role?.trim() || (tax?.origin === "webekspres" ? WEBEKSPRES_ROLE : "");
  const outcome = project.outcome?.trim() || undefined;

  if (!role && !outcome) return undefined;
  return { role, outcome };
}

export { WEBEKSPRES_ROLE };
