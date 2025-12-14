import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  const maybe = (e as { message?: unknown }).message;
  if (typeof maybe === "string") return maybe;
  try { return JSON.stringify(e); } catch { return String(e); }
}

type Translation = { language?: string; title?: string; description?: string; [k: string]: unknown };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";

  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      service_translations!inner (
        * 
      )
    `)
    .eq("service_translations.language", lang);

  return NextResponse.json({ data, error });
}

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  try {
    const body = await req.json();
    const translations = body.translations || [];
    delete body.translations;

    const { data: created, error } = await supabaseAdmin
      .from('services')
      .insert([body])
      .select()
      .single();

    if (error) throw new Error(getMessage(error));

    if (translations.length && created?.id) {
      const toInsert = (translations as Array<Translation>).map((t) => ({ ...t, service_id: created.id }));
      await supabaseAdmin.from('service_translations').insert(toInsert);
    }

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  try {
    const body = await req.json();
    const { id, translations } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const updatePayload = { ...body };
    delete updatePayload.id;
    delete updatePayload.translations;

    const { data: updated, error } = await supabaseAdmin
      .from('services')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

      if (error) throw new Error(getMessage(error));

    if (Array.isArray(translations)) {
      for (const t of translations as Array<Translation>) {
        const lang = t.language;
        const { data: existing } = await supabaseAdmin
          .from('service_translations')
          .select()
          .eq('service_id', id)
          .eq('language', lang)
          .limit(1)
          .maybeSingle();

        if (existing) {
          await supabaseAdmin
            .from('service_translations')
            .update(t)
            .eq('service_id', id)
            .eq('language', lang);
        } else {
          await supabaseAdmin
            .from('service_translations')
            .insert([{ ...t, service_id: id }]);
        }
      }
    }

    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await supabaseAdmin.from('service_translations').delete().eq('service_id', id);
    const { error } = await supabaseAdmin.from('services').delete().eq('id', id);
    if (error) throw new Error(getMessage(error));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = getMessage(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}