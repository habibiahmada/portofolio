import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { FAQ } from "@/lib/types/database";

interface UseAdminFaqsReturn {
    faqs: FAQ[];
    loading: boolean;
    refreshFaqs: () => Promise<void>;
}

export default function useAdminFaqs(): UseAdminFaqsReturn {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();

    const fetchFaqs = useCallback(async () => {
        try {
            const res = await fetch(`/api/faqs?lang=${locale}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error("Failed to fetch FAQs");

            const data = await res.json();
            setFaqs(data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    return { faqs, loading, refreshFaqs: fetchFaqs };
}
