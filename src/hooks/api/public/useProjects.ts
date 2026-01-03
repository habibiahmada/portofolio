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

export default function useProjects() {
  const lang = useLocale()

  const { data, error, isLoading } = useSWR(
    `/api/public/projects?lang=${lang}`,
    fetcher
  )

  return {
    projects: data ?? [],
    loading: isLoading,
    error,
    lang
  }
}