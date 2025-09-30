import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en"; 

  const { data, error } = await supabase
    .from("experiences")
    .select(`
      *,
      experience_translations!inner (
        * 
      )
    `)
    .eq("experience_translations.language", lang);

  return NextResponse.json({ data, error });
}
