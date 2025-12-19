import { TechItem } from "@/lib/types/database";
import { useEffect, useState, useRef } from "react";

export default function useTechstacks() {
    const [techStacks, setTechStacks] = useState<TechItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        let isMounted = true;

        async function fetchTechStacks() {
            try {
                const res = await fetch(`/api/techstacks/all`, { next: { revalidate: 0 } });
                if (!res.ok) throw new Error("Failed to fetch tech stacks");

                const json = await res.json();
                if (isMounted) {
                    setTechStacks(json.data || []);
                    fetchedRef.current = true;
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

        fetchTechStacks();

        return () => {
            isMounted = false;
        };
    }, []);

    return { techStacks, loading, error };
}
