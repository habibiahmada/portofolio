import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Testimonial } from "@/lib/types/database";

export default function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const lang = useLocale();

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(`/api/testimonials?lang=${lang}`, { next: { revalidate: 0 } });
        const json = await res.json();
        setTestimonials(json.data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, [lang]);

  return { testimonials, loading, error, lang };
}
