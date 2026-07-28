import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  getSupabaseServerClient,
  getSupabaseAdmin,
} from "@/lib/supabase/server";
import { withAdmin, type AdminSession } from "@/lib/supabase/admin-auth";
import {
  ok,
  okPaginated,
  fail,
  serverError,
} from "@/lib/supabase/api-response";
import { DATA_TAGS } from "@/lib/data/constants";
import type { CertificateRow } from "@/lib/supabase/types";

async function handleGet(_request: NextRequest, _session: AdminSession) {
  const supabase = await getSupabaseServerClient();
  const { data, error, count } = await (supabase.from("certificates") as any)
    .select("*", { count: "exact" })
    .order("is_pinned", { ascending: false })
    .order("title", { ascending: true });

  if (error)
    return NextResponse.json(serverError("Failed to fetch certificates"), {
      status: 500,
    });
  return NextResponse.json(okPaginated(data || [], count || 0, 1, 999));
}

async function handlePost(request: NextRequest, _session: AdminSession) {
  const body = await request.json();
  if (!body.id || !body.title || !body.org) {
    return NextResponse.json(fail("id, title, org are required"), {
      status: 400,
    });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await (supabase.from("certificates") as any).insert({
    id: body.id,
    org: body.org,
    title: body.title,
    description: body.description || "",
    pages: body.pages || [],
    thumb: body.thumb || "",
    is_pinned: body.is_pinned || false,
  });

  if (error)
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.certificates);
  return NextResponse.json(ok({ id: body.id }), { status: 201 });
}

async function handlePatch(request: NextRequest, _session: AdminSession) {
  const body = await request.json();
  if (!body.id)
    return NextResponse.json(fail("id is required"), { status: 400 });

  const supabase = getSupabaseAdmin();
  const updateData: Partial<CertificateRow> = {};
  const fields = [
    "org",
    "title",
    "description",
    "pages",
    "thumb",
    "is_pinned",
  ] as const;
  for (const field of fields) {
    if (body[field] !== undefined) (updateData as any)[field] = body[field];
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(fail("No fields to update"), { status: 400 });
  }

  const { data, error } = await (supabase.from("certificates") as any)
    .update(updateData as any)
    .eq("id", body.id)
    .select()
    .single();

  if (error)
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.certificates);
  return NextResponse.json(ok(data));
}

async function handleDelete(request: NextRequest, _session: AdminSession) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json(fail("id query param is required"), {
      status: 400,
    });

  const supabase = getSupabaseAdmin();
  const { error } = await (supabase.from("certificates") as any)
    .delete()
    .eq("id", id);
  if (error)
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.certificates);
  return NextResponse.json(ok({ deleted: id }));
}

export const GET = (req: NextRequest) => withAdmin((s) => handleGet(req, s));
export const POST = (req: NextRequest) => withAdmin((s) => handlePost(req, s));
export const PATCH = (req: NextRequest) =>
  withAdmin((s) => handlePatch(req, s));
export const DELETE = (req: NextRequest) =>
  withAdmin((s) => handleDelete(req, s));
