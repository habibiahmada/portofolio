import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { Experience } from "@/lib/types/database";

export default function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchExperience() {
      try {
        const res = await fetch(`/api/experiences?lang=${lang}`, { next: { revalidate: 0 } });
        const json = await res.json();
        setExperiences((json.data as Experience[]) || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, [lang]);

  return { experiences, loading, error, lang };
}
