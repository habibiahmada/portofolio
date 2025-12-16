import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/* ================= TYPES ================= */

interface ServiceTranslationPayload {
  language: string;
  title?: string;
  description?: string;
  bullets?: string[];
}

interface ServiceUpdatePayload {
  key?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
  translations?: ServiceTranslationPayload[];
}

interface RouteParams {
  params: {
    id: string;
  };
}

/* ================= UTILS ================= */

function getMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/* ================= PUT =================
   PUT /api/services/[id]
========================================= */
export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as ServiceUpdatePayload;
    const { translations, ...serviceData } = body;

    /* ===== Update service ===== */
    const { error: serviceError } = await supabaseAdmin
      .from('services')
      .update(serviceData)
      .eq('id', params.id);

    if (serviceError) {
      throw serviceError;
    }

    /* ===== Upsert translations ===== */
    if (Array.isArray(translations) && translations.length > 0) {
      const rows = translations.map((t) => ({
        service_id: params.id,
        language: t.language,
        title: t.title,
        description: t.description,
        bullets: t.bullets,
      }));

      const { error: translationError } =
        await supabaseAdmin
          .from('service_translations')
          .upsert(rows, {
            onConflict: 'service_id,language',
          });

      if (translationError) {
        throw translationError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'PUT /api/services/[id] error:',
      error
    );

    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* ================= DELETE =================
   DELETE /api/services/[id]
=========================================== */
export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  try {
    /* ===== Delete translations first ===== */
    const { error: translationError } =
      await supabaseAdmin
        .from('service_translations')
        .delete()
        .eq('service_id', params.id);

    if (translationError) {
      throw translationError;
    }

    /* ===== Delete service ===== */
    const { error: serviceError } =
      await supabaseAdmin
        .from('services')
        .delete()
        .eq('id', params.id);

    if (serviceError) {
      throw serviceError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'DELETE /api/services/[id] error:',
      error
    );

    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}
