import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

/**
 * GET tools (public / client-safe)
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tools_logo")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error("Error fetching tools:", err)
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    )
  }
}
