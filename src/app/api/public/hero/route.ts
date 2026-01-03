import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    try {
        const { data: heroData, error } = await supabase
            .from("hero_sections")
            .select(`
    *,
    hero_section_translations!inner(
        greeting,
        description,
        typewriter_texts,
        developer_tag,
        console_tag,
        language
    )
        `)
            .eq("hero_section_translations.language", lang)
            .limit(1)
            .maybeSingle() as unknown as { data: { hero_section_translations: Array<{ language: string, greeting: string, description: string, typewriter_texts: string[], developer_tag: string, console_tag: string }>, image_url: string, cv_url: string } | null, error: unknown };

        if (error) throw error;

        if (!heroData) {
            return NextResponse.json({ data: null }, { status: 200 });
        }

        // Flatten the structure for easier consumption
        const result = {
            image_url: heroData.image_url,
            cv_url: heroData.cv_url,
            greeting: heroData.hero_section_translations[0].greeting,
            description: heroData.hero_section_translations[0].description,
            typewriter_texts: heroData.hero_section_translations[0].typewriter_texts,
            developer_tag: heroData.hero_section_translations[0].developer_tag,
            console_tag: heroData.hero_section_translations[0].console_tag,
        };

        return NextResponse.json({ data: result }, { status: 200 });
    } catch (err) {
        console.error("Error fetching hero data:", err);
        return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
    }
}