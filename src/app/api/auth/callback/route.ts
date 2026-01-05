import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/en/dashboard'
  if (!next.startsWith('/')) {
    next = '/en/dashboard'
  }

  // Extract locale from next parameter (e.g., /id/dashboard -> id)
  const localeMatch = next.match(/^\/([a-z]{2})\//)
  const locale = localeMatch ? localeMatch[1] : 'en'
  const loginUrl = `/${locale}/login`
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('x-forwarded-host')}`

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(`${siteUrl}${loginUrl}?error=oauth_error&description=${encodeURIComponent(errorDescription || error)}`)
  }

  // Handle missing code
  if (!code) {
    return NextResponse.redirect(`${siteUrl}${loginUrl}?error=no_code`)
  }

  try {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(`${siteUrl}${loginUrl}?error=exchange_error&description=${encodeURIComponent(exchangeError.message)}`)
    }

    if (!data.session) {
      return NextResponse.redirect(`${siteUrl}${loginUrl}?error=no_session`)
    }

    // Check if user email is authorized
    const user = data.session.user
    const authorizedEmail = process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL

    if (!authorizedEmail || user.email?.toLowerCase() !== authorizedEmail.toLowerCase()) {
      console.warn(`Unauthorized login attempt: ${user.email}`)
      await supabase.auth.signOut()
      return NextResponse.redirect(`${siteUrl}${loginUrl}?error=unauthorized`)
    }

    // Success - redirect to dashboard
    return NextResponse.redirect(`${siteUrl}${next}`)

  } catch (err) {
    return NextResponse.redirect(`${siteUrl}${loginUrl}?error=callback_error&description=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown error')}`)
  }
}