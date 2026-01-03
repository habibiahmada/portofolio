import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export interface StatItem {
    key: string;
    count: number;
    icon: string;
    suffix: string;
    label: string;
    description: string;
    color: string;
    bgColorLight: string;
    bgColorDark: string;
}

interface UseStatsReturn {
    stats: StatItem[];
    loading: boolean;
    error: Error | null;
}

export default function useStats(): UseStatsReturn {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const locale = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchStats() {
            try {
                const res = await fetch(`/api/public/stats?lang=${locale}`);
                const result = await res.json();
                if (isMounted && result.data) {
                    setStats(result.data);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch stats", err);
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    return { stats, loading, error };
}
