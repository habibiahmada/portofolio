import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    const { data, error } = await supabase
      .from("certifications")
      .select(`
        id,
        issuer,
        year,
        preview,
        created_at,
        certification_translations (
          title,
          description,
          skills,
          language
        )
      `);

    if (error) {
      console.error("Certificate query error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Filter by language in response
    const filtered = (data ?? []).filter((cert: { certification_translations?: { language: string }[] }) =>
      cert.certification_translations?.some((t: { language: string }) => t.language === lang)
    );

    return NextResponse.json(
      { data: filtered },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error("GET /certificates error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

