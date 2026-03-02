import { supabase } from "@/lib/supabase/client";

export interface ProjectData {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  image_url?: string;
  year: number;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  translation?: {
    title: string;
    description: string;
  };
}

interface ProjectTranslation {
  language: string;
  title: string;
  description: string;
}

interface ProjectWithTranslations {
  projects_translations: ProjectTranslation[];
  [k: string]: unknown;
}

/**
 * Fetches all projects for a specific locale.
 * This is designed for use in Server Components.
 */
export async function getAllProjects(locale: string, featured?: boolean): Promise<ProjectData[]> {
  let query = supabase
    .from("projects")
    .select(`
      *,
      projects_translations (
        id,
        language,
        title,
        description
      )
    `)
    .order("created_at", { ascending: false });

  if (featured !== undefined) {
    query = query.eq("featured", featured);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  const normalized = ((data as unknown as ProjectWithTranslations[]) || []).map((p) => {
    const byLang = p.projects_translations?.find((t) => t.language === locale);
    const fallback = p.projects_translations?.find((t) => t.language === "en");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projects_translations, ...rest } = p;
    return {
      ...rest,
      translation: byLang || fallback,
    } as ProjectData;
  });

  return normalized;
}
