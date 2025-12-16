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

/* ========================= PUT =========================
   PUT /api/services/:id
========================================================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await req.json();

    const { translations, ...serviceData } = body;

    /* 1️⃣ Update services table */
    const { error: serviceError } = await supabaseAdmin
      .from("services")
      .update(serviceData)
      .eq("id", id);

    if (serviceError) throw serviceError;

    /* 2️⃣ Update translations */
    if (Array.isArray(translations)) {
      for (const t of translations) {
        const { language, title, description, bullets } = t;

        const { data: existing } = await supabaseAdmin
          .from("service_translations")
          .select("id")
          .eq("service_id", id)
          .eq("language", language)
          .maybeSingle();

        if (existing) {
          await supabaseAdmin
            .from("service_translations")
            .update({ title, description, bullets })
            .eq("service_id", id)
            .eq("language", language);
        } else {
          await supabaseAdmin
            .from("service_translations")
            .insert([
              {
                service_id: id,
                language,
                title,
                description,
                bullets,
              },
            ]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}


/* ========================= DELETE =========================
   DELETE /api/services/:id
============================================================ */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { id } = await context.params;

    await supabaseAdmin
      .from("service_translations")
      .delete()
      .eq("service_id", id);

    const { error } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw new Error(getMessage(error));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getMessage(err) },
      { status: 500 }
    );
  }
}
