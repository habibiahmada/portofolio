import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

/**
 * GET tools (public / client-safe)
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tools_logo")
      .select("id, name, key, color, created_at")
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error("Error fetching tools:", err)
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    )
  }
}
