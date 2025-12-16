import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface FAQTranslationPayload {
  lang: string
  question: string
  answer: string
}

interface FAQUpdatePayload {
  order_index: number
  is_active: boolean
  translations: FAQTranslationPayload[]
}

/* ================= PUT ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not available' },
        { status: 500 }
      )
    }

    const { id } = await params
    const body = (await req.json()) as FAQUpdatePayload
    const { order_index, is_active, translations } = body

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        { error: 'Invalid translations payload' },
        { status: 400 }
      )
    }

    const { error: faqError } = await supabaseAdmin
      .from('faqs')
      .update({ order_index, is_active })
      .eq('id', id)

    if (faqError) throw faqError

    for (const t of translations) {
      const { error } = await supabaseAdmin
        .from('faq_translations')
        .upsert(
          {
            faq_id: id,
            lang: t.lang,
            question: t.question,
            answer: t.answer,
          },
          { onConflict: 'faq_id,lang' }
        )

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/faqs/[id] error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not available' },
        { status: 500 }
      )
    }

    const { id } = await params

    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/faqs/[id] error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    )
  }
}