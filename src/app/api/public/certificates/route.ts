import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    const { data, error } = await supabase
      .from("certifications")
      .select(`
        *,
        certification_translations!inner (
          *
        )
      `)
      .eq("certification_translations.language", lang);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET /certificates error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

