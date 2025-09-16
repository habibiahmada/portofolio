import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: data["error-codes"] });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
