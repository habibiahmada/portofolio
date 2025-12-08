import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en"; 

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      projects_translations!inner (
        * 
      )
    `)
    .eq("projects_translations.language", lang);

  return NextResponse.json({ data, error });
}
