import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { translateObject } from "@/lib/translator";

/* ================= TYPES ================= */

interface ProjectTranslationPayload {
  language: string;
  title: string;
  description: string;
}

interface ProjectUpdatePayload {
  image_url?: string;
  year?: number;
  technologies?: string[];
  live_url?: string;
  github_url?: string;
}

interface UpdateBody extends ProjectUpdatePayload {
  title?: string;
  description?: string;
  translations?: ProjectTranslationPayload[];
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
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
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

/* ================= GET ================= */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
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
      .from("projects")
      .select(`*, projects_translations (*)`)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (lang && data.projects_translations) {
      data.projects_translations =
        data.projects_translations.filter(
          (t: ProjectTranslationPayload) => t.language === lang
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* ================= PUT ================= */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const invalid = validateUUID(id);
    if (invalid) return invalid;

    const body = (await req.json()) as UpdateBody;
    const {
      translations,
      title,
      description,
      ...projectData
    } = body;

    let finalTranslations = translations;

    if (!finalTranslations && (title || description)) {
      finalTranslations = [
        {
          language: "en",
          title: title ?? "",
          description: description ?? "",
        },
      ];
    }

    if (Object.keys(projectData).length > 0) {
      const { error } = await supabaseAdmin
        .from("projects")
        .update(projectData)
        .eq("id", id);

      if (error) throw error;
    }

    if (finalTranslations && finalTranslations.length > 0) {
      const allTranslations = [...finalTranslations];

      if (finalTranslations.length === 1) {
        const source = finalTranslations[0];
        const targetLang = source.language === "id" ? "en" : "id";

        const translated = await translateObject(
          source,
          targetLang,
          source.language,
          ["title", "description"]
        );

        allTranslations.push({
          ...translated,
          language: targetLang,
        });
      }

      const languages = allTranslations.map((t) => t.language);

      const { error: delError } = await supabaseAdmin
        .from("projects_translations")
        .delete()
        .eq("projects_id", id)
        .in("language", languages);

      if (delError) throw delError;

      const rows = allTranslations.map((t) => ({
        projects_id: id,
        language: t.language,
        title: t.title,
        description: t.description,
      }));

      const { error: insError } = await supabaseAdmin
        .from("projects_translations")
        .insert(rows);

      if (insError) throw insError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;
    const invalid = validateUUID(id);
    if (invalid) return invalid;

    const { error: translationError } = await supabaseAdmin
      .from("projects_translations")
      .delete()
      .eq("projects_id", id);

    if (translationError) throw translationError;

    const { error: projectError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (projectError) throw projectError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}
