/**
 * Admin authentication helpers.
 * Every admin API route must verify the caller is authenticated
 * AND their email is in the ADMIN_ALLOWED_EMAILS env var.
 */

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "./server";

import { headers } from "next/headers";

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
};

/**
 * Verifies the request is from an authenticated admin user.
 * Call this at the top of every admin API route.
 *
 * Pass the incoming Request so test bypass headers work outside
 * the Next.js AsyncLocalStorage request scope (unit tests).
 */
export async function requireAdmin(request?: Request): Promise<AdminSession> {
  // Allow test bypass in testing environment
  // Use TEST_BYPASS_KEY presence because Next.js overrides NODE_ENV to "development" in dev mode.
  if (process.env.TEST_BYPASS_KEY || process.env.SUPABASE_MOCK_ENABLED === "true") {
    // Prefer the Request headers (unit tests + explicit callers). Fall back to
    // next/headers only when no Request was passed (live App Router path).
    let bypassKey: string | null = null;
    if (request) {
      bypassKey = request.headers.get("x-test-bypass");
    } else {
      try {
        bypassKey = (await headers()).get("x-test-bypass");
      } catch {
        bypassKey = null;
      }
    }
    if (bypassKey && bypassKey === process.env.TEST_BYPASS_KEY) {
      return {
        userId: "test-admin-id",
        email: "admin@test.com",
        name: "Test Admin",
      };
    }
  }

  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  // Check against allowed admin emails from environment variable
  const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedEmails.includes(user.email.toLowerCase())) {
    // Sign out immediately — not an authorized admin
    await supabase.auth.signOut().catch(() => {});
    throw new AdminAuthError("Access denied", 403);
  }

  return {
    userId: user.id,
    email: user.email,
    name: (user.user_metadata?.full_name as string) || user.email.split("@")[0],
  };
}


/**
 * Wraps an admin API handler with try/catch + auth check.
 * Returns consistent JSON error responses.
 */
export async function withAdmin(
  request: Request,
  handler: (session: AdminSession) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    const session = await requireAdmin(request);
    return await handler(session);
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: err.message, code: err.code },
        },
        { status: err.status },
      );
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message, code: "INTERNAL_ERROR" },
      },
      { status: 500 },
    );
  }
}

class AdminAuthError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.code = status === 401 ? "UNAUTHORIZED" : "FORBIDDEN";
    this.name = "AdminAuthError";
  }
}
