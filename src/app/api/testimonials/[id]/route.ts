import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/* =========================
   UPDATE TESTIMONIAL
   ========================= */
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json(
            { error: "Supabase admin not initialized" },
            { status: 500 }
        );
    }

    const { id } = await context.params;
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

    /* 1️⃣ Update testimonials table */
    const { error: testimonialError } = await supabaseAdmin
        .from("testimonials")
        .update({
            name,
            role,
            company,
            avatar,
            rating,
        })
        .eq("id", id);

    if (testimonialError) {
        return NextResponse.json(
            { error: testimonialError },
            { status: 400 }
        );
    }

    /* 2️⃣ Update testimonial_translations */
    const { error: translationError } = await supabaseAdmin
        .from("testimonial_translations")
        .update({ content })
        .eq("testimonial_id", id)
        .eq("language", language);

    if (translationError) {
        return NextResponse.json(
            { error: translationError },
            { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
}

/* =========================
   DELETE TESTIMONIAL
   ========================= */
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json(
            { error: "Supabase admin not initialized" },
            { status: 500 }
        );
    }

    const { id } = await context.params;

    /* 1️⃣ Delete translations first (FK safe) */
    const { error: translationError } = await supabaseAdmin
        .from("testimonial_translations")
        .delete()
        .eq("testimonial_id", id);

    if (translationError) {
        return NextResponse.json(
            { error: translationError },
            { status: 400 }
        );
    }

    /* 2️⃣ Delete testimonial */
    const { error: testimonialError } = await supabaseAdmin
        .from("testimonials")
        .delete()
        .eq("id", id);

    if (testimonialError) {
        return NextResponse.json(
            { error: testimonialError },
            { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
}
