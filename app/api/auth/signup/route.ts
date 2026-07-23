import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fail, serverError } from "@/lib/supabase/api-response";
import {
  checkRateLimit,
  getClientIp,
  isValidEmail,
  isStrongPassword,
  getPasswordStrengthFeedback,
  sanitizeInput,
} from "@/lib/security";

/**
 * POST /api/auth/signup
 *
 * Body: { email: string, password: string }
 *
 * Create a new admin user with email and password.
 * 
 * Security features:
 * - Rate limiting (3 attempts per hour per IP)
 * - Email validation
 * - Strong password enforcement
 * - Email authorization whitelist check
 * - Failed attempt logging
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    // Rate limiting for signup (stricter than login)
    if (!checkRateLimit(ip, 3, 60 * 60 * 1000)) {
      console.warn(`[AUTH] Signup rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        fail("Too many signup attempts. Please try again later.", "RATE_LIMIT_EXCEEDED"),
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
      return NextResponse.json(
        fail("Invalid email format.", "INVALID_EMAIL"),
        { status: 400 },
      );
    }

    // Check if email is in allowed admin list (whitelist for signup)
    const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!allowedEmails.includes(email)) {
      console.warn(`[AUTH] Signup attempt for non-whitelisted email: ${email} (IP: ${ip})`);
      return NextResponse.json(
        fail("This email address is not authorized for signup.", "EMAIL_NOT_AUTHORIZED"),
        { status: 403 },
      );
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      const feedback = getPasswordStrengthFeedback(password);
      return NextResponse.json(
        fail(feedback.join(". "), "WEAK_PASSWORD"),
        { status: 400 },
      );
    }

    const supabase = await getSupabaseServerClient();

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.warn(`[AUTH] Signup failed for email: ${email} (IP: ${ip}) - ${error.message}`);
      
      // Check if user already exists
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          fail("This account already exists.", "USER_EXISTS"),
          { status: 409 },
        );
      }

      return NextResponse.json(
        fail("Failed to create account.", "SIGNUP_ERROR"),
        { status: 400 },
      );
    }

    console.log(`[AUTH] New admin user created: ${email} (IP: ${ip})`);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: data.user,
          message: "Account created successfully. You can now login.",
        },
        error: null,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      },
    );
  } catch (err: any) {
    console.error(`[AUTH] Server error during signup from IP: ${ip} -`, err.message);
    return NextResponse.json(serverError("An error occurred during signup."), { status: 500 });
  }
}
