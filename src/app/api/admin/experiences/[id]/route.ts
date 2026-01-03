import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
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

/* ================= UTILS ================= */

function getMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }
  return String(error)
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

    const client = supabaseAdmin

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

    // Delete existing to simulate upsert (consistent with project API)
    const languages = finalTranslations.map(t => t.language)
    const { error: delError } = await client
      .from("experience_translations")
      .delete()
      .eq("experience_id", id)
      .in("language", languages)

    if (delError) {
      console.error("Delete translations error:", delError)
      throw delError
    }

    const { error: insError } = await client
      .from("experience_translations")
      .insert(finalTranslations)

    if (insError) {
      console.error("Insert translations error:", insError)
      throw insError
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("PUT experience fatal:", err)

    return NextResponse.json(
      {
        error: "Failed to update experience",
        details: getMessage(err),
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

    const client = supabaseAdmin

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