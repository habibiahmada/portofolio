import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { translateObject } from "@/lib/translator";

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
        service_translations (
          *
        )
      `
    );

  const filteredData = (data as unknown as { service_translations: Translation[] }[] || []).map((service) => ({
    ...service,
    service_translations: (service.service_translations || []).filter(
      (t) => t.language === lang
    )
  }));

  return NextResponse.json({ data: filteredData, error });
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
      const finalTranslations = [...translations];

      // Auto translate if only one is provided
      if (translations.length === 1) {
        const source = translations[0];
        const targetLang = source.language === "id" ? "en" : "id";
        const translated = await translateObject(
          source,
          targetLang,
          source.language,
          ["title", "description", "bullets"]
        );
        finalTranslations.push({ ...translated, language: targetLang });
      }

      const toInsert = (finalTranslations as Translation[]).map((t) => ({
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

export async function PATCH(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { id, language, translations, ...serviceData } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // 1. Update service main data
    if (Object.keys(serviceData).length > 0) {
      const { error: serviceError } = await supabaseAdmin
        .from("services")
        .update(serviceData)
        .eq("id", id);

      if (serviceError) throw new Error(getMessage(serviceError));
    }

    // 2. Upsert translations
    if (Array.isArray(translations) && translations.length > 0) {
      const finalTranslations = [...translations];

      // Auto translate if only one is provided
      if (translations.length === 1) {
        const source = translations[0];
        const targetLang = source.language === "id" ? "en" : "id";
        const translated = await translateObject(
          source,
          targetLang,
          source.language,
          ["title", "description", "bullets"]
        );
        finalTranslations.push({ ...translated, language: targetLang });
      }

      const upserts = finalTranslations.map((t: Translation) => ({
        ...t,
        service_id: id,
        language: t.language || language || 'en'
      }));

      const { error: transError } = await supabaseAdmin
        .from("service_translations")
        .upsert(upserts, { onConflict: 'service_id,language' });

      if (transError) throw new Error(getMessage(transError));
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error updating service:", err);
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // 1. Delete translations
    const { error: transError } = await supabaseAdmin
      .from("service_translations")
      .delete()
      .eq("service_id", id);

    if (transError) throw new Error(getMessage(transError));

    // 2. Delete main service
    const { error: serviceError } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (serviceError) throw new Error(getMessage(serviceError));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting service:", err);
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}
