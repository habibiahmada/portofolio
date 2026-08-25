import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { withAdmin, type AdminSession } from "@/lib/supabase/admin-auth";
import { ok, okPaginated, fail, serverError } from "@/lib/supabase/api-response";
import { BLOG_CATEGORIES, BLOG_STATUSES, DATA_TAGS } from "@/lib/data/constants";
import {
  computeReadingTimeMinutes,
  normalizeSlug,
  TITLE_MAX,
  DESCRIPTION_MAX,
  BODY_MD_MAX,
  TAGS_MAX,
} from "@/lib/agent-blog";
import type { BlogPostRow, BlogStatus } from "@/lib/supabase/types";

/**
 * Admin blog moderation API (docs/blog-tasks.md §3).
 * Uses service role so draft/archived rows are visible (RLS only exposes published).
 * DELETE is archive-only — no hard delete.
 */

const PATCH_FIELDS = [
  "title",
  "description",
  "body_md",
  "category",
  "tags",
  "status",
  "slug",
  "seo_title",
  "seo_description",
  "cover_url",
  "canonical_url",
] as const;

function containsEmDash(value: string): boolean {
  return value.includes("—");
}

function revalidateBlog() {
  try {
    revalidateTag(DATA_TAGS.blog, "max");
  } catch (err) {
    console.error("[BLOG_ADMIN] revalidateTag failed:", err);
  }
}

async function handleGet(_request: NextRequest, _session: AdminSession) {
  // Service role: list every status (draft / published / archived).
  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json(serverError(error.message), { status: 500 });
  return NextResponse.json(okPaginated(data || [], count || 0, 1, 999));
}

async function handlePatch(request: NextRequest, _session: AdminSession) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fail("Body must be valid JSON.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) return NextResponse.json(fail("id is required"), { status: 400 });

  const updateData: Partial<BlogPostRow> & Record<string, unknown> = {};

  for (const field of PATCH_FIELDS) {
    if (body[field] === undefined) continue;

    if (
      field === "title" ||
      field === "description" ||
      field === "body_md" ||
      field === "seo_title" ||
      field === "seo_description"
    ) {
      if (body[field] !== null && typeof body[field] !== "string") {
        return NextResponse.json(fail(`"${field}" must be a string.`), { status: 400 });
      }
      const value = body[field] as string | null;
      if (typeof value === "string" && containsEmDash(value)) {
        return NextResponse.json(
          fail(
            `Field "${field}" contains an em dash (\u2014), which is not allowed.`,
            "VALIDATION_ERROR",
          ),
          { status: 400 },
        );
      }
    }

    if (field === "title") {
      const title = String(body.title).trim();
      if (!title || title.length > TITLE_MAX) {
        return NextResponse.json(
          fail(`"title" must be 1-${TITLE_MAX} characters.`),
          { status: 400 },
        );
      }
      updateData.title = title;
      continue;
    }

    if (field === "description") {
      const description = String(body.description).trim();
      if (!description || description.length > DESCRIPTION_MAX) {
        return NextResponse.json(
          fail(`"description" must be 1-${DESCRIPTION_MAX} characters.`),
          { status: 400 },
        );
      }
      updateData.description = description;
      continue;
    }

    if (field === "body_md") {
      const bodyMd = String(body.body_md);
      if (!bodyMd || bodyMd.length > BODY_MD_MAX) {
        return NextResponse.json(
          fail(`"body_md" must be 1-${BODY_MD_MAX} characters.`),
          { status: 400 },
        );
      }
      updateData.body_md = bodyMd;
      updateData.reading_time_minutes = computeReadingTimeMinutes(bodyMd);
      continue;
    }

    if (field === "category") {
      const category = String(body.category);
      if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) {
        return NextResponse.json(
          fail(
            `"category" must be one of: ${(BLOG_CATEGORIES as readonly string[]).join(", ")}.`,
          ),
          { status: 400 },
        );
      }
      updateData.category = category as BlogPostRow["category"];
      continue;
    }

    if (field === "tags") {
      if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== "string")) {
        return NextResponse.json(fail('"tags" must be an array of strings.'), {
          status: 400,
        });
      }
      const tags = (body.tags as string[]).map((t) => t.trim()).filter(Boolean);
      if (tags.length > TAGS_MAX) {
        return NextResponse.json(fail(`"tags" allows at most ${TAGS_MAX} items.`), {
          status: 400,
        });
      }
      updateData.tags = tags;
      continue;
    }

    if (field === "status") {
      const status = String(body.status) as BlogStatus;
      if (!(BLOG_STATUSES as readonly string[]).includes(status)) {
        return NextResponse.json(
          fail(`"status" must be one of: ${(BLOG_STATUSES as readonly string[]).join(", ")}.`),
          { status: 400 },
        );
      }
      updateData.status = status;
      continue;
    }

    if (field === "slug") {
      const slug = normalizeSlug(String(body.slug));
      if (!slug) {
        return NextResponse.json(fail('Could not derive a valid kebab-case "slug".'), {
          status: 400,
        });
      }
      updateData.slug = slug;
      continue;
    }

    if (field === "seo_title" || field === "seo_description" || field === "cover_url" || field === "canonical_url") {
      const raw = body[field];
      updateData[field] = raw === null || raw === "" ? null : String(raw);
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(fail("No fields to update"), { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Slug uniqueness against other rows.
  if (typeof updateData.slug === "string") {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", updateData.slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        fail(`Slug "${updateData.slug}" already exists. Pick another slug.`, "SLUG_CONFLICT"),
        { status: 409 },
      );
    }
  }

  // First publish: stamp published_at when moving to published without one.
  if (updateData.status === "published") {
    const { data: current } = await supabase
      .from("blog_posts")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (current && !current.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        fail(`Slug conflict on update.`, "SLUG_CONFLICT"),
        { status: 409 },
      );
    }
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  }

  if (!data) {
    return NextResponse.json(fail("Post not found.", "NOT_FOUND"), { status: 404 });
  }

  revalidateBlog();
  console.log(`[BLOG_ADMIN] patched id=${id} fields=${Object.keys(updateData).join(",")}`);
  return NextResponse.json(ok(data));
}

/** Archive-only soft delete (docs/blog-tasks.md 3.3). */
async function handleDelete(request: NextRequest, _session: AdminSession) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json(fail("id query param is required"), { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      status: "archived" satisfies BlogStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug, status")
    .single();

  if (error) {
    return NextResponse.json(fail(error.message, "DB_ERROR"), { status: 400 });
  }
  if (!data) {
    return NextResponse.json(fail("Post not found.", "NOT_FOUND"), { status: 404 });
  }

  revalidateBlog();
  console.log(`[BLOG_ADMIN] archived id=${id} slug=${data.slug}`);
  return NextResponse.json(ok({ archived: data.id, slug: data.slug, status: data.status }));
}

export const GET = (req: NextRequest) => withAdmin(req, (s) => handleGet(req, s));
export const PATCH = (req: NextRequest) => withAdmin(req, (s) => handlePatch(req, s));
export const DELETE = (req: NextRequest) => withAdmin(req, (s) => handleDelete(req, s));
