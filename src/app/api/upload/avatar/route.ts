 import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = fileName;

  const { error } = await supabaseAdmin.storage
    .from("avatar") // ⬅️ bucket avatar
    .upload(filePath, file, {
      contentType: file.type,
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
