import useSWR from "swr";
import { useLocale } from "next-intl";
import { Testimonial } from "@/lib/types/database";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }
  return res.json();
};

export default function useTestimonials() {
  const lang = useLocale();

  const { data, error, isLoading } = useSWR(
    `/api/public/testimonials?lang=${lang}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    testimonials: (data?.data as Testimonial[]) ?? [],
    loading: isLoading,
    error,
    lang,
  };
}
