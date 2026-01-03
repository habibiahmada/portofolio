import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not initialized" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";

  const { data, error } = await supabase
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
