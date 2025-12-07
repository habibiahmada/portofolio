import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 0);

  let query = supabase
    .from("articles")
    .select("*, article_translations(*)")
    .order("published_at", { ascending: false });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  return NextResponse.json({ data, error });
}
