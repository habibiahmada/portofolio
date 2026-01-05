import useSWR from "swr";
import { useLocale } from "next-intl";

export interface StatItem {
  key: string;
  count: number;
  icon: string;
  suffix: string;
  label: string;
  description: string;
  color: string;
  bgColorLight: string;
  bgColorDark: string;
}

interface UseStatsReturn {
  stats: StatItem[];
  loading: boolean;
  error: Error | null;
}

const fetcher = async (url: string): Promise<StatItem[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }
  const json = await res.json();
  return json.data ?? [];
};

export default function useStats(): UseStatsReturn {
  const locale = useLocale();

  const { data, error, isLoading } = useSWR<StatItem[]>(
    `/api/public/stats?lang=${locale}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    stats: data ?? [],
    loading: isLoading,
    error: error ?? null
  };
}
