import { NextResponse } from "next/server";
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

type Translation = {
  language?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  [k: string]: unknown;
};

/* =========================
   UPDATE SERVICE
   PUT /api/services/:id
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

  try {
    const { id } = await context.params;
    const body = await req.json();

    const { translations, ...servicePayload } = body;

    /* 1️⃣ Update services table */
    const { error: serviceError } = await supabaseAdmin
      .from("services")
      .update(servicePayload)
      .eq("id", id);

    if (serviceError) {
      return NextResponse.json(
        { error: serviceError },
        { status: 400 }
      );
    }

    /* 2️⃣ Upsert service_translations */
    if (Array.isArray(translations)) {
      for (const t of translations as Translation[]) {
        const language = t.language;

        const { data: existing } = await supabaseAdmin
          .from("service_translations")
          .select("id")
          .eq("service_id", id)
          .eq("language", language)
          .maybeSingle();

        if (existing) {
          await supabaseAdmin
            .from("service_translations")
            .update({
              title: t.title,
              description: t.description,
              bullets: t.bullets,
            })
            .eq("service_id", id)
            .eq("language", language);
        } else {
          await supabaseAdmin
            .from("service_translations")
            .insert([
              {
                service_id: id,
                language,
                title: t.title,
                description: t.description,
                bullets: t.bullets,
              },
            ]);
        }
      }
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
   DELETE SERVICE
   DELETE /api/services/:id
   ========================= */
export async function DELETE(
  _req: Request,
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

    /* 1️⃣ Delete translations first (FK safe) */
    const { error: translationError } = await supabaseAdmin
      .from("service_translations")
      .delete()
      .eq("service_id", id);

    if (translationError) {
      return NextResponse.json(
        { error: translationError },
        { status: 400 }
      );
    }

    /* 2️⃣ Delete service */
    const { error: serviceError } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (serviceError) {
      return NextResponse.json(
        { error: serviceError },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}