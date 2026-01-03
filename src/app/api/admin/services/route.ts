import { supabaseAdmin } from "@/lib/supabase/admin";
import { translateObject } from "@/lib/translator";
import { NextResponse } from "next/server";

type Translation = {
  language?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  [k: string]: unknown;
};

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

    if (error) throw error;

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
      { error: err },
      { status: 500 }
    );
  }
}