import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { Experience } from "@/lib/types/database";

export default function useExperiences() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const lang = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchExperience() {
            try {
                const res = await fetch(`/api/experiences?lang=${lang}`, { next: { revalidate: 0 } });
                const json = await res.json();

                if (isMounted) {
                    setExperiences((json.data as Experience[]) || []);
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
        fetchExperience();

        return () => {
            isMounted = false;
        };
    }, [lang]);

    return { experiences, loading, error, lang };
}
