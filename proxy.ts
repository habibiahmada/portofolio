import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy — Supabase Auth Session Refresh + Admin Route Protection
 *
 * Replaces the old middleware.ts convention. This runs at the network boundary
 * and handles:
 * 1. Refreshing Supabase auth session cookies on every request
 * 2. Protecting /admin routes — redirects unauthenticated users to /login
 * 3. Checking if the authenticated email matches the allowed admin email (from env)
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do NOT add logic between createServerClient and getUser().
  // getUser() refreshes the session if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Protect /admin routes ──
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Check against the allowed admin email from environment variable
    const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = (user.email ?? "").toLowerCase();

    if (!allowedEmails.includes(userEmail)) {
      // Not an authorized admin — sign out and redirect
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }
  }

  // ── If user is already logged in and visits /login, redirect to /admin ──
  if (pathname === "/login" && user) {
    const redirect = request.nextUrl.searchParams.get("redirect") || "/admin";
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    url.searchParams.delete("redirect");
    url.searchParams.delete("error");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|images/|open-graph/|data/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
