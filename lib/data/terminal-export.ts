import { getAllProjects } from "@/lib/data/projects";
import {
  getCaseStudySlugByProjectId,
  getLinkedCaseStudies,
  type CaseStudy,
} from "@/lib/data/case-studies";
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

export function toTerminalCaseStudy(study: CaseStudy): TerminalCaseStudy {
  const hooks = { ...DEFAULT_HOOKS, ...study.hooks };

  return {
    slug: study.slug,
    project_id: study.projectId,
    hero: study.problem,
    sections: [
      { label: hooks.opening, body: study.problem },
      {
        label: hooks.reality,
        body: joinSection(hooks.realityLead, bulletList(study.constraints)),
      },
      {
        label: hooks.build,
        body: joinSection(hooks.buildLead, architectureBody(study.architecture)),
      },
      {
        label: hooks.close,
        body: joinSection(hooks.closeLead, bulletList(study.outcomes)),
      },
    ],
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
    slug: getCaseStudySlugByProjectId(row.id) ?? row.id,
    name: row.title_en,
    year: String(row.year),
    description: row.description_en,
    description_id: row.description_id,
    tags: row.tags ?? [],
    live: hasPublicProjectUrl(row.live_url) ? row.live_url.trim() : "",
    featured: featured.has(row.id),
  }));
}

/** Flattened case study narratives for the terminal detail view. */
export function buildTerminalCaseStudies(): TerminalCaseStudy[] {
  return getLinkedCaseStudies().map(toTerminalCaseStudy);
}
