import { unstable_cache } from "next/cache";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { CertificateRow } from "@/lib/supabase/types";
import { DATA_REVALIDATE_SECONDS, DATA_TAGS } from "./constants";

export type PaginatedCertificates = {
  items: CertificateRow[];
  total: number;
  page: number;
  pageSize: number;
};

async function queryAllCertificates(): Promise<CertificateRow[]> {
  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

const getAllCertificates = unstable_cache(
  queryAllCertificates,
  ["certificates-all"],
  { revalidate: DATA_REVALIDATE_SECONDS, tags: [DATA_TAGS.certificates] },
);

function sortCerts(a: CertificateRow, b: CertificateRow) {
  if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
  return a.title.localeCompare(b.title);
}

/** Pinned certificates (about first paint). */
export async function getPinnedCertificates(): Promise<CertificateRow[]> {
  const all = await getAllCertificates();
  return all.filter((c) => c.is_pinned).sort(sortCerts);
}

/**
 * Non-pinned certificates page (about load-more).
 * page_size default 4 matches Certificates UI ITEMS_PER_ROW.
 */
export async function getNonPinnedCertificates(
  page = 1,
  pageSize = 4,
): Promise<PaginatedCertificates> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const all = (await getAllCertificates())
    .filter((c) => !c.is_pinned)
    .sort(sortCerts);
  const total = all.length;
  const start = (safePage - 1) * safeSize;
  return {
    items: all.slice(start, start + safeSize),
    total,
    page: safePage,
    pageSize: safeSize,
  };
}

/** Full list with optional pinned filter + pagination (API parity). */
export async function getCertificates(opts?: {
  page?: number;
  pageSize?: number;
  pinned?: boolean;
}): Promise<PaginatedCertificates> {
  const page = Math.max(1, opts?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts?.pageSize ?? 50));
  let filtered = await getAllCertificates();

  if (opts?.pinned === true) {
    filtered = filtered.filter((c) => c.is_pinned);
  } else if (opts?.pinned === false) {
    filtered = filtered.filter((c) => !c.is_pinned);
  }

  filtered = [...filtered].sort(sortCerts);
  const total = filtered.length;
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}
