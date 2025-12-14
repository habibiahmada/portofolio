import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { data },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, logo } = body

    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

    const client = supabaseAdmin || supabase

    const { data, error } = await client
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

    const client = supabaseAdmin || supabase

    const { data, error } = await client
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
