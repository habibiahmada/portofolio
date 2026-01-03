import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Article } from "@/lib/types/database";

// Define types matching the API response structure
export interface PublicArticle extends Omit<Article, 'article_translations'> {
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

export default function useArticles(limit?: number): UseArticlesReturn {
    const [articles, setArticles] = useState<PublicArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const lang = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchArticles() {
            try {
                const res = await fetch(
                    `/api/public/articles?lang=${lang}${limit ? `&limit=${limit}` : ""}&published=true`,
                    { next: { revalidate: 0 } }
                );
                const json = await res.json();

                if (isMounted) {
                    setArticles(json.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        fetchArticles();

        return () => {
            isMounted = false;
        };
    }, [lang, limit]);

    return { articles, loading, error, lang };
}
