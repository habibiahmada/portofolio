import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json(
      { error: "Missing tool id" },
      { status: 400 }
    )
  }

  const body = await req.json()
  const { name, key, color } = body

  const client = supabaseAdmin

  const { error } = await client
    .from("tools_logo")
    .update({ name, key, color })
    .eq("id", id)

  if (error) throw error

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json(
      { error: "Missing tool id" },
      { status: 400 }
    )
  }

  const client = supabaseAdmin

  const { error } = await client
    .from("tools_logo")
    .delete()
    .eq("id", id)

  if (error) throw error

  return NextResponse.json({ success: true })
}
