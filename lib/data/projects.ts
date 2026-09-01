import { unstable_cache } from "next/cache";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";
import { DATA_REVALIDATE_SECONDS, DATA_TAGS } from "./constants";
export { FEATURED_PROJECT_IDS } from "./featured-ids";

export type PaginatedProjects = {
  items: ProjectRow[];
  total: number;
  page: number;
  pageSize: number;
};

function sortProjects(rows: ProjectRow[]): ProjectRow[] {
  return [...rows].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.title_en.localeCompare(b.title_en);
  });
}

async function queryAllProjects(): Promise<ProjectRow[]> {
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("year", { ascending: false })
    .order("title_en", { ascending: true });

  if (error) throw new Error(error.message);
  return sortProjects(data ?? []);
}

/** Cached public projects list (anon client — safe for unstable_cache). */
export const getAllProjects = unstable_cache(
  queryAllProjects,
  ["projects-all"],
  { revalidate: DATA_REVALIDATE_SECONDS, tags: [DATA_TAGS.projects] },
);

function pinByIds(items: ProjectRow[], featuredIds: string[]): ProjectRow[] {
  const byId = new Map(items.map((p) => [p.id, p]));
  const pinned: ProjectRow[] = [];
  for (const id of featuredIds) {
    const item = byId.get(id);
    if (item) pinned.push(item);
  }
  return pinned;
}

/** All projects, year desc. Optional year filter + pagination. */
export async function getProjects(opts?: {
  page?: number;
  pageSize?: number;
  year?: number;
  /** When set, return only these IDs in pin order (home featured). */
  featuredIds?: string[];
}): Promise<PaginatedProjects> {
  const page = Math.max(1, opts?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts?.pageSize ?? 50));
  const all = await getAllProjects();

  if (opts?.featuredIds?.length) {
    const pinned = pinByIds(all, opts.featuredIds);
    return {
      items: pinned,
      total: pinned.length,
      page: 1,
      pageSize: pinned.length || pageSize,
    };
  }

  let filtered = all;
  if (opts?.year != null) {
    filtered = all.filter((p) => p.year === opts.year);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total, page, pageSize };
}

/** Featured projects in pin-ID order (home). */
export async function getFeaturedProjects(
  featuredIds: string[],
): Promise<ProjectRow[]> {
  const { items } = await getProjects({ featuredIds });
  return items;
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const all = await getAllProjects();
  return all.find((p) => p.id === id) ?? null;
}
