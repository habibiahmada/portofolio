import useSWR from "swr";
import { useLocale } from "next-intl";

interface HeroData {
  image_url: string;
  cv_url: string;
  greeting: string;
  description: string;
  typewriter_texts: string[];
  developer_tag: string;
  console_tag: string;
}

interface UseHeroReturn {
  heroData: HeroData | null;
  loading: boolean;
  error: Error | null;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch hero data");
  }
  const json = await res.json();
  return json.data;
};

export default function useHero(): UseHeroReturn {
  const locale = useLocale();

  const { data, error, isLoading } = useSWR<HeroData>(
    `/api/public/hero?lang=${locale}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    heroData: data ?? null,
    loading: isLoading,
    error: error ?? null
  };
}