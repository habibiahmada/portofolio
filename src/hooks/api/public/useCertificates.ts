import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Certificate } from "@/lib/types/database";

export default function useCertificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const lang = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchCertificates() {
            try {
                const res = await fetch(`/api/public/certificates?lang=${lang}`, { next: { revalidate: 0 } });
                const json = await res.json();

                if (isMounted) {
                    setCertificates(json.data || []);
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
        fetchCertificates();

        return () => {
            isMounted = false;
        };
    }, [lang]);

    return { certificates, loading, error, lang };
}
