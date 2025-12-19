import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Service } from "@/lib/types/database";

export default function useServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const lang = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchServices() {
            try {
                const res = await fetch(`/api/services?lang=${lang}`, { next: { revalidate: 0 } });
                const json = await res.json();

                if (isMounted) {
                    setServices((json?.data as Service[]) || []);
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
        fetchServices();

        return () => {
            isMounted = false;
        };
    }, [lang]);

    return { services, loading, error, lang };
}
