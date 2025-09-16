import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
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
    'habibiahmadaziz@gmail.com',
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

  // If accessing login page while already authorized
  if (isLoginRoute && user && isAuthorized) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
  }

  // If accessing login page but not authorized (wrong device/email)
  if (isLoginRoute && user && !isAuthorized) {
    // Sign out the unauthorized user
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}