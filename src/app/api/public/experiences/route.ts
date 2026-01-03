import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

/* ================= GET ================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lang = searchParams.get("lang") ?? "en"

    const { data, error } = await supabase
      .from("experiences")
      .select(`
        id,
        type,
        company,
        location,
        start_date,
        end_date,
        skills,
        experience_translations!inner (
          title,
          description,
          language,
          location_type,
          highlight
        )
      `)
      .eq("experience_translations.language", lang)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("GET experiences error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err: unknown) {
    console.error("GET experiences fatal:", err)

    const message =
      err instanceof Error ? err.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to fetch experiences",
        details: message,
      },
      { status: 500 }
    )
  }
}
