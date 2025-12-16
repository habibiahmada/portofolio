import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/* ================= PUT ================= */

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Invalid certificate ID" },
      { status: 400 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { issuer, year, preview, translations } = body;

  /* ---------- update main table ---------- */
  const { error: certError } = await supabaseAdmin
    .from("certifications")
    .update({
      issuer,
      year,
      preview,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (certError) {
    return NextResponse.json(
      { error: certError.message },
      { status: 400 }
    );
  }

  /* ---------- upsert translations ---------- */
  for (const t of translations ?? []) {
    const { error: transError } = await supabaseAdmin
      .from("certification_translations")
      .upsert(
        {
          certification_id: id,
          language: t.language,
          title: t.title,
          description: t.description,
          skills: t.skills,
        },
        { onConflict: "certification_id,language" }
      );

    if (transError) {
      return NextResponse.json(
        { error: transError.message },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ success: true });
}

/* ================= DELETE ================= */

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Invalid certificate ID" },
      { status: 400 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client not configured" },
      { status: 500 }
    );
  }

  /* ---------- get certificate (for preview url) ---------- */
  const { data: cert, error: fetchError } = await supabaseAdmin
    .from("certifications")
    .select("preview")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 400 }
    );
  }

  /* ---------- delete file from storage ---------- */
  if (cert?.preview) {
    try {
      const url = new URL(cert.preview);
      const path = url.pathname.replace("/storage/v1/object/public/", "");

      const { error: storageError } = await supabaseAdmin.storage
        .from("certificates")
        .remove([path.replace("certificates/", "")]);

      if (storageError) {
        return NextResponse.json(
          { error: storageError.message },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid preview file URL" },
        { status: 400 }
      );
    }
  }

  /* ---------- delete translations ---------- */
  const { error: transError } = await supabaseAdmin
    .from("certification_translations")
    .delete()
    .eq("certification_id", id);

  if (transError) {
    return NextResponse.json(
      { error: transError.message },
      { status: 400 }
    );
  }

  /* ---------- delete certificate ---------- */
  const { error: certError } = await supabaseAdmin
    .from("certifications")
    .delete()
    .eq("id", id);

  if (certError) {
    return NextResponse.json(
      { error: certError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}