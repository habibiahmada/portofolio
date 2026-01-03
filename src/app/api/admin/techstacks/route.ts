import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

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

    const client = supabaseAdmin

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