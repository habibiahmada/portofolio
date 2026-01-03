import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";


export const revalidate = 0;

interface ArticleTranslation {
  language: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  read_time: string;
}

interface ArticleWithTranslations {
  article_translations: ArticleTranslation[];
  [k: string]: unknown;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";
  const limit = Number(searchParams.get("limit") || 0);
  const published = searchParams.get("published");

  let query = supabase
    .from("articles")
    .select("*, article_translations(*)")
    .order("published_at", { ascending: false });

  if (published === "true") {
    query = query.eq("published", true);
  }

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized = (data as unknown as ArticleWithTranslations[] || []).map((a) => {
    const byLang = a.article_translations?.find((t) => t.language === lang);
    const fallback = a.article_translations?.find((t) => t.language === "en");

    return {
      ...a,
      translation: byLang || fallback || null,
    };
  });

  return NextResponse.json({ data: normalized });
}
