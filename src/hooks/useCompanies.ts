import { useEffect, useState, useRef } from "react";
import { Company } from "@/lib/types/database";

export default function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    async function fetchCompanies() {
      try {
        const res = await fetch(`/api/companies/all`, { next: { revalidate: 0 } });
        if (!res.ok) throw new Error("Failed to fetch companies");

        const json = await res.json();
        setCompanies((json?.data as Company[]) || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return { companies, loading, error };
}