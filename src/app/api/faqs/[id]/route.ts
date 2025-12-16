import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface FAQTranslationPayload {
  lang: string;
  question: string;
  answer: string;
}

interface FAQUpdatePayload {
  order_index: number;
  is_active: boolean;
  translations: FAQTranslationPayload[];
}

interface RouteParams {
  params: {
    id: string;
  };
}

/* ================= PUT ================= */
export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not available' },
        { status: 500 }
      );
    }

    const body = (await req.json()) as FAQUpdatePayload;
    const { order_index, is_active, translations } = body;

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        { error: 'Invalid translations payload' },
        { status: 400 }
      );
    }

    /* ===== Update FAQ ===== */
    const { error: faqError } = await supabaseAdmin
      .from('faqs')
      .update({
        order_index,
        is_active,
      })
      .eq('id', params.id);

    if (faqError) {
      throw faqError;
    }

    /* ===== Upsert Translations ===== */
    for (const translation of translations) {
      const { error: translationError } =
        await supabaseAdmin
          .from('faq_translations')
          .upsert(
            {
              faq_id: params.id,
              lang: translation.lang,
              question: translation.question,
              answer: translation.answer,
            },
            {
              onConflict: 'faq_id,lang',
            }
          );

      if (translationError) {
        throw translationError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'PUT /api/faqs/[id] error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not available' },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'DELETE /api/faqs/[id] error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
