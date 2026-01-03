import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { Article } from "@/lib/types/database";
import { toast } from "sonner";

interface UseAdminArticlesReturn {
    articles: Article[];
    loading: boolean;
    refreshArticles: () => Promise<void>;
}

export default function useAdminArticles(): UseAdminArticlesReturn {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();

    const fetchArticles = useCallback(async () => {
        try {
            const res = await fetch(`/api/public/articles?lang=${locale}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error("Failed to fetch articles");

            const json = await res.json();
            setArticles(json.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    return { articles, loading, refreshArticles: fetchArticles };
}
