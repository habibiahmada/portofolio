import useSWR from "swr"
import { useLocale } from "next-intl"
import { Certificate } from "@/lib/types/database"

const fetcher = async (url: string): Promise<Certificate[]> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch certificates")
  }

  const json = await res.json()
  return json.data ?? []
}

export default function useCertificates() {
  const lang = useLocale()

  const { data, error, isLoading } = useSWR<Certificate[]>(
    `/api/public/certificates?lang=${lang}`,
    fetcher
  )

  return {
    certificates: data ?? [],
    loading: isLoading,
    error,
    lang,
  }
}
