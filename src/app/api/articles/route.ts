import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { translateObject } from "@/lib/translator";

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

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { translations, ...articlePayload } = body;

    if (!Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json(
        { error: "At least one translation is required" },
        { status: 400 }
      );
    }

    // Clean undefined values
    const cleanedArticle = Object.fromEntries(
      Object.entries(articlePayload).filter(([, v]) => v !== undefined)
    );

    // Set published_at if published
    if (cleanedArticle.published && !cleanedArticle.published_at) {
      cleanedArticle.published_at = new Date().toISOString();
    }

    // 1️⃣ Insert article
    const { data: article, error: articleError } = await supabaseAdmin
      .from("articles")
      .insert([cleanedArticle])
      .select()
      .single();

    if (articleError || !article) {
      throw new Error(articleError?.message || "Failed to create article");
    }

    // 2️⃣ Insert translations (with auto-translation)
    const finalTranslations = [...translations];
    if (translations.length === 1) {
      const source = translations[0];
      const targetLang = source.language === "id" ? "en" : "id";
      const translated = await translateObject(
        source,
        targetLang,
        source.language,
        ["title", "content", "excerpt"]
      );
      // Generate slug for translated version
      const translatedSlug = source.slug + "-" + targetLang;
      finalTranslations.push({ ...translated, language: targetLang, slug: translatedSlug, tags: source.tags, read_time: source.read_time });
    }

    const preparedTranslations = finalTranslations.map((t: ArticleTranslation) => ({
      article_id: article.id,
      language: t.language,
      title: t.title ?? "",
      slug: t.slug ?? "",
      content: t.content ?? "",
      excerpt: t.excerpt ?? "",
      tags: t.tags ?? [],
      read_time: t.read_time ?? "1 min",
    }));

    const { error: transError } = await supabaseAdmin
      .from("article_translations")
      .insert(preparedTranslations);

    if (transError) {
      // Rollback
      await supabaseAdmin.from("articles").delete().eq("id", article.id);
      throw new Error(transError.message);
    }

    return NextResponse.json({ data: article }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg ?? "Internal error" }, { status: 500 });
  }
}
