"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

function makeClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

let client: ReturnType<typeof makeClient> | null = null;

/** Singleton browser-side Supabase client */
export function getSupabaseClient() {
  if (!client) client = makeClient();
  return client;
}
