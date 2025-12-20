import { createClient } from '@/utils/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

const supabase = createClient()

export interface AuthUser extends User {
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Sign in with Google
export async function signInWithGoogle(lang: string = 'en') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/${lang}/dashboard`,
      queryParams: {
        flowType: 'pkce',
      },
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Sign in with GitHub
export async function signInWithGitHub(lang: string = 'en') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/${lang}/dashboard`,
      queryParams: {
        flowType: 'pkce',
      },
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return user
}

// Get current session
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return session
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

// Check if user is authorized (only your devices)
export function isAuthorizedUser(user: AuthUser | null): boolean {
  if (!user) return false

  // List of authorized emails (add your email here)
  const authorizedEmails = [
    process.env.AUTHORIZED_EMAIL,
  ]

  return authorizedEmails.includes(user.email || '')
}

// Get user display name
export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return 'Unknown User'

  return user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Unknown User'
}
