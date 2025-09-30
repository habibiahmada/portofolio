import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function useProjects() {
  const [projects, setProjects] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`/api/projects?lang=${lang}`);
        const json = await res.json();
        setProjects(json.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [lang]);

  return { projects, loading, error, lang };
}
