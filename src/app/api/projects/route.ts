import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { translateObject } from "@/lib/translator";

function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  const maybe = (e as { message?: unknown }).message;
  if (typeof maybe === "string") return maybe;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export const revalidate = 0;

interface ProjectTranslation {
  language: string;
  title: string;
  description: string;
}

interface ProjectWithTranslations {
  projects_translations: ProjectTranslation[];
  [k: string]: unknown;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      projects_translations (
        id,
        language,
        title,
        description
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized = (data as unknown as ProjectWithTranslations[] || []).map((p) => {
    const byLang = p.projects_translations?.find(
      (t) => t.language === lang
    );

    const fallback = p.projects_translations?.find(
      (t) => t.language === "en"
    );

    return {
      ...p,
      translation: byLang || fallback || null,
    };
  });

  return NextResponse.json({ data: normalized });
}


export async function POST(req: Request) {
  if (!supabaseAdmin)
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });

  try {
    const body = await req.json();
    const { translations, ...projectPayload } = body;

    if (!Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json(
        { error: "At least one translation is required" },
        { status: 400 }
      );
    }

    // Clean undefined
    const cleanedProject = Object.fromEntries(
      Object.entries(projectPayload).filter(([, v]) => v !== undefined)
    );

    // 1️⃣ Insert project
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert([cleanedProject])
      .select()
      .single();

    if (projectError || !project) {
      throw new Error(projectError?.message || "Failed to create project");
    }

    // 2️⃣ Insert translations (with auto-translation)
    const finalTranslations = [...translations];
    if (translations.length === 1) {
      const source = translations[0];
      const targetLang = source.language === "id" ? "en" : "id";
      const translated = await translateObject(source, targetLang, source.language, ["title", "description"]);
      finalTranslations.push({ ...translated, language: targetLang });
    }

    const preparedTranslations = finalTranslations.map((t: { language?: string; title?: string; description?: string }) => ({
      projects_id: project.id,
      language: t.language,
      title: t.title ?? "",
      description: t.description ?? "",
    }));

    const { error: transError } = await supabaseAdmin
      .from("projects_translations")
      .insert(preparedTranslations);

    if (transError) {
      // rollback biar DB tidak kotor
      await supabaseAdmin.from("projects").delete().eq("id", project.id);
      throw new Error(transError.message);
    }

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg ?? "Internal error" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request) {
  if (!supabaseAdmin)
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });

  try {
    const body = await req.json();
    const { id, translations, ...projectPayload } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Update project
    if (Object.keys(projectPayload).length > 0) {
      const { error } = await supabaseAdmin
        .from("projects")
        .update(projectPayload)
        .eq("id", id);

      if (error) throw new Error(error.message);
    }

    // Upsert translations (with auto-translation)
    if (Array.isArray(translations) && translations.length > 0) {
      const finalTranslations = [...translations];
      if (translations.length === 1) {
        const source = translations[0];
        const targetLang = source.language === "id" ? "en" : "id";
        const translated = await translateObject(source, targetLang, source.language, ["title", "description"]);
        finalTranslations.push({ ...translated, language: targetLang });
      }

      const languages = finalTranslations.map(t => t.language)
      await supabaseAdmin
        .from('projects_translations')
        .delete()
        .eq('projects_id', id)
        .in('language', languages)

      const upserts = finalTranslations.map((t: { language?: string; title?: string; description?: string }) => ({
        projects_id: id,
        language: t.language,
        title: t.title ?? "",
        description: t.description ?? "",
      }));

      const { error } = await supabaseAdmin
        .from("projects_translations")
        .insert(upserts);

      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg ?? "Internal error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await supabaseAdmin.from('projects_translations').delete().eq('projects_id', id);
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) throw new Error(getMessage(error));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = getMessage(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
