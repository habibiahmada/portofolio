import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const TABLE = 'email_templates';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get('key') || 'contact';

    const db = supabaseAdmin ?? supabase;
    const { data, error } = await db.from(TABLE).select('*').eq('key', key).limit(1).maybeSingle();

    if (error) {
      console.error('Supabase error fetching template', error);
      return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }

    return NextResponse.json({ template: data ?? null });
  } catch (err) {
    console.error('GET /api/email-template', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { key?: string; subject?: string; body?: string } | undefined;
    const { key = 'contact', subject, body: templateBody } = (body ?? {});

    if (!subject || !templateBody) {
      return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 });
    }

    const db = supabaseAdmin ?? supabase;
    // upsert by key
    const row = {
      key,
      subject,
      body: templateBody,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await db.from(TABLE).upsert(row, { onConflict: 'key' }).select().single();
    if (error) {
      console.error('Supabase upsert error', error);
      return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, template: data });
  } catch (e: unknown) {
    console.error('POST /api/email-template', e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
