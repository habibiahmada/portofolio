import { unstable_cache } from "next/cache";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { CompanyRow } from "@/lib/supabase/types";
import { DATA_REVALIDATE_SECONDS, DATA_TAGS } from "./constants";

async function queryAllCompanies(): Promise<CompanyRow[]> {
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export const getCompanies = unstable_cache(
  queryAllCompanies,
  ["companies-all"],
  { revalidate: DATA_REVALIDATE_SECONDS, tags: [DATA_TAGS.companies] },
);
