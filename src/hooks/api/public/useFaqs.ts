import useSWR from "swr";
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

// ================= FETCHER =================
const fetcher = async (url: string): Promise<FAQ[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch FAQs");
  }
  return res.json();
};

// ================= HOOK =================
export default function useFaqs(): UseFaqsReturn {
  const locale = useLocale();

  const { data, error, isLoading } = useSWR<FAQ[]>(
    `/api/public/faqs?lang=${locale}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    faqs: data ?? [],
    loading: isLoading,
    error: error ?? null,
  };
}
