import useSWR from "swr"
import { useLocale } from "next-intl"
import { Project } from "@/lib/types/database"

const fetcher = async (url: string): Promise<Project[]> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch projects")
  }

  const json = await res.json()
  return json.data ?? []
}

export default function useProjects(
  featured?: boolean
) {
  const lang = useLocale()

  const query = new URLSearchParams({
    lang,
    ...(featured !== undefined && { featured: String(featured) }),
  }).toString()

  const { data, error, isLoading } = useSWR(
    `/api/public/projects?${query}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    projects: data ?? [],
    loading: isLoading,
    error,
    lang,
  }
}