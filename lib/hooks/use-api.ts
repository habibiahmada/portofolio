"use client";

import { useEffect, useState, useCallback } from "react";
import type { Project, Certificate, Company } from "@/lib/supabase/types";
import type { ApiResponse } from "@/lib/supabase/api-response";

// ── Generic fetch wrapper ────────────────────────────────────────────────────

async function fetchApi<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  return json;
}

// ── Hook factory ─────────────────────────────────────────────────────────────

type UseApiResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

function useApi<T>(url: string | null): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const refetch = useCallback(() => setRefetchKey((k) => k + 1), []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchApi<T>(url)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error?.message || "Unknown error");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, refetchKey]);

  return { data, loading, error, refetch };
}

// ── Specialized hooks ────────────────────────────────────────────────────────

/** All projects with featured pinning */
export function useProjects(opts?: { featured?: string[]; enabled?: boolean }) {
  const params = new URLSearchParams({ page_size: "50" });
  if (opts?.featured?.length) {
    params.set("featured", opts.featured.join(","));
  }
  const url = opts?.enabled === false ? null : `/api/public/projects?${params}`;
  return useApi<Project[]>(url);
}

/** All certificates */
export function useCertificates() {
  return useApi<Certificate[]>("/api/public/certificates?page_size=60");
}

/** Pinned certificates */
export function usePinnedCertificates(enabled = true) {
  return useApi<Certificate[]>(enabled ? "/api/public/certificates?pinned=true" : null);
}

/** Non-pinned certificates with pagination */
export function useNonPinnedCertificates(page = 1, pageSize = 8, enabled?: boolean) {
  const shouldFetch = enabled !== false;
  const url = shouldFetch
    ? `/api/public/certificates?pinned=false&page=${page}&page_size=${pageSize}`
    : null;
  return useApi<Certificate[]>(url);
}

/** All companies */
export function useCompanies(enabled = true) {
  return useApi<Company[]>(enabled ? "/api/public/companies" : null);
}

/** Current auth user */
export function useAuthUser() {
  return useApi<{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    provider: string | null;
  } | null>("/api/auth/me");
}
