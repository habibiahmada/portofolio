import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { translateText } from "@/lib/translator";

/* ================= UTILS ================= */

interface PostgresError {
  code?: string;
  details?: string;
  message: string;
}

function getMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const err = error as PostgresError;
    if (err.code === "23505") {
      const match = err.details?.match(/\((.*?)\)=\((.*?)\)/);
      const val = match ? match[2] : "this value";
      return `A testimonial from "${val}" already exists.`;
    }
    return err.message;
  }

  return String(error);
}

function validateRating(rating?: number) {
  if (rating === undefined) return true;
  return rating >= 1 && rating <= 5;
}

async function safeTranslate(
  content: string,
  targetLang: string,
  sourceLang: string
) {
  try {
    return await translateText(content, targetLang, sourceLang);
  } catch {
    return content;
  }
}

/* ================= POST ================= */

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const {
      name,
      role,
      company,
      avatar,
      rating,
      language = "en",
      content,
    } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    if (!validateRating(rating)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

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
      return NextResponse.json({ error: getMessage(error) }, { status: 400 });
    }

    const targetLang = language === "id" ? "en" : "id";
    const translatedContent = await safeTranslate(
      content,
      targetLang,
      language
    );

    const { error: translationError } = await supabaseAdmin
      .from("testimonial_translations")
      .insert([
        { testimonial_id: testimonial.id, language, content },
        {
          testimonial_id: testimonial.id,
          language: targetLang,
          content: translatedContent,
        },
      ]);

    if (translationError) {
      await supabaseAdmin
        .from("testimonials")
        .delete()
        .eq("id", testimonial.id);

      return NextResponse.json(
        { error: getMessage(translationError) },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error creating testimonial:", err);
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}

/* ================= PATCH ================= */

export async function PATCH(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin not initialized" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { id, language = "en", content, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing testimonial ID" },
        { status: 400 }
      );
    }

    const testimonialData = (({
      name,
      role,
      company,
      avatar,
      rating,
    }) => ({
      name,
      role,
      company,
      avatar,
      rating,
    }))(rest);

    if (testimonialData.rating && !validateRating(testimonialData.rating)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (Object.values(testimonialData).some(v => v !== undefined)) {
      const { error } = await supabaseAdmin
        .from("testimonials")
        .update(testimonialData)
        .eq("id", id);

      if (error) throw error;
    }

    if (content !== undefined) {
      const targetLang = language === "id" ? "en" : "id";
      const translatedContent = await safeTranslate(
        content,
        targetLang,
        language
      );

      const { error } = await supabaseAdmin
        .from("testimonial_translations")
        .upsert(
          [
            { testimonial_id: id, language, content },
            {
              testimonial_id: id,
              language: targetLang,
              content: translatedContent,
            },
          ],
          { onConflict: "testimonial_id,language" }
        );

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating testimonial:", err);
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */

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
      return NextResponse.json(
        { error: "Missing testimonial ID" },
        { status: 400 }
      );
    }

    const { error: transError } = await supabaseAdmin
      .from("testimonial_translations")
      .delete()
      .eq("testimonial_id", id);

    if (transError) throw transError;

    const { error: deleteError } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}
