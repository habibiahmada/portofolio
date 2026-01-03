import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { translateObject } from "@/lib/translator";


interface ArticleTranslation {
  language: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  read_time: string;
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
        ["title", "content", "excerpt", "tags", "read_time"]
      );
      // Generate slug for translated version
      const translatedSlug = source.slug + "-" + targetLang;
      finalTranslations.push({ ...translated, language: targetLang, slug: translatedSlug });
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
