import { supabase } from "@/lib/supabase/client";

export interface ArticleData {
    id: string;
    image_url?: string;
    image?: string;
    published: boolean;
    published_at?: string;
    created_at: string;
    updated_at?: string;
    translation?: {
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        tags: string[];
        read_time: string;
    } | null;
}

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

/**
 * Fetches all published articles for a specific locale.
 * This is designed for use in Server Components.
 */
export async function getAllArticles(locale: string, limit?: number): Promise<ArticleData[]> {
  let query = supabase
    .from("articles")
    .select("*, article_translations(*)")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  const normalized = ((data as unknown as ArticleWithTranslations[]) || []).map((a) => {
    const byLang = a.article_translations?.find((t) => t.language === locale);
    const fallback = a.article_translations?.find((t) => t.language === "en");

    const { article_translations, ...rest } = a;
    return {
      ...rest,
      translation: byLang || fallback || null,
    } as ArticleData;
  });

  return normalized;
}

/**
 * Fetches a single article by its slug.
 * This is designed for use in Server Components.
 */
export async function getArticleBySlug(slug: string, locale: string): Promise<ArticleData | null> {
  try {
    // Query articles with translations
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        article_translations (*)
      `)
      .eq('published', true);

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    if (!articles || articles.length === 0) {
      return null;
    }

    // Find article that has a translation with matching slug
    let foundArticle = null;
    let foundTranslation: ArticleTranslation | null = null;

    for (const article of articles) {
      const translations = article.article_translations as ArticleTranslation[];
      if (!translations) continue;

      const matchingTranslation = translations.find(t => t.slug === slug);
      if (matchingTranslation) {
        foundArticle = article;
        // Try to get translation in requested language, fallback to matched one
        foundTranslation = translations.find(t => t.language === locale) || matchingTranslation;
        break;
      }
    }

    if (!foundArticle || !foundTranslation) {
      return null;
    }

    return {
      ...foundArticle,
      translation: foundTranslation,
    } as ArticleData;
  } catch (error) {
    console.error(`Error fetching article by slug [${slug}]:`, error);
    return null;
  }
}

/**
 * Fetches all article slugs for static generation.
 * Returns slugs from all languages.
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('article_translations(slug)')
      .eq('published', true);

    if (error) {
      console.error('Error fetching article slugs:', error);
      return [];
    }

    const slugs = new Set<string>();
    
    for (const article of articles || []) {
      const translations = article.article_translations as { slug: string }[];
      if (translations) {
        translations.forEach(t => {
          if (t.slug) slugs.add(t.slug);
        });
      }
    }

    return Array.from(slugs);
  } catch (error) {
    console.error('Error fetching article slugs:', error);
    return [];
  }
}
