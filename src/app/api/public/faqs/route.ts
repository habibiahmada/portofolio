import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/* ================= GET ================= */
export async function GET(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not available' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') ?? 'id';

    const { data, error } = await supabase
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
    console.error('GET /api/public/faqs error:', error);

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
