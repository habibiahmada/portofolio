import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export interface FAQ {
    id: string;
    order_index: number;
    faq_translations: {
        question: string;
        answer: string;
        lang: string;
    }[];
}

interface UseFaqsReturn {
    faqs: FAQ[];
    loading: boolean;
    error: Error | null;
}

export default function useFaqs(): UseFaqsReturn {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const locale = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchFaqs() {
            try {
                const res = await fetch(`/api/faqs?lang=${locale}`, {
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed to fetch FAQs");

                const data = await res.json();
                if (isMounted) {
                    setFaqs(data);
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchFaqs();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    return { faqs, loading, error };
}
