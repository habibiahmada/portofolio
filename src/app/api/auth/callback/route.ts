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
    // if "next" is not a relative URL, use the default
    next = '/en/dashboard'
  }

  // Handle OAuth errors and missing code
  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/login?error=oauth_error&description=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/login?error=no_code`)
  }

  try {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !data.session) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/login?error=exchange_error`)
    }

    const user = data.session.user
    const authorizedEmails = [process.env.AUTHORIZED_EMAIL]

    if (!authorizedEmails.includes(user.email!)) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/login?error=unauthorized`)
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('x-forwarded-host')}`
    return NextResponse.redirect(`${siteUrl}${next}`)

  } catch (err) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/login?error=callback_error&description=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown error')}`)
  }
}