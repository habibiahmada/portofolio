import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

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

/**
 * CREATE tool (admin)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, key, color } = body

    if (!name || !key || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const client = supabaseAdmin || supabase

    const { error } = await client
      .from("tools_logo")
      .insert([{ name, key, color }])

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error("Error creating tool:", err)
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    )
  }
}