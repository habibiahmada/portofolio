import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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
    const body = (await req.json()) as ServiceUpdatePayload
    const { translations, ...serviceData } = body

    const { error: serviceError } = await supabaseAdmin
      .from('services')
      .update(serviceData)
      .eq('id', id)

    if (serviceError) throw serviceError

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

    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    )
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

    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    )
  }
}
