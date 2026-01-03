import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { translateObject } from "@/lib/translator";


type CertificationTranslationPayload = {
  language: string
  title: string
  description: string
  skills: string[]
}


type CreateCertificatePayload = {
  issuer: string
  year: string
  preview?: string
  translations: CertificationTranslationPayload[]
}


export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not configured" },
      { status: 500 }
    )
  }

  try {
    const body: CreateCertificatePayload = await req.json()
    const { issuer, year, preview, translations } = body

    if (!issuer || !year || !translations?.length) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      )
    }

    const { data: cert, error } = await supabaseAdmin
      .from("certifications")
      .insert({ issuer, year, preview })
      .select()
      .single()

    if (error || !cert) {
      return NextResponse.json(
        { error: error?.message || "Failed to create certificate" },
        { status: 400 }
      )
    }

    const finalTranslations = [...translations];

    if (translations.length === 1) {
      const source = translations[0];
      const targetLang = source.language === "id" ? "en" : "id";
      const translated = await translateObject(
        source,
        targetLang,
        source.language,
        ["title", "description", "skills"]
      );
      finalTranslations.push({ ...translated, language: targetLang });
    }

    const translationPayload = finalTranslations.map(
      (t: CertificationTranslationPayload) => ({
        certification_id: cert.id,
        language: t.language,
        title: t.title,
        description: t.description,
        skills: t.skills,
      })
    )

    const { error: translationError } = await supabaseAdmin
      .from("certification_translations")
      .insert(translationPayload)

    if (translationError) {
      return NextResponse.json(
        { error: translationError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ data: cert }, { status: 201 })
  } catch (err) {
    console.error("POST /certificates error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}