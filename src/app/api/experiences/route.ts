import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { translateObject } from "@/lib/translator"

/* ================= TYPES ================= */

type ExperienceCreatePayload = {
  type: "experience" | "education"
  company: string
  location?: string
  start_date?: string | null
  end_date?: string | null
  skills?: string[]
  title: string
  description?: string
  language: string
  location_type?: string
  highlight?: string
}

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

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const body: ExperienceCreatePayload = await req.json()

    const {
      type,
      company,
      location,
      start_date,
      end_date,
      skills,
      title,
      description,
      language,
      location_type,
      highlight,
    } = body

    if (!type || !company || !title || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const client = supabaseAdmin ?? supabase

    /* insert main experience */
    const { data: experience, error: expError } = await client
      .from("experiences")
      .insert({
        type,
        company,
        location,
        start_date,
        end_date,
        skills,
      })
      .select("id")
      .single()

    if (expError || !experience) {
      console.error("Insert experiences error:", expError)
      throw expError
    }

    /* insert translation */
    const finalTranslations = [{
      experience_id: experience.id,
      language,
      title,
      description,
      location_type,
      highlight,
    }];

    // Auto translate to the other language
    const targetLang = language === "id" ? "en" : "id";
    const translated = await translateObject(
      { title, description, location_type, highlight },
      targetLang,
      language,
      ["title", "description", "location_type", "highlight"]
    );

    finalTranslations.push({
      experience_id: experience.id,
      language: targetLang,
      ...translated
    });

    const { error: transError } = await client
      .from("experience_translations")
      .insert(finalTranslations)

    if (transError) {
      console.error("Insert translations error:", transError)
      throw transError
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    console.error("POST experiences fatal:", err)

    const message =
      err instanceof Error ? err.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to create experience",
        details: message,
      },
      { status: 500 }
    )
  }
}