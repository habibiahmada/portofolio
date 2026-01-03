import useSWR from "swr"
import { TechItem } from "@/lib/types/database"

const fetcher = async (url: string): Promise<TechItem[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch tech stacks")
  const json = await res.json()
  return json.data ?? []
}

export default function useTechstacks() {
  const { data, error, isLoading } = useSWR<TechItem[]>(
    "/api/public/techstacks",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  )

  return {
    techStacks: data ?? [],
    loading: isLoading,
    error,
  }
}