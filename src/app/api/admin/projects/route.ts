import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { translateObject } from "@/lib/translator";

/* ================= TYPES ================= */

interface ProjectTranslationPayload {
  language: string;
  title: string;
  description: string;
}

interface ProjectPayload {
  image_url?: string;
  year?: number;
  technologies?: string[];
  live_url?: string;
  github_url?: string;
}

interface CreateUpdateBody extends ProjectPayload {
  id?: string;
  title?: string;
  description?: string;
  translations?: ProjectTranslationPayload[];
}

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

function normalizeTranslations(
  translations?: ProjectTranslationPayload[],
  title?: string,
  description?: string
): ProjectTranslationPayload[] | null {
  if (translations && translations.length > 0) return translations;
  if (title || description) {
    return [
      {
        language: "en",
        title: title ?? "",
        description: description ?? "",
      },
    ];
  }
  return null;
}

async function withAutoTranslation(
  translations: ProjectTranslationPayload[]
): Promise<ProjectTranslationPayload[]> {
  if (translations.length !== 1) return translations;

  const source = translations[0];
  const targetLang = source.language === "id" ? "en" : "id";

  const translated = await translateObject(
    source,
    targetLang,
    source.language,
    ["title", "description"]
  );

  return [...translations, { ...translated, language: targetLang }];
}

function cleanPayload<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

/* ================= POST ================= */

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as CreateUpdateBody;

    const {
      translations,
      title,
      description,
      ...projectPayload
    } = body;

    const finalTranslations = normalizeTranslations(
      translations,
      title,
      description
    );

    if (!finalTranslations) {
      return NextResponse.json(
        { error: "At least one translation is required" },
        { status: 400 }
      );
    }

    const cleanedProject = cleanPayload(projectPayload);

    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert([cleanedProject])
      .select()
      .single();

    if (projectError || !project) {
      throw new Error(projectError?.message ?? "Failed to create project");
    }

    const translationsWithAuto = await withAutoTranslation(finalTranslations);

    const rows = translationsWithAuto.map((t) => ({
      projects_id: project.id,
      language: t.language,
      title: t.title,
      description: t.description,
    }));

    const { error: transError } = await supabaseAdmin
      .from("projects_translations")
      .insert(rows);

    if (transError) {
      await supabaseAdmin.from("projects").delete().eq("id", project.id);
      throw new Error(transError.message);
    }

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* ================= PATCH ================= */

export async function PATCH(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as CreateUpdateBody;

    const {
      id,
      translations,
      title,
      description,
      ...projectPayload
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const finalTranslations = normalizeTranslations(
      translations,
      title,
      description
    );

    const cleanedProject = cleanPayload(projectPayload);

    if (Object.keys(cleanedProject).length > 0) {
      const { error } = await supabaseAdmin
        .from("projects")
        .update(cleanedProject)
        .eq("id", id);

      if (error) throw new Error(error.message);
    }

    if (finalTranslations) {
      const translationsWithAuto = await withAutoTranslation(finalTranslations);

      const languages = translationsWithAuto.map((t) => t.language);

      await supabaseAdmin
        .from("projects_translations")
        .delete()
        .eq("projects_id", id)
        .in("language", languages);

      const rows = translationsWithAuto.map((t) => ({
        projects_id: id,
        language: t.language,
        title: t.title,
        description: t.description,
      }));

      const { error } = await supabaseAdmin
        .from("projects_translations")
        .insert(rows);

      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */

export async function DELETE(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await supabaseAdmin
      .from("projects_translations")
      .delete()
      .eq("projects_id", id);

    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: getMessage(error) },
      { status: 500 }
    );
  }
}
