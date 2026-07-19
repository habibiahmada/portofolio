import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, notFound, serverError } from "@/lib/supabase/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(notFound("Project not found"), { status: 404 });
    }

    return NextResponse.json(ok(data));
  } catch (err: any) {
    return NextResponse.json(serverError(err.message), { status: 500 });
  }
}
