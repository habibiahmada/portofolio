import { useEffect, useState, useRef } from "react";
import { Company } from "@/lib/types/database";

export default function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        let isMounted = true;

        async function fetchCompanies() {
            try {
                const res = await fetch(`/api/public/companies`, { next: { revalidate: 0 } });
                if (!res.ok) throw new Error("Failed to fetch companies");

                const json = await res.json();

                if (isMounted) {
                    setCompanies((json?.data as Company[]) || []);
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

        fetchCompanies();

        return () => {
            isMounted = false;
        };
    }, []);

    return { companies, loading, error };
}
