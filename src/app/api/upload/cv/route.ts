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

        const fileName = `CV-${Date.now()}-${file.name}`;

        // Convert File to ArrayBuffer for Supabase upload
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
            .from("cv_storage")
            .upload(fileName, fileBuffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;

        const { data: publicUrlData } = supabaseAdmin.storage
            .from("cv_storage")
            .getPublicUrl(data.path);

        return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Upload error:", msg);
        return NextResponse.json(
            { error: msg || "Upload failed" },
            { status: 500 }
        );
    }
}
