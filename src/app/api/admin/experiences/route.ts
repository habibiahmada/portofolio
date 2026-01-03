import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { translateObject } from "@/lib/translator"

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

        const client = supabaseAdmin

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

        return NextResponse.json(
            {
                error: "Failed to create experience",
                details: getMessage(err),
            },
            { status: 500 }
        )
    }
}
