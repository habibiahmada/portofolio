import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from "@/lib/supabase/admin"

/* ================= TYPES ================= */

interface ServiceTranslationPayload {
  language: string
  title?: string
  description?: string
  bullets?: string[]
}

interface ServiceUpdatePayload {
  key?: string
  icon?: string
  color?: string
  is_active?: boolean
  translations?: ServiceTranslationPayload[]
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

  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

/* ================= GET ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
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
      .from('services')
      .select(`
        *,
        service_translations (
          *
        )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Filter translations in memory
    if (lang && data.service_translations) {
      data.service_translations = (data.service_translations as ServiceTranslationPayload[]).filter(
        (t) => t.language === lang
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('GET /api/services/[id] error:', error)
    return NextResponse.json({ error: getMessage(error) }, { status: 500 })
  }
}

/* ================= PUT ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  try {
    const { id } = await params

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const body = (await req.json()) as ServiceUpdatePayload
    const { translations, ...serviceData } = body

    if (Object.keys(serviceData).length > 0) {
      const { error: serviceError } = await supabaseAdmin
        .from('services')
        .update(serviceData)
        .eq('id', id)

      if (serviceError) throw serviceError
    }

    if (Array.isArray(translations) && translations.length > 0) {
      const rows = translations.map((t) => ({
        service_id: id,
        language: t.language,
        title: t.title,
        description: t.description,
        bullets: t.bullets,
      }))

      const { error } = await supabaseAdmin
        .from('service_translations')
        .upsert(rows, {
          onConflict: 'service_id,language',
        })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/services/[id] error:', error)
    return NextResponse.json({ error: getMessage(error) }, { status: 500 })
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  try {
    const { id } = await params

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const { error: translationError } = await supabaseAdmin
      .from('service_translations')
      .delete()
      .eq('service_id', id)

    if (translationError) throw translationError

    const { error: serviceError } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id)

    if (serviceError) throw serviceError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/services/[id] error:', error)
    return NextResponse.json({ error: getMessage(error) }, { status: 500 })
  }
}