import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback
 *
 * Handles the OAuth redirect from Google/GitHub.
 * Validates the authenticated email against the ADMIN_ALLOWED_EMAILS env var.
 * If the email is not allowed, signs the user out and shows an error.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/admin";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user's email is in the allowed list
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email;

      if (!email) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/?error=No email found from provider`,
        );
      }

      // Check against allowed admin emails from environment variable
      const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (!allowedEmails.includes(email.toLowerCase())) {
        // Not allowed — sign out immediately
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/login?error=access_denied`,
        );
      }

      // Allowed — redirect to intended page or homepage
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error or no code
  return NextResponse.redirect(`${origin}/?error=Authentication failed`);
}
