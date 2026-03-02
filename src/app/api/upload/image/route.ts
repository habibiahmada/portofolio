import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { optimizeImage, getOptimizedFileName, getContentType } from "@/lib/image-optimizer";

export const dynamic = "force-dynamic";

const BUCKET = 'projects image';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Optimize image
    const optimizedBuffer = await optimizeImage(fileBuffer, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 80,
      format: 'webp',
    });

    // Generate optimized filename
    const fileName = getOptimizedFileName(file.name, 'webp');
    const contentType = getContentType('webp');

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, optimizedBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Image upload error:', msg);
    return NextResponse.json({ error: msg || 'Upload failed' }, { status: 500 });
  }
}
