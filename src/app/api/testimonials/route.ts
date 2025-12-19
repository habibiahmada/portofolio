import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { translateText } from "@/lib/translator";

export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select(`
      id,
      name,
      role,
      company,
      avatar,
      rating,
      testimonial_translations (
        id,
        language,
        content
      )
    `)
    .eq("testimonial_translations.language", lang)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const {
    name,
    role,
    company,
    avatar,
    rating,
    language,
    content,
  } = body;

  // 1. insert testimonial
  const { data: testimonial, error } = await supabaseAdmin
    .from("testimonials")
    .insert({
      name,
      role,
      company,
      avatar,
      rating,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // 2. insert translations (with auto-translation)
  const targetLang = language === "id" ? "en" : "id";
  const translatedContent = await translateText(content, targetLang, language);

  const { error: translationError } = await supabaseAdmin
    .from("testimonial_translations")
    .insert([
      { testimonial_id: testimonial.id, language, content },
      { testimonial_id: testimonial.id, language: targetLang, content: translatedContent }
    ]);

  if (translationError) {
    return NextResponse.json(
      { error: translationError },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { id, language = 'en', ...payload } = body;
    const { content, ...testimonialData } = payload;

    if (!id) {
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 });
    }

    // 1. Update testimonial main data
    if (Object.keys(testimonialData).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("testimonials")
        .update(testimonialData)
        .eq("id", id);

      if (updateError) throw updateError;
    }

    // 2. Upsert translations (with auto-translation)
    if (content !== undefined) {
      const targetLang = language === "id" ? "en" : "id";
      const translatedContent = await translateText(content, targetLang, language);

      const rows = [
        { testimonial_id: id, language, content },
        { testimonial_id: id, language: targetLang, content: translatedContent }
      ];

      const { error: transError } = await supabaseAdmin
        .from("testimonial_translations")
        .upsert(rows, { onConflict: 'testimonial_id,language' });

      if (transError) throw transError;
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error updating testimonial:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 });
    }

    // 1. Delete translations first
    const { error: transError } = await supabaseAdmin
      .from("testimonial_translations")
      .delete()
      .eq("testimonial_id", id);

    if (transError) throw transError;

    // 2. Delete main testimonial
    const { error: deleteError } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting testimonial:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
