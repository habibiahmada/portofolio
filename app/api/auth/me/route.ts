import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, unauthorized, serverError } from "@/lib/supabase/api-response";

/**
 * GET /api/auth/me
 *
 * Returns the current authenticated user's info.
 * If not authenticated, returns 401.
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(unauthorized("Not authenticated"), { status: 401 });
    }

    return NextResponse.json(
      ok({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split("@")[0],
        avatar: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || null,
      }),
    );
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
