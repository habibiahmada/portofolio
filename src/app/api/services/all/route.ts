import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en"; 

  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      service_translations!inner (
        * 
      )
    `)
    .eq("service_translations.language", lang);

  return NextResponse.json({ data, error });
}