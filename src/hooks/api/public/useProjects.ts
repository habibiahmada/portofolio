import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Project } from "@/lib/types/database";

export default function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const lang = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchProjects() {
            try {
                const res = await fetch(`/api/public/projects?lang=${lang}`, { next: { revalidate: 0 } });
                const json = await res.json();

                if (isMounted) {
                    setProjects(json.data || []);
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
        fetchProjects();

        return () => {
            isMounted = false;
        };
    }, [lang]);

    return { projects, loading, error, lang };
}
