import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { translateObject } from "@/lib/translator";
import { APIError, handleAPIError } from "@/lib/api-error-handler";
import { checkRateLimit } from "@/lib/ratelimit";

interface ArticleTranslation {
  language: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  read_time: string;
}

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimit = checkRateLimit(req, 10, 60000); // 10 requests per minute
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );
  }

  if (!supabaseAdmin) {
    return handleAPIError(new APIError(500, "Server misconfiguration", "SERVER_ERROR"));
  }

  try {
    const body = await req.json();
    const { translations, ...articlePayload } = body;

    if (!Array.isArray(translations) || translations.length === 0) {
      throw new APIError(400, "At least one translation is required", "MISSING_TRANSLATIONS");
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
      .select('id, image_url, published, published_at, created_at, updated_at')
      .single();

    if (articleError || !article) {
      throw new APIError(500, articleError?.message || "Failed to create article", "DB_ERROR");
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
      throw new APIError(500, transError.message, "TRANSLATION_ERROR");
    }

    return NextResponse.json(
      { data: article },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (err: unknown) {
    return handleAPIError(err);
  }
}
