import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { translateObject } from "@/lib/translator";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";

    try {
        // Fetch stats config + translations
        const { data: statsData, error } = await supabase
            .from("statistics")
            .select(`
        *,
        statistic_translations!inner (
          label,
          description,
          suffix,
          language
        )
      `)
            .eq("statistic_translations.language", lang)
            .order('key'); // or add a separate order column

        if (error) throw error;

        const formattedStats = statsData.map(stat => ({
            id: stat.id,
            key: stat.key,
            count: stat.count_value,
            icon: stat.icon,
            color: stat.color,
            bgColorLight: stat.bg_color_light,
            bgColorDark: stat.bg_color_dark,
            suffix: stat.statistic_translations[0].suffix,
            label: stat.statistic_translations[0].label,
            description: stat.statistic_translations[0].description,
        }));

        return NextResponse.json({ data: formattedStats }, { status: 200 });
    } catch (err) {
        console.error("Error fetching stats:", err);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { id, language = 'en', statistic } = body

        if (!id || !statistic) {
            return NextResponse.json({ error: 'Missing id or statistic payload' }, { status: 400 })
        }

        const client = supabaseAdmin || supabase

        const { data: statUpdate, error: statErr } = await client
            .from('statistics')
            .update({
                count_value: statistic.count,
                icon: statistic.icon,
                color: statistic.color,
                bg_color_light: statistic.bgColorLight,
                bg_color_dark: statistic.bgColorDark,
            })
            .eq('id', id)

        if (statErr) throw statErr

        const finalTranslations = [{
            statistic_id: id,
            language: language,
            label: statistic.label,
            description: statistic.description,
            suffix: statistic.suffix,
        }];

        // Auto translate to the other language
        const targetLang = language === 'id' ? 'en' : 'id';
        const translated = await translateObject(
            { label: statistic.label, description: statistic.description, suffix: statistic.suffix },
            targetLang,
            language,
            ['label', 'description', 'suffix']
        );

        finalTranslations.push({
            statistic_id: id,
            language: targetLang,
            ...translated
        });

        const { error: transErr } = await client
            .from('statistic_translations')
            .upsert(finalTranslations, { onConflict: 'statistic_id, language' })

        if (transErr) throw transErr

        return NextResponse.json({ data: { statUpdate } }, { status: 200 })
    } catch (err) {
        console.error('Error updating stat:', err)
        return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 })
    }
}
