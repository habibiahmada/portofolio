import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

/* =========================
   GET TESTIMONIAL
   GET /api/testimonials/:id
   ========================= */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

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
          language,
          content
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    // Filter translations in memory if lang is provided, but keep the testimonial
    if (lang && data.testimonial_translations) {
      data.testimonial_translations = (data.testimonial_translations as { language: string, content: string }[]).filter(
        (t) => t.language === lang
      );
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE TESTIMONIAL
   PUT /api/testimonials/:id
   ========================= */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await req.json();

    const { language, content, ...testimonialPayload } = body;

    /* 1️⃣ Update testimonials table */
    if (Object.keys(testimonialPayload).length > 0) {
      const { error: testimonialError } = await supabaseAdmin
        .from("testimonials")
        .update(testimonialPayload)
        .eq("id", id);

      if (testimonialError) throw testimonialError;
    }

    /* 2️⃣ Upsert testimonial_translations */
    if (language && content !== undefined) {
      const { error: transError } = await supabaseAdmin
        .from("testimonial_translations")
        .upsert({
          testimonial_id: id,
          language,
          content,
        }, { onConflict: 'testimonial_id,language' });

      if (transError) throw transError;
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE TESTIMONIAL
   DELETE /api/testimonials/:id
   ========================= */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { id } = await context.params;

    /* 1️⃣ Delete translations first (FK safe if not cascade) */
    const { error: translationError } = await supabaseAdmin
      .from("testimonial_translations")
      .delete()
      .eq("testimonial_id", id);

    if (translationError) throw translationError;

    /* 2️⃣ Delete testimonial */
    const { error: testimonialError } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (testimonialError) throw testimonialError;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}