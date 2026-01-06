import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const revalidate = 0;

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
  const featuredParam = searchParams.get("featured");

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

  if (featuredParam !== null) {
    query = query.eq("featured", featuredParam === "true");
  }

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

  return NextResponse.json({ data: normalized });
}