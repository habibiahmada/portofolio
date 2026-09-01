/** Build public Supabase Storage URLs for static references. */
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tjxcfcllkceoauuwurfe.supabase.co"}/storage/v1/object/public`;

export function certificateStorageUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\/data\/certificates\//, "").replace(/^\/+/, "");
  return `${STORAGE_BASE}/certificates/${clean}`;
}

/** Intel AI country award (Agrify) — used in press + agrify case study aside. */
export const INTEL_AWARD_CERT_URL = certificateStorageUrl(
  "intel/country-award-winner-agrify-indonesia-13-17-years-habibi-ahmad-aziz/country-award-winner-agrify-indonesia-13-17-years-habibi-ahmad-aziz.webp",
);
