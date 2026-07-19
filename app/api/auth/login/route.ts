import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fail, serverError } from "@/lib/supabase/api-response";

/**
 * POST /api/auth/login
 *
 * Body: { provider: "google" | "github" }
 *
 * Initiates OAuth flow. Returns the redirect URL.
 */
export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json();

    if (!provider || !["google", "github"].includes(provider)) {
      return NextResponse.json(
        fail("Provider must be 'google' or 'github'", "INVALID_PROVIDER"),
        { status: 400 },
      );
    }

    const supabase = await getSupabaseServerClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.habibiahmada.dev";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as "google" | "github",
      options: {
        redirectTo: `${siteUrl}/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        fail(error.message, "OAUTH_ERROR"),
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { url: data.url },
      error: null,
    });
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
