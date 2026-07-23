import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/debug
 *
 * Debug endpoint to check:
 * - Current authenticated user email
 * - Allowed emails from env
 * - Whether current user is authorized
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = (user?.email ?? "").toLowerCase();
    const isAuthorized = allowedEmails.includes(userEmail);

    return NextResponse.json({
      authenticated: !!user,
      userEmail,
      userEmailRaw: user?.email,
      userMetadata: user?.user_metadata,
      appMetadata: user?.app_metadata,
      allowedEmails,
      allowedEmailsRaw: process.env.ADMIN_ALLOWED_EMAILS,
      isAuthorized,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 },
    );
  }
}
