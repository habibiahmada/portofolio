// hooks/usePdf.ts
import useSWR from "swr";
import { fetchPdf } from "@/lib/fetcherpdf";

export function usePdf(url?: string) {
  return useSWR<ArrayBuffer>(
    url ? ["pdf", url] : null,
    () => fetchPdf(url!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10, // 10 menit
    }
  );
}
