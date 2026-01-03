import { supabaseAdmin } from "@/lib/supabase/admin"
import { translateObject } from "@/lib/translator"
import { NextResponse } from "next/server"


export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { id, language = 'en', statistic } = body

        if (!id || !statistic) {
            return NextResponse.json({ error: 'Missing id or statistic payload' }, { status: 400 })
        }

        const client = supabaseAdmin

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
