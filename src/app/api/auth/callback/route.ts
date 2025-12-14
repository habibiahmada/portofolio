import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/en/dashboard'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/en/dashboard'
  }

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(`${origin}/en/login?error=oauth_error&description=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/en/login?error=no_code`)
  }

  try {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      return NextResponse.redirect(`${origin}/en/login?error=exchange_error&description=${encodeURIComponent(exchangeError.message)}`)
    }

    if (!data.session) {
      return NextResponse.redirect(`${origin}/en/login?error=no_session&description=Failed to create session`)
    }

    // Check if user is authorized (only your devices)
    const authorizedEmails = ['habibiahmadaziz@gmail.com']
    const isAuthorized = data.user?.email && authorizedEmails.includes(data.user.email)
    
    if (!isAuthorized) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/en/login?error=unauthorized`)
    }

    // Redirect to the intended page
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
    const publicSite = process.env.NEXT_PUBLIC_SITE_URL
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Prefer an explicit public URL from environment in production
    // Fallback to forwarded host (proxy) + proto, otherwise fall back to origin
    const base = publicSite
      ? publicSite.replace(/\/$/, '')
      : forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : origin

    return NextResponse.redirect(`${base}${next}`)
    
  } catch (err) {
    return NextResponse.redirect(`${origin}/en/login?error=callback_error&description=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown error')}`)
  }
}