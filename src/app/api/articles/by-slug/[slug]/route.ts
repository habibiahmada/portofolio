import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/* ================= GET ARTICLE BY SLUG ================= */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const { searchParams } = new URL(req.url)
        const lang = searchParams.get('lang') || 'en'

        console.log('Fetching article by slug:', slug, 'lang:', lang)

        // Query articles with translations and filter by slug in memory
        const { data: articles, error } = await supabase
            .from('articles')
            .select(`
                *,
                article_translations (*)
            `)
            .eq('published', true)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!articles || articles.length === 0) {
            return NextResponse.json({ error: 'No articles found' }, { status: 404 })
        }

        // Find article that has a translation with matching slug
        interface TranslationType {
            id?: number;
            article_id?: string;
            language?: string;
            title: string;
            slug: string;
            content: string;
            excerpt: string;
            tags: string[];
            read_time: string;
        }

        let foundArticle = null
        let foundTranslation: TranslationType | null = null

        for (const article of articles) {
            const translations = article.article_translations as TranslationType[]
            if (!translations) continue

            const matchingTranslation = translations.find(t => t.slug === slug)
            if (matchingTranslation) {
                foundArticle = article
                // Try to get translation in requested language, fallback to matched one
                foundTranslation = translations.find(t => t.language === lang) || matchingTranslation
                break
            }
        }

        if (!foundArticle || !foundTranslation) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        return NextResponse.json({
            data: {
                ...foundArticle,
                translation: foundTranslation,
            },
        })
    } catch (error) {
        console.error('GET /api/articles/by-slug/[slug] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
