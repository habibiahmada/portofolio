import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/sitemap-') ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  // Handle root redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, req.url))
  }

  // Extract locale from pathname
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = routing.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url))
  }

  // Skip middleware if environment variables are not set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not set, skipping auth middleware')
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options?: Record<string, unknown>) {
          req.cookies.set({
            name,
            value,
            ...(options ?? {}),
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({ name, value, ...(options ?? {}) })
        },
        remove(name: string, options?: Record<string, unknown>) {
          req.cookies.set({
            name,
            value: '',
            ...(options ?? {}),
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({ name, value: '', ...(options ?? {}) })
        },
      },
    }
  )

  // Get validated user and (optionally) current session
  const [{ data: { user } }] = await Promise.all([
    supabase.auth.getUser(),
  ])

  // List of authorized emails (add your email here)
  const authorizedEmails = [
    process.env.AUTHORIZED_EMAIL,
  ]

  // Check if user is authorized
  const isAuthorized = user?.email && authorizedEmails.includes(user.email)

  // Extract locale from pathname
  const pathSegments = pathname.split('/')
  const locale = pathSegments[1] || routing.defaultLocale

  // Protected routes (with locale)
  const protectedRoutes = [`/${locale}/dashboard`]
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Login route (with locale)
  const loginRoute = `/${locale}/login`
  const isLoginRoute = pathname === loginRoute

  // If accessing protected route without authorization
  if (isProtectedRoute && (!user || !isAuthorized)) {
    return NextResponse.redirect(new URL(loginRoute, req.url))
  }

  // If accessing login page while already authorized, redirect to dashboard
  if (isLoginRoute && user && isAuthorized) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
  }

  // Let unauthorized users access login page normally
  // The callback will handle validation for OAuth, AuthContext handles password login

  return response
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-.*\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}