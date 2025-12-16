import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  const maybe = (e as { message?: unknown }).message;
  if (typeof maybe === "string") return maybe;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

type Translation = {
  language?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  [k: string]: unknown;
};

/* ========================= GET =========================
   GET /api/services?lang=en
========================================================= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";

  const { data, error } = await supabase
    .from("services")
    .select(
      `
        *,
        service_translations!inner (
          *
        )
      `
    )
    .eq("service_translations.language", lang);

  return NextResponse.json({ data, error });
}

/* ========================= POST =========================
   POST /api/services
========================================================== */
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const translations = body.translations || [];
    delete body.translations;

    const { data: created, error } = await supabaseAdmin
      .from("services")
      .insert([body])
      .select()
      .single();

    if (error) throw new Error(getMessage(error));

    if (translations.length && created?.id) {
      const toInsert = (translations as Translation[]).map((t) => ({
        ...t,
        service_id: created.id,
      }));

      await supabaseAdmin.from("service_translations").insert(toInsert);
    }

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}
