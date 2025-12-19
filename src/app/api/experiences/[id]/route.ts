import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { translateObject } from "@/lib/translator"

/* ================= TYPES ================= */

type ExperienceUpdatePayload = {
  type?: "experience" | "education"
  company?: string
  location?: string
  start_date?: string | null
  end_date?: string | null
  skills?: string[]
  title?: string
  description?: string
  language?: string
  location_type?: string
  highlight?: string
}

/* ================= PUT ================= */

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body: ExperienceUpdatePayload = await req.json()
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

    if (!language) {
      return NextResponse.json(
        { error: "Missing language" },
        { status: 400 }
      )
    }

    const client = supabaseAdmin ?? supabase

    /* update experiences */
    const { error: expError } = await client
      .from("experiences")
      .update({
        type,
        company,
        location,
        start_date,
        end_date,
        skills,
      })
      .eq("id", id)

    if (expError) {
      console.error("Update experiences error:", expError)
      throw expError
    }

    /* update translations */
    const finalTranslations = [{
      experience_id: id,
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
      experience_id: id,
      language: targetLang,
      ...translated
    });

    const { error: transError } = await client
      .from("experience_translations")
      .upsert(finalTranslations, { onConflict: 'experience_id,language' })

    if (transError) {
      console.error("Update translations error:", transError)
      throw transError
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("PUT experience fatal:", err)

    const message =
      err instanceof Error ? err.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to update experience",
        details: message,
      },
      { status: 500 }
    )
  }
}

/* ================= DELETE ================= */

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const client = supabaseAdmin ?? supabase

    const { error: transError } = await client
      .from("experience_translations")
      .delete()
      .eq("experience_id", id)

    if (transError) {
      console.error("Delete translations error:", transError)
      throw transError
    }

    const { error: expError } = await client
      .from("experiences")
      .delete()
      .eq("id", id)

    if (expError) {
      console.error("Delete experience error:", expError)
      throw expError
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("DELETE experience fatal:", err)

    const message =
      err instanceof Error ? err.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to delete experience",
        details: message,
      },
      { status: 500 }
    )
  }
}