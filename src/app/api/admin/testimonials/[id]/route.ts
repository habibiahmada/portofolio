import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/* ================= TYPES ================= */

interface TestimonialTranslation {
  language: string;
  content: string;
}

interface TestimonialPayload {
  name?: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface UpdateBody extends TestimonialPayload {
  language?: string;
  content?: string;
}

/* ================= CONSTANTS ================= */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ================= UTILS ================= */

function getMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const err = error as {
      message?: unknown;
      code?: string;
      details?: string;
    };

    if (err.code === "23505") {
      const match = err.details?.match(/\((.*?)\)=\((.*?)\)/);
      const value = match?.[2] ?? "this name";
      return `A testimonial from "${value}" already exists.`;
    }

    if (typeof err.message === "string") {
      return err.message;
    }
  }

  return String(error);
}

function validateUUID(id: string) {
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: "Invalid ID format" },
      { status: 400 }
    );
  }
  return null;
}

/* =========================
   GET /api/admin/testimonials/:id
   ========================= */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const invalid = validateUUID(id);
    if (invalid) return invalid;

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") ?? "en";

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .select(
        `
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
        `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    if (lang && data.testimonial_translations) {
      data.testimonial_translations =
        (data.testimonial_translations as TestimonialTranslation[]).filter(
          (t) => t.language === lang
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* =========================
   PUT /api/testimonials/:id
   ========================= */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const invalid = validateUUID(id);
    if (invalid) return invalid;

    const body = (await req.json()) as UpdateBody;
    const {
      language = "en",
      content,
      ...testimonialPayload
    } = body;

    if (Object.keys(testimonialPayload).length > 0) {
      const { error } = await supabaseAdmin
        .from("testimonials")
        .update(testimonialPayload)
        .eq("id", id);

      if (error) throw error;
    }

    if (content !== undefined) {
      const { error } = await supabaseAdmin
        .from("testimonial_translations")
        .upsert(
          {
            testimonial_id: id,
            language,
            content,
          },
          { onConflict: "testimonial_id,language" }
        );

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE /api/testimonials/:id
   ========================= */

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const invalid = validateUUID(id);
    if (invalid) return invalid;

    const { error: translationError } = await supabaseAdmin
      .from("testimonial_translations")
      .delete()
      .eq("testimonial_id", id);

    if (translationError) throw translationError;

    const { error: testimonialError } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (testimonialError) throw testimonialError;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}