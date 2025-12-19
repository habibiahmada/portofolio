import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { translateObject } from "@/lib/translator";

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

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    // Use admin client for writes to bypass RLS
    if (!supabaseAdmin) {
        return NextResponse.json({ error: "Server misconfiguration: Missing Service Role Key" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { greeting, description, typewriter_texts, developer_tag, console_tag, image_url, cv_url } = body;

        // 1. Update/Upsert Hero Section (Main table) - ignoring lang for shared fields if any
        // For now we assume one main hero section exists.
        // We need the ID.
        const { data: mainHero, error: mainError } = await supabaseAdmin
            .from("hero_sections")
            .select("id")
            .limit(1)
            .maybeSingle();

        if (mainError) throw mainError;

        let heroId = mainHero?.id;

        if (!heroId) {
            // Create if doesn't exist
            const { data: newHero, error: createError } = await supabaseAdmin
                .from("hero_sections")
                .insert({ image_url, cv_url })
                .select("id")
                .single();
            if (createError) throw createError;
            heroId = newHero.id;
        } else {
            // Update main fields if provided
            if (image_url || cv_url) {
                const updates: Record<string, string> = {};
                if (image_url) updates.image_url = image_url;
                if (cv_url) updates.cv_url = cv_url;

                await supabaseAdmin.from("hero_sections").update(updates).eq("id", heroId);
            }
        }

        // 2. Update/Upsert Translations
        const finalTranslations = [{
            hero_section_id: heroId,
            language: lang,
            greeting,
            description,
            typewriter_texts,
            developer_tag,
            console_tag
        }];

        // Auto translate to the other language
        const targetLang = lang === "id" ? "en" : "id";
        const translated = await translateObject(
            { greeting, description, typewriter_texts, developer_tag, console_tag },
            targetLang,
            lang,
            ["greeting", "description", "typewriter_texts", "developer_tag", "console_tag"]
        );

        finalTranslations.push({
            hero_section_id: heroId,
            language: targetLang,
            ...translated
        });

        const { error: transError } = await supabaseAdmin
            .from("hero_section_translations")
            .upsert(finalTranslations, { onConflict: 'hero_section_id, language' });

        if (transError) throw transError;

        return NextResponse.json({ message: "Hero section updated successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error updating hero:", err);
        return NextResponse.json({ error: "Failed to update hero data" }, { status: 500 });
    }
}
