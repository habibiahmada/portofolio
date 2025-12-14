import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
