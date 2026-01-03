import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

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
        *,
        service_translations (
          *
        )
      `
    );

  const filteredData = (data as unknown as { service_translations: Translation[] }[] || []).map((service) => ({
    ...service,
    service_translations: (service.service_translations || []).filter(
      (t) => t.language === lang
    )
  }));

  return NextResponse.json({ data: filteredData, error });
}
