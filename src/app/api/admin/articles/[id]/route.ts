import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { translateObject } from '@/lib/translator'

/* ================= TYPES ================= */

interface ArticleTranslationPayload {
    id: string
    article_id: string
    language: string
    title: string
    slug: string
    content: string
    excerpt: string
    tags: string[]
    read_time: string
    created_at: string
}

interface ArticleWithTranslations {
    id: string
    image_url: string | null
    published: boolean
    published_at: string | null
    created_at: string
    updated_at: string | null
    article_translations: ArticleTranslationPayload[]
}

interface ArticleUpdatePayload {
    image_url?: string
    published?: boolean
    published_at?: string
    translations?: ArticleTranslationPayload[]
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
            .from('articles')
            .select(`
            id,
            image_url,
            published,
            published_at,
            created_at,
            updated_at,
            article_translations (
              id,
              article_id,
              language,
              title,
              slug,
              content,
              excerpt,
              tags,
              read_time,
              created_at
            )
        `)
            .eq('id', id)
            .maybeSingle()

        if (error) throw error
        if (!data) return NextResponse.json({ error: 'Article not found' }, { status: 404 })

        // Type assertion for the response
        const article = data as unknown as ArticleWithTranslations

        // Filter translations in memory
        if (lang && article.article_translations) {
            article.article_translations = article.article_translations.filter(
                (t) => t.language === lang
            )
        }

        return NextResponse.json({ data: article })
    } catch (error) {
        console.error('GET /api/articles/[id] error:', error)
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

        const body = (await req.json()) as ArticleUpdatePayload
        const { translations, ...articleData } = body

        // If publishing for the first time, set published_at
        if (articleData.published && !articleData.published_at) {
            articleData.published_at = new Date().toISOString()
        }

        if (Object.keys(articleData).length > 0) {
            const { error: articleError } = await supabaseAdmin
                .from('articles')
                .update(articleData)
                .eq('id', id)

            if (articleError) throw articleError
        }

        if (Array.isArray(translations) && translations.length > 0) {
            const finalTranslations = [...translations]

            // Auto translate if only one is provided
            if (translations.length === 1) {
                const source = translations[0]
                const targetLang = source.language === "id" ? "en" : "id"
                const translated = await translateObject(
                    source,
                    targetLang,
                    source.language,
                    ["title", "content", "excerpt", "tags", "read_time"]
                )
                const translatedSlug = source.slug + "-" + targetLang
                finalTranslations.push({
                    ...translated,
                    language: targetLang,
                    slug: translatedSlug
                })
            }

            const languages = finalTranslations.map(t => t.language)

            // Delete existing translations for these languages
            const { error: delError } = await supabaseAdmin
                .from('article_translations')
                .delete()
                .eq('article_id', id)
                .in('language', languages)

            if (delError) throw delError

            const rows = finalTranslations.map((t) => ({
                article_id: id,
                language: t.language,
                title: t.title,
                slug: t.slug,
                content: t.content,
                excerpt: t.excerpt,
                tags: t.tags,
                read_time: t.read_time,
            }))

            const { error: insError } = await supabaseAdmin
                .from('article_translations')
                .insert(rows)

            if (insError) throw insError
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PUT /api/articles/[id] error:', error)
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
            .from('article_translations')
            .delete()
            .eq('article_id', id)

        if (translationError) throw translationError

        const { error: articleError } = await supabaseAdmin
            .from('articles')
            .delete()
            .eq('id', id)

        if (articleError) throw articleError

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/articles/[id] error:', error)
        return NextResponse.json({ error: getMessage(error) }, { status: 500 })
    }
}
