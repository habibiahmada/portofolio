import { useEffect, useState, useRef } from "react";

export default function useTechstacks() {
  const [techStacks, setTechStacks] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    async function fetchTechStacks() {
      try {
        const res = await fetch(`/api/techstacks/all`);
        if (!res.ok) throw new Error("Failed to fetch tech stacks");

        const json = await res.json();
        setTechStacks(json.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        fetchedRef.current = true;
      }
    }

    fetchTechStacks();
  }, []);

  return { techStacks, loading, error };
}
