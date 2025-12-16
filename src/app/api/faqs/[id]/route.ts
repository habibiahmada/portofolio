import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await req.json();
    const { order_index, is_active, translations } = body;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client not available" },
        { status: 500 }
      );
    }

    // Update parent FAQ
    const { error: faqError } = await supabaseAdmin
      .from("faqs")
      .update({ order_index, is_active })
      .eq("id", params.id);

    if (faqError) throw faqError;

    // Upsert translation(s)
    for (const t of translations) {
      const { error: translationError } = await supabaseAdmin
        .from("faq_translations")
        .upsert(
          {
            faq_id: params.id,
            lang: t.lang,
            question: t.question,
            answer: t.answer,
          },
          {
            onConflict: "faq_id,lang",
          }
        );

      if (translationError) throw translationError;
    }


    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/faqs/[id] error:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client not available" },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from("faqs")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/faqs/[id] error:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}