import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function useExperiences() {
  const [experiences, setExperiences] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchExperience() {
      try {
        const res = await fetch(`/api/experiences?lang=${lang}`);
        const json = await res.json();
        setExperiences(json.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, [lang]);

  return { experiences, loading, error, lang };
}
