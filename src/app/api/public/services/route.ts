import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

type Translation = {
  language?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  [k: string]: unknown;
};

/* ========================= GET =========================
   GET /api/services?lang=en
========================================================= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "en";

  const { data, error } = await supabase
    .from("services")
    .select(
      `
        id,
        icon,
        color,
        service_translations (
          language,
          title,
          description,
          bullets
        )
      `
    );

  const filteredData = (data as unknown as { service_translations: Translation[] }[] || []).map((service) => ({
    ...service,
    service_translations: (service.service_translations || []).filter(
      (t) => t.language === lang
    )
  }));

  return NextResponse.json(
    { data: filteredData, error },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
