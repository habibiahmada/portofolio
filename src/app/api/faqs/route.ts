import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { translateObject } from '@/lib/translator';

interface FAQTranslationPayload {
  lang: string;
  question: string;
  answer: string;
}

interface FAQCreatePayload {
  order_index: number;
  translations: FAQTranslationPayload[];
}

/* ================= GET ================= */
export async function GET(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not available' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') ?? 'id';

    const { data, error } = await supabaseAdmin
      .from('faqs')
      .select(
        `
          id,
          order_index,
          is_active,
          faq_translations (
            lang,
            question,
            answer
          )
        `
      )
      .eq('faq_translations.lang', lang)
      .eq('is_active', true)
      .order('order_index');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/faqs error:', error);

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

/* ================= POST ================= */
export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not available' },
        { status: 500 }
      );
    }

    const body = (await req.json()) as FAQCreatePayload;
    const { order_index, translations } = body;

    if (!Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json(
        { error: 'Translations payload is required' },
        { status: 400 }
      );
    }

    /* ===== Insert FAQ ===== */
    const { data: faq, error: faqError } = await supabaseAdmin
      .from('faqs')
      .insert({
        order_index,
        is_active: true,
      })
      .select()
      .single();

    if (faqError || !faq) {
      throw faqError;
    }

    /* ===== Insert Translations ===== */
    const finalTranslations = [...translations];

    if (translations.length === 1) {
      const source = translations[0];
      const targetLang = source.lang === 'id' ? 'en' : 'id';
      const translated = await translateObject(source, targetLang, source.lang, ['question', 'answer']);
      finalTranslations.push({ ...translated, lang: targetLang });
    }

    const rows = finalTranslations.map(
      (translation): FAQTranslationPayload & { faq_id: string } => ({
        faq_id: faq.id,
        lang: translation.lang,
        question: translation.question,
        answer: translation.answer,
      })
    );

    const { error: translationError } =
      await supabaseAdmin
        .from('faq_translations')
        .insert(rows);

    if (translationError) {
      throw translationError;
    }

    return NextResponse.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error('POST /api/faqs error:', error);

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