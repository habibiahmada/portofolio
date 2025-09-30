import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Services } from "@/lib/types/database";


export default function useServices() {
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`/api/services/all?lang=${lang}`);
        const json = await res.json();
        setServices((json?.data as Services[]) || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [lang]);

  return { services, loading, error, lang };
}
