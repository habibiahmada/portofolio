import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  getSupabaseServerClient,
  getSupabaseAdmin,
} from "@/lib/supabase/server";
import { withAdmin, type AdminSession } from "@/lib/supabase/admin-auth";
import { ok, fail, serverError } from "@/lib/supabase/api-response";
import { DATA_TAGS } from "@/lib/data/constants";
import type { CompanyRow } from "@/lib/supabase/types";

async function handleGet(_request: NextRequest, _session: AdminSession) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await (supabase.from("companies") as any)
    .select("*")
    .order("name", { ascending: true });

  if (error)
    return NextResponse.json(serverError("Failed to fetch companies"), {
      status: 500,
    });
  return NextResponse.json(ok(data || []));
}

async function handlePost(request: NextRequest, _session: AdminSession) {
  const body = await request.json();
  if (!body.name)
    return NextResponse.json(fail("name is required"), { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await (supabase.from("companies") as any)
    .insert({ name: body.name, logo: body.logo || "" })
    .select()
    .single();

  if (error)
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.companies, "max");
  return NextResponse.json(ok(data), { status: 201 });
}

async function handlePatch(request: NextRequest, _session: AdminSession) {
  const body = await request.json();
  if (!body.id)
    return NextResponse.json(fail("id is required"), { status: 400 });

  const supabase = getSupabaseAdmin();
  const updateData: Partial<CompanyRow> = {};
  if (body.name !== undefined) (updateData as any).name = body.name;
  if (body.logo !== undefined) (updateData as any).logo = body.logo;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(fail("No fields to update"), { status: 400 });
  }

  const { data, error } = await (supabase.from("companies") as any)
    .update(updateData as any)
    .eq("id", body.id)
    .select()
    .single();

  if (error)
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.companies, "max");
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
  const { error } = await (supabase.from("companies") as any)
    .delete()
    .eq("id", id);
  if (error)
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  revalidateTag(DATA_TAGS.companies, "max");
  return NextResponse.json(ok({ deleted: id }));
}

export const GET = (req: NextRequest) => withAdmin((s) => handleGet(req, s));
export const POST = (req: NextRequest) => withAdmin((s) => handlePost(req, s));
export const PATCH = (req: NextRequest) =>
  withAdmin((s) => handlePatch(req, s));
export const DELETE = (req: NextRequest) =>
  withAdmin((s) => handleDelete(req, s));
