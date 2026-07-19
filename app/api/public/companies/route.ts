import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, serverError } from "@/lib/supabase/api-response";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(serverError(error.message), { status: 500 });
    }

    return NextResponse.json(ok(data || []));
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
