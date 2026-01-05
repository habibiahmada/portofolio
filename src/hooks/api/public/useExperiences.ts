import useSWR from "swr"
import { useLocale } from "next-intl"
import type { Experience } from "@/lib/types/database"

const fetcher = async (url: string): Promise<Experience[]> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch experiences")
  }

  const json = await res.json()
  return json.data ?? []
}

export default function useExperiences() {
  const lang = useLocale()

  const { data, error, isLoading } = useSWR<Experience[]>(
    `/api/public/experiences?lang=${lang}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  )

  return {
    experiences: data ?? [],
    loading: isLoading,
    error,
    lang,
  }
}
