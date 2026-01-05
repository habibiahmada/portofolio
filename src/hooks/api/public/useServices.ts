import useSWR from "swr";
import { useLocale } from "next-intl";
import { Service } from "@/lib/types/database";

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: Error | null;
  lang: string;
}

const fetcher = async (url: string): Promise<Service[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }
  const json = await res.json();
  return (json?.data as Service[]) ?? [];
};

export default function useServices(): UseServicesReturn {
  const lang = useLocale();

  const { data, error, isLoading } = useSWR<Service[]>(
    `/api/public/services?lang=${lang}`,
    fetcher
  );

  return {
    services: data ?? [],
    loading: isLoading,
    error: error ?? null,
    lang
  };
}
