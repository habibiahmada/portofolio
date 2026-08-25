import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { withAdmin, type AdminSession } from "@/lib/supabase/admin-auth";
import { ok, fail } from "@/lib/supabase/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/blog/upload — upload a blog cover image (Task 11.2).
 * - WebP only
 * - Max 200 KB
 * - Stored in Supabase Storage bucket `blog-covers`
 * - Public read access
 */

const MAX_SIZE_BYTES = 200 * 1024; // 200 KB
const ALLOWED_TYPES = ["image/webp"];
const BUCKET = "blog-covers";

async function handlePost(request: NextRequest, _session: AdminSession) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const postId = formData.get("post_id") as string | null;

  if (!file) {
    return NextResponse.json(fail("No file provided.", "VALIDATION_ERROR"), {
      status: 400,
    });
  }

  // Validate file type (WebP only)
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      fail(
        `Only WebP images are allowed. Got: ${file.type || "unknown"}`,
        "VALIDATION_ERROR",
      ),
      { status: 400 },
    );
  }

  // Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      fail(
        `File too large. Maximum size is ${MAX_SIZE_BYTES / 1024} KB. Got: ${Math.round(file.size / 1024)} KB`,
        "VALIDATION_ERROR",
      ),
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  // Generate unique filename
  const ext = "webp";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const filename = postId
    ? `${postId}-${timestamp}.${ext}`
    : `cover-${timestamp}-${random}.${ext}`;
  // Object key inside the bucket (do not prefix the bucket name again).
  const path = filename;

  // Convert File to ArrayBuffer for Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
    });

  if (uploadError) {
    console.error("[BLOG_UPLOAD] storage error:", uploadError.message);
    return NextResponse.json(
      fail("Upload failed.", "STORAGE_ERROR"),
      { status: 500 },
    );
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(uploadData.path);

  console.log(`[BLOG_UPLOAD] uploaded cover: ${path}`);

  return NextResponse.json(
    ok({
      url: urlData.publicUrl,
      path: uploadData.path,
      size: file.size,
    }),
  );
}

export const POST = (req: NextRequest) =>
  withAdmin(req, (s) => handlePost(req, s));
