import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServerClient, getSupabaseAdmin } from "@/lib/supabase/server";
import { withAdmin, type AdminSession } from "@/lib/supabase/admin-auth";
import { ok, okPaginated, fail, serverError } from "@/lib/supabase/api-response";
import { DATA_TAGS } from "@/lib/data/constants";
import type { ProjectRow } from "@/lib/supabase/types";

async function handleGet(_request: NextRequest, _session: AdminSession) {
  const supabase = await getSupabaseServerClient();
  const { data, error, count } = await (supabase.from("projects") as any)
    .select("*", { count: "exact" })
    .order("year", { ascending: false })
    .order("title_en", { ascending: true });

  if (error) return NextResponse.json(serverError(error.message), { status: 500 });
  return NextResponse.json(okPaginated(data || [], count || 0, 1, 999));
}

async function handlePost(request: NextRequest, _session: AdminSession) {
  const body = await request.json();
  if (!body.id || !body.title_en || !body.title_id) {
    return NextResponse.json(fail("id, title_en, and title_id are required"), { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await (supabase.from("projects") as any).insert({
    id: body.id,
    title_en: body.title_en,
    title_id: body.title_id,
    description_en: body.description_en || "",
    description_id: body.description_id || "",
    image: body.image || "",
    tags: body.tags || [],
    live_url: body.live_url || "",
    github_url: body.github_url || "",
    year: body.year || new Date().getFullYear(),
  });

  if (error) return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.projects, "max");
  return NextResponse.json(ok({ id: body.id }), { status: 201 });
}

async function handlePatch(request: NextRequest, _session: AdminSession) {
  const body = await request.json();
  if (!body.id) return NextResponse.json(fail("id is required"), { status: 400 });

  const supabase = getSupabaseAdmin();
  const updateData: Partial<ProjectRow> = {};
  const fields = ["title_en", "title_id", "description_en", "description_id", "image", "tags", "live_url", "github_url", "year"] as const;
  for (const field of fields) {
    if (body[field] !== undefined) (updateData as any)[field] = body[field];
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(fail("No fields to update"), { status: 400 });
  }

  const { data, error } = await (supabase.from("projects") as any)
    .update(updateData as any)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.projects, "max");
  return NextResponse.json(ok(data));
}

async function handleDelete(request: NextRequest, _session: AdminSession) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json(fail("id query param is required"), { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await (supabase.from("projects") as any).delete().eq("id", id);
  if (error) return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.projects, "max");
  return NextResponse.json(ok({ deleted: id }));
}

export const GET = (req: NextRequest) => withAdmin((s) => handleGet(req, s));
export const POST = (req: NextRequest) => withAdmin((s) => handlePost(req, s));
export const PATCH = (req: NextRequest) => withAdmin((s) => handlePatch(req, s));
export const DELETE = (req: NextRequest) => withAdmin((s) => handleDelete(req, s));
