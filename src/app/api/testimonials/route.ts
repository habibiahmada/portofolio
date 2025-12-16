import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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
    return NextResponse.json({ error }, { status: 400 });
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

  // 2. insert translation
  const { error: translationError } = await supabaseAdmin
    .from("testimonial_translations")
    .insert({
      testimonial_id: testimonial.id,
      language,
      content,
    });

  if (translationError) {
    return NextResponse.json(
      { error: translationError },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
