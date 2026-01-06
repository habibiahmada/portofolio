import useSWR from "swr";
import { useLocale } from "next-intl";
import { Article } from "@/lib/types/database";

// -----------------------------
// Types
// -----------------------------
export interface PublicArticle extends Omit<Article, "article_translations"> {
  translation?: {
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    read_time: string;
  } | null;
}

interface UseArticlesReturn {
  articles: PublicArticle[];
  loading: boolean;
  error: Error | null;
  lang: string;
}

// -----------------------------
// Fetcher
// -----------------------------
const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
};

// -----------------------------
// Hook
// -----------------------------
export default function useArticles(limit?: number): UseArticlesReturn {
  const lang = useLocale();

  const query = `/api/public/articles?lang=${lang}${limit ? `&limit=${limit}` : ""
    }&published=true`;

  const { data, error, isLoading } = useSWR(
    query,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    articles: (data?.data as PublicArticle[]) ?? [],
    loading: isLoading,
    error: error ?? null,
    lang,
  };
}