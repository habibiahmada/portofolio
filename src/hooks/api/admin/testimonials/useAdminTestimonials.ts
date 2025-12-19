import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Testimonial } from "@/lib/types/database";

interface UseAdminTestimonialsReturn {
    testimonials: Testimonial[];
    loading: boolean;
    refreshTestimonials: () => Promise<void>;
}

export default function useAdminTestimonials(): UseAdminTestimonialsReturn {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();

    const fetchTestimonials = useCallback(async () => {
        try {
            // API seems to accept lang param, or defaults to something. Component used 'en'.
            // We should use current locale if supported by API.
            const res = await fetch(`/api/testimonials?lang=${locale}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error("Failed to fetch testimonials");

            const json = await res.json();
            setTestimonials(json.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    return { testimonials, loading, refreshTestimonials: fetchTestimonials };
}
