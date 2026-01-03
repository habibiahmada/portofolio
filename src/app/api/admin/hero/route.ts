import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { translateObject } from "@/lib/translator";


export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    if (!supabaseAdmin) {
        return NextResponse.json({ error: "Server misconfiguration: Missing Service Role Key" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { greeting, description, typewriter_texts, developer_tag, console_tag, image_url, cv_url } = body;

        const { data: mainHero, error: mainError } = await supabaseAdmin
            .from("hero_sections")
            .select("id")
            .limit(1)
            .maybeSingle();

        if (mainError) throw mainError;

        let heroId = mainHero?.id;

        if (!heroId) {
            const { data: newHero, error: createError } = await supabaseAdmin
                .from("hero_sections")
                .insert({ image_url, cv_url })
                .select("id")
                .single();
            if (createError) throw createError;
            heroId = newHero.id;
        } else {
            if (image_url || cv_url) {
                const updates: Record<string, string> = {};
                if (image_url) updates.image_url = image_url;
                if (cv_url) updates.cv_url = cv_url;

                await supabaseAdmin.from("hero_sections").update(updates).eq("id", heroId);
            }
        }

        const finalTranslations = [{
            hero_section_id: heroId,
            language: lang,
            greeting,
            description,
            typewriter_texts,
            developer_tag,
            console_tag
        }];

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
