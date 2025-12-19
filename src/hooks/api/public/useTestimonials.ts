import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Testimonial } from "@/lib/types/database";

export default function useTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const lang = useLocale();

    useEffect(() => {
        let isMounted = true;

        async function fetchTestimonials() {
            try {
                const res = await fetch(`/api/testimonials?lang=${lang}`, { next: { revalidate: 0 } });
                const json = await res.json();

                if (isMounted) {
                    setTestimonials(json.data || []);
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
        fetchTestimonials();

        return () => {
            isMounted = false;
        };
    }, [lang]);

    return { testimonials, loading, error, lang };
}
