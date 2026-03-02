import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

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
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}