import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { translateObject } from '@/lib/translator'

/* ================= TYPES ================= */

interface ProjectTranslationPayload {
    language: string
    title: string
    description: string
}

interface ProjectUpdatePayload {
    image_url?: string
    year?: number
    technologies?: string[]
    live_url?: string
    github_url?: string
    translations?: ProjectTranslationPayload[]
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

/* ================= GET ================= */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const lang = searchParams.get('lang') || 'en'

        // Validate UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('projects')
            .select(`
        *,
        projects_translations (
          *
        )
      `)
            .eq('id', id)
            .maybeSingle()

        if (error) throw error
        if (!data) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

        // Filter translations in memory
        if (lang && data.projects_translations) {
            data.projects_translations = (data.projects_translations as ProjectTranslationPayload[]).filter(
                (t) => t.language === lang
            )
        }

        return NextResponse.json({ data })
    } catch (error) {
        console.error('GET /api/projects/[id] error:', error)
        return NextResponse.json({ error: getMessage(error) }, { status: 500 })
    }
}

/* ================= PUT ================= */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    try {
        const { id } = await params

        // Validate UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
        }

        const body = (await req.json()) as ProjectUpdatePayload
        const { translations, ...projectData } = body

        if (Object.keys(projectData).length > 0) {
            const { error: projectError } = await supabaseAdmin
                .from('projects')
                .update(projectData)
                .eq('id', id)

            if (projectError) throw projectError
        }

        if (Array.isArray(translations) && translations.length > 0) {
            const finalTranslations = [...translations]

            // Auto translate if only one is provided
            if (translations.length === 1) {
                const source = translations[0]
                const targetLang = source.language === "id" ? "en" : "id"
                const translated = await translateObject(source, targetLang, source.language, ["title", "description"])
                finalTranslations.push({ ...translated, language: targetLang })
            }

            const languages = finalTranslations.map(t => t.language)

            // Delete existing translations for these languages to simulate upsert
            const { error: delError } = await supabaseAdmin
                .from('projects_translations')
                .delete()
                .eq('projects_id', id)
                .in('language', languages)

            if (delError) throw delError

            const rows = finalTranslations.map((t) => ({
                projects_id: id,
                language: t.language,
                title: t.title,
                description: t.description,
            }))

            const { error: insError } = await supabaseAdmin
                .from('projects_translations')
                .insert(rows)

            if (insError) throw insError
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PUT /api/projects/[id] error:', error)
        return NextResponse.json({ error: getMessage(error) }, { status: 500 })
    }
}

/* ================= DELETE ================= */
export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    try {
        const { id } = await params

        // Validate UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
        }

        const { error: translationError } = await supabaseAdmin
            .from('projects_translations')
            .delete()
            .eq('projects_id', id)

        if (translationError) throw translationError

        const { error: projectError } = await supabaseAdmin
            .from('projects')
            .delete()
            .eq('id', id)

        if (projectError) throw projectError

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/projects/[id] error:', error)
        return NextResponse.json({ error: getMessage(error) }, { status: 500 })
    }
}
