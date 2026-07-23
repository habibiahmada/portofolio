import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp } from "@/lib/security";

/**
 * GET /api/auth/callback
 *
 * Handles the OAuth redirect from Google/GitHub.
 * Validates the authenticated email against the ADMIN_ALLOWED_EMAILS env var.
 * If the email is not allowed, signs the user out and shows an error.
 *
 * Security features:
 * - Email authorization check
 * - Failed attempt logging
 * - Generic error messages
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = searchParams.get("next") || "/admin";

  // Log OAuth errors
  if (error) {
    console.warn(`[AUTH] OAuth error from IP: ${ip} - ${error}`);
    return NextResponse.redirect(
      `${origin}/login?error=oauth_failed&error_description=${encodeURIComponent(error)}`,
    );
  }

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Check if user's email is in the allowed list
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email;
      const provider = user?.app_metadata?.provider || "unknown";

      if (!email) {
        await supabase.auth.signOut();
        console.warn(`[AUTH] No email from ${provider} provider (IP: ${ip})`);
        return NextResponse.redirect(
          `${origin}/login?error=invalid_provider`,
        );
      }

      // Check against allowed admin emails from environment variable
      const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const lowerEmail = email.toLowerCase();

      if (!allowedEmails.includes(lowerEmail)) {
        // Not allowed — sign out immediately
        await supabase.auth.signOut();
        console.warn(
          `[AUTH] Unauthorized ${provider} login attempt - Email: ${email} (IP: ${ip})`,
        );
        return NextResponse.redirect(
          `${origin}/login?error=access_denied`,
        );
      }

      // Allowed — log successful login
      console.log(`[AUTH] Successful ${provider} OAuth login - Email: ${email} (IP: ${ip})`);

      // Redirect to intended page or admin
      return NextResponse.redirect(`${origin}${next}`, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }
  }

  // Error or no code
  console.warn(`[AUTH] Invalid OAuth callback (IP: ${ip}) - No code or exchange error`);
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
