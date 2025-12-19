import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Certificate } from "@/lib/types/database";

interface UseAdminCertificatesReturn {
    certificates: Certificate[];
    loading: boolean;
    refreshCertificates: () => Promise<void>;
}

export default function useAdminCertificates(): UseAdminCertificatesReturn {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();

    const fetchCertificates = useCallback(async () => {
        try {
            const res = await fetch(`/api/certificates?lang=${locale}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error("Failed to fetch certificates");

            const json = await res.json();
            setCertificates(json.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load certificates");
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    return { certificates, loading, refreshCertificates: fetchCertificates };
}
