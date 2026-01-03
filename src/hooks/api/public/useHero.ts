import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface HeroData {
    image_url: string;
    cv_url: string;
    greeting: string;
    description: string;
    typewriter_texts: string[];
    developer_tag: string;
    console_tag: string;
}

interface UseHeroReturn {
    heroData: HeroData | null;
    loading: boolean;
    error: Error | null;
}

export default function useHero(): UseHeroReturn {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const locale = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const res = await fetch(`/api/public/hero?lang=${locale}`);
                const result = await res.json();

                if (isMounted && result.data) {
                    setHeroData(result.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                    console.error("Failed to fetch hero data", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    return { heroData, loading, error };
}
