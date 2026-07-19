import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, serverError } from "@/lib/supabase/api-response";

/**
 * POST /api/auth/logout
 *
 * Signs out the current user from Supabase Auth.
 */
export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { success: false, data: null, error: { message: error.message } },
        { status: 400 },
      );
    }

    return NextResponse.json(ok({ message: "Signed out successfully" }));
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
