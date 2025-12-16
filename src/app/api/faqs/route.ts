import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client not available" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "id";

    const { data, error } = await supabaseAdmin
      .from("faqs")
      .select(`
        id,
        order_index,
        is_active,
        faq_translations (
          lang,
          question,
          answer
        )
      `)
      .eq("faq_translations.lang", lang)
      .eq("is_active", true)
      .order("order_index");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/faqs error:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client not available" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { order_index, translations } = body;

    const { data: faq, error: faqError } = await supabaseAdmin
      .from("faqs")
      .insert({ order_index })
      .select()
      .single();

    if (faqError) throw faqError;

    const rows = translations.map((t: any) => ({
      faq_id: faq.id,
      lang: t.lang,
      question: t.question,
      answer: t.answer,
    }));

    const { error: translationError } = await supabaseAdmin
      .from("faq_translations")
      .insert(rows);

    if (translationError) throw translationError;

    return NextResponse.json(faq);
  } catch (error: any) {
    console.error("POST /api/faqs error:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}