import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

interface ProjectTranslation {
  language: string;
  title: string;
  description: string;
}

interface ProjectWithTranslations {
  projects_translations: ProjectTranslation[];
  [k: string]: unknown;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lang = searchParams.get("lang") || "en";

  const query = supabase
    .from("projects")
    .select(`
      id,
      image_url,
      year,
      live_url,
      github_url,
      technologies,
      created_at,
      projects_translations (
        id,
        language,
        title,
        description
      )
    `)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const normalized = ((data as ProjectWithTranslations[]) || []).map((p) => {
    const byLang = p.projects_translations?.find(
      (t) => t.language === lang
    );

    const fallback = p.projects_translations?.find(
      (t) => t.language === "en"
    );

    return {
      ...p,
      translation: byLang || fallback || null,
    };
  });

  return NextResponse.json(
    { data: normalized },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}