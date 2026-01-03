import useSWR from "swr";
import { Company } from "@/lib/types/database";

const fetcher = async (url: string): Promise<Company[]> => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch companies");
    }
    const json = await res.json();
    return json.data ?? [];
};

export default function useCompanies() {
    const { data, error, isLoading } = useSWR<Company[]>(
        `/api/public/companies`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000, 
        }
    );

    return {
        companies: data ?? [],
        loading: isLoading,
        error: error ?? null
    };
}
