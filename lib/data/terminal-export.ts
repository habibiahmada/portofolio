import { getAllProjects } from "@/lib/data/projects";
import {
  getCaseStudySlugByProjectId,
  getCaseStudyExtras,
  getLinkedCaseStudies,
  type CaseStudy,
} from "@/lib/data/case-studies";
import { getProjectBrief, PROJECT_BRIEFS } from "@/lib/data/project-briefs";
import { getProjectTaxonomy } from "@/lib/data/project-taxonomy";
import { FEATURED_PROJECT_IDS } from "@/lib/data/featured-ids";
import { hasPublicProjectUrl } from "@/lib/projects";

const DEFAULT_HOOKS = {
  opening: "Where it started",
  reality: "What boxed the work in",
  build: "How it came together",
  close: "What I can stand behind",
  realityLead:
    "These were the boundaries that shaped what we could ship and how honest the story had to stay.",
  buildLead:
    "How the pieces fit together in practice, not just on a stack diagram.",
  closeLead:
    "What actually shipped, what proof exists, and what I can defend in an interview.",
} as const;

export type TerminalProject = {
  slug: string;
  name: string;
  year: string;
  description: string;
  description_id: string;
  tags: string[];
  live: string;
  featured: boolean;
};

export type TerminalCaseStudySection = {
  label: string;
  body: string;
};

export type TerminalCaseStudy = {
  slug: string;
  project_id: string;
  hero: string;
  sections: TerminalCaseStudySection[];
};

function joinSection(lead: string | undefined, body: string): string {
  const trimmed = body.trim();
  if (lead?.trim()) {
    if (!trimmed) return lead.trim();
    return `${lead.trim()}\n\n${trimmed}`;
  }
  return trimmed;
}

function bulletList(items: string[]): string {
  return items.map((item) => `• ${item}`).join("\n");
}

function architectureBody(blocks: CaseStudy["architecture"]): string {
  return blocks
    .map((block) => `${block.title}\n${block.body}`)
    .join("\n\n");
}

/** Drop sections whose body is empty so the terminal never renders a blank panel. */
function compact(
  sections: (TerminalCaseStudySection | null | undefined)[],
): TerminalCaseStudySection[] {
  return sections.filter(
    (s): s is TerminalCaseStudySection => Boolean(s && s.body.trim()),
  );
}

/**
 * Resolve the public detail slug for a project: the case-study slug when one
 * exists, otherwise the taxonomy slug, and finally the id as a last resort.
 * Must mirror the web route so `open <slug>` and detail lookups agree.
 */
function detailSlug(projectId: string): string {
  return (
    getCaseStudySlugByProjectId(projectId) ??
    getProjectTaxonomy(projectId)?.slug ??
    projectId
  );
}

export function toTerminalCaseStudy(study: CaseStudy): TerminalCaseStudy {
  const hooks = { ...DEFAULT_HOOKS, ...study.hooks };
  const extras = getCaseStudyExtras(study.slug);

  return {
    slug: study.slug,
    project_id: study.projectId,
    hero: extras?.overview || study.problem,
    sections: compact([
      extras?.overview ? { label: "Overview", body: extras.overview } : null,
      { label: "Problem & context", body: study.problem },
      {
        label: "Constraints",
        body: joinSection(hooks.realityLead, bulletList(study.constraints)),
      },
      {
        label: "Solution & architecture",
        body: joinSection(hooks.buildLead, architectureBody(study.architecture)),
      },
      extras?.features?.length
        ? { label: "Key features", body: bulletList(extras.features) }
        : null,
      {
        label: "Result",
        body: joinSection(hooks.closeLead, bulletList(study.outcomes)),
      },
    ]),
  };
}

/** Client/website project brief -> terminal case study, so details are complete. */
export function briefToTerminalCaseStudy(
  projectId: string,
): TerminalCaseStudy | null {
  const brief = getProjectBrief(projectId);
  if (!brief) return null;

  return {
    slug: detailSlug(projectId),
    project_id: projectId,
    hero: brief.overview,
    sections: compact([
      { label: "Overview", body: brief.overview },
      { label: "Problem & context", body: brief.context },
      { label: "Solution", body: brief.solution },
      brief.features?.length
        ? { label: "Key features", body: bulletList(brief.features) }
        : null,
      { label: "Technical implementation", body: brief.techNotes },
      { label: "Result", body: brief.result },
    ]),
  };
}

function sortForTerminal<
  T extends { id: string; year: number; title_en: string },
>(rows: T[], featuredRank: Map<string, number>): T[] {
  return [...rows].sort((a, b) => {
    const ar = featuredRank.get(a.id);
    const br = featuredRank.get(b.id);
    if (ar != null && br != null) return ar - br;
    if (ar != null) return -1;
    if (br != null) return 1;
    if (b.year !== a.year) return b.year - a.year;
    return a.title_en.localeCompare(b.title_en);
  });
}

/** Terminal-shaped project list (slug, featured, sanitized live URL). */
export async function buildTerminalProjects(): Promise<TerminalProject[]> {
  const featured = new Set<string>(FEATURED_PROJECT_IDS);
  const featuredRank = new Map(
    FEATURED_PROJECT_IDS.map((id, index) => [id, index]),
  );
  const rows = sortForTerminal(await getAllProjects(), featuredRank);

  return rows.map((row) => ({
    slug: detailSlug(row.id),
    name: row.title_en,
    year: String(row.year),
    description: row.description_en,
    description_id: row.description_id,
    tags: row.tags ?? [],
    live: hasPublicProjectUrl(row.live_url) ? row.live_url.trim() : "",
    featured: featured.has(row.id),
  }));
}

/**
 * Flattened detail narratives for the terminal detail view — every project,
 * not only the ones with a hand-written case study. Case studies keep their
 * narrative; client/website projects come from their structured brief.
 */
export function buildTerminalCaseStudies(): TerminalCaseStudy[] {
  const fromCaseStudies = getLinkedCaseStudies().map(toTerminalCaseStudy);
  const covered = new Set(fromCaseStudies.map((c) => c.project_id));

  const fromBriefs = PROJECT_BRIEFS.map((b) => b.projectId)
    .filter((id) => !covered.has(id))
    .map(briefToTerminalCaseStudy)
    .filter((c): c is TerminalCaseStudy => c !== null);

  return [...fromCaseStudies, ...fromBriefs];
}
