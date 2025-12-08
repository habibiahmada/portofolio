import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Article } from "@/lib/types/database";

export default function useArticles(limit?: number) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          `/api/articles/all?lang=${lang}${limit ? `&limit=${limit}` : ""}`,
          { next: { revalidate: 0 } }
        );
        const json = await res.json();
        setArticles(json.data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [lang, limit]);

  return { articles, loading, error, lang };
}