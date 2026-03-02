import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { optimizeImage, getContentType } from "@/lib/image-optimizer";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client not configured" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: "Invalid file type. Only JPG, PNG, WEBP are allowed",
      },
      { status: 400 }
    );
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  // Optimize image (avatars should be smaller)
  const optimizedBuffer = await optimizeImage(fileBuffer, {
    maxWidth: 512,
    maxHeight: 512,
    quality: 85,
    format: 'webp',
  });

  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = fileName;
  const contentType = getContentType('webp');

  const { error } = await supabaseAdmin.storage
    .from("avatar") // ⬅️ bucket avatar
    .upload(filePath, optimizedBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const { data } = supabaseAdmin.storage
    .from("avatar")
    .getPublicUrl(filePath);

  return NextResponse.json({
    url: data.publicUrl,
  });
}
