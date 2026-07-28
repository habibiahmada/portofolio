/**
 * Industry-standard API response envelope.
 * Every API route returns { success, data, error, meta }.
 */

export type ApiMeta = {
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
  [key: string]: unknown;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: ApiMeta;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function ok<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
  return { success: true, data, error: null, meta };
}

export function okPaginated<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    error: null,
    meta: {
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize),
    },
  };
}

/** Returns the error body. The route handler must set the HTTP status separately. */
export function fail(
  message: string,
  code?: string,
  details?: unknown,
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: { message, code, details },
  };
}

export function unauthorized(msg = "Unauthorized"): ApiResponse<null> {
  return fail(msg, "UNAUTHORIZED");
}

export function notFound(msg = "Not found"): ApiResponse<null> {
  return fail(msg, "NOT_FOUND");
}

export function serverError(msg = "Internal server error"): ApiResponse<null> {
  return fail(msg, "INTERNAL_ERROR");
}
