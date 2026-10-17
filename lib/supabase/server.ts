import type { Database } from "./types";
import { createMockSupabaseClient } from "./test-mock";

/** Shared mock instance so in-memory state persists across requests in test mode */
let mockClient: ReturnType<typeof createMockSupabaseClient> | null = null;

function getMockClient() {
  if (!mockClient) mockClient = createMockSupabaseClient();
  return mockClient;
}

/** Anon client without cookies — safe for unstable_cache / ISR (no request-specific session). */
export function getSupabaseAnonClient() {
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

/** Service-role client for server-only writes (agent blog API, view counts). Never import from client code. */
export function getSupabaseAdmin() {
  // In test/CI mode, return the mock so requests don't hang on dummy URLs.
  // Use SUPABASE_MOCK_ENABLED because Next.js overrides NODE_ENV to "development" in dev mode.
  if (process.env.SUPABASE_MOCK_ENABLED === "true") {
    return getMockClient() as any;
  }

  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
