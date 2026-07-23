import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, serverError } from "@/lib/supabase/api-response";
import { getClientIp } from "@/lib/security";

/**
 * POST /api/auth/logout
 *
 * Signs out the current user from Supabase Auth.
 * 
 * Security features:
 * - Session clearing
 * - Cache control headers
 * - Activity logging
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const supabase = await getSupabaseServerClient();
    
    // Get user info before logout for logging
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(`[AUTH] Logout error for user: ${user?.email || "unknown"} (IP: ${ip}) -`, error.message);
      return NextResponse.json(
        { success: false, data: null, error: { message: error.message } },
        { status: 400 },
      );
    }

    console.log(`[AUTH] User logged out: ${user?.email || "unknown"} (IP: ${ip})`);

    return NextResponse.json(ok({ message: "Signed out successfully" }), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error(`[AUTH] Logout server error from IP: ${ip} -`, err.message);
    return NextResponse.json(serverError("Logout failed"), { status: 500 });
  }
}
