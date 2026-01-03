import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, logo } = body

    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('companies')
      .insert([{ name, logo }])
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('Error creating company:', err)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, name, logo } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('companies')
      .update({ name, logo })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('Error updating company:', err)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}
