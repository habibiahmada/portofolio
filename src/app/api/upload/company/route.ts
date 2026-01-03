import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const fileName = `companies/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from("companies logo")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("companies logo")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Company upload error:", msg);
    return NextResponse.json({ error: msg || "Upload failed" }, { status: 500 });
  }
}
