import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fail, serverError } from "@/lib/supabase/api-response";
import {
  checkRateLimit,
  getClientIp,
  isValidEmail,
  sanitizeInput,
} from "@/lib/security";

/**
 * POST /api/auth/email-password
 *
 * Body: { email: string, password: string }
 *
 * Sign in with email and password using Supabase auth.
 * 
 * Security features:
 * - Rate limiting (5 attempts per 15 minutes per IP)
 * - Input validation & sanitization
 * - Generic error messages (no info leakage)
 * - Email authorization check
 * - Failed attempt logging
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    // Rate limiting check
    if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) {
      console.warn(`[AUTH] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        fail("Too many login attempts. Please try again later.", "RATE_LIMIT_EXCEEDED"),
        { status: 429 },
      );
    }

    // Parse and validate input
    let email: string;
    let password: string;

    try {
      const body = await request.json();
      email = sanitizeInput(body.email || "").toLowerCase();
      password = body.password || "";
    } catch {
      console.warn(`[AUTH] Invalid JSON from IP: ${ip}`);
      return NextResponse.json(
        fail("Invalid request format.", "INVALID_REQUEST"),
        { status: 400 },
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.warn(`[AUTH] Invalid email format from IP: ${ip}`);
      return NextResponse.json(
        fail("Invalid email or password.", "INVALID_CREDENTIALS"),
        { status: 401 },
      );
    }

    // Check password is provided (don't validate strength for login, only for signup)
    if (!password || password.length === 0) {
      console.warn(`[AUTH] Missing password from IP: ${ip}`);
      return NextResponse.json(
        fail("Invalid email or password.", "INVALID_CREDENTIALS"),
        { status: 401 },
      );
    }

    // Maximum password length
    if (password.length > 512) {
      console.warn(`[AUTH] Suspiciously long password from IP: ${ip}`);
      return NextResponse.json(
        fail("Invalid email or password.", "INVALID_CREDENTIALS"),
        { status: 401 },
      );
    }

    const supabase = await getSupabaseServerClient();

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn(`[AUTH] Login failed for email: ${email} (IP: ${ip}) - ${error.message}`);
      // Generic error message to prevent email enumeration
      return NextResponse.json(
        fail("Invalid email or password.", "INVALID_CREDENTIALS"),
        { status: 401 },
      );
    }

    // Check if email is in allowed admin list
    const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!allowedEmails.includes(email)) {
      // Not allowed — sign out immediately
      await supabase.auth.signOut();
      console.warn(`[AUTH] Unauthorized login attempt for email: ${email} (IP: ${ip})`);
      return NextResponse.json(
        fail("Access denied. This account is not authorized.", "ACCESS_DENIED"),
        { status: 403 },
      );
    }

    console.log(`[AUTH] Successful login for: ${email} (IP: ${ip})`);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
        error: null,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      },
    );
  } catch (err: any) {
    console.error(`[AUTH] Server error from IP: ${ip} -`, err.message);
    return NextResponse.json(serverError("An error occurred during login."), { status: 500 });
  }
}