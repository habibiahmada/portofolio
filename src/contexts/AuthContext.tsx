'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  isAuthorizedUser,
  getUserDisplayName,
} from '@/lib/auth'
import type { AuthUser, AuthState } from '@/lib/auth'
import type { Session } from '@supabase/supabase-js'

const supabase = createClient()

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: (lang?: string) => Promise<void>
  signInWithGitHub: (lang?: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthorized: boolean
  userDisplayName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Single source of truth
  const syncAuthState = async () => {
    const [{ data: userData }, { data: sessionData }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.auth.getSession(),
    ])

    const validatedUser = userData.user as AuthUser | null

    // Auto sign-out unauthorized users (after OAuth callback)
    if (validatedUser && !isAuthorizedUser(validatedUser)) {
      console.warn(`User ${validatedUser.email} is not authorized. Signing out automatically.`)
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setLoading(false)
      return
    }

    setUser(validatedUser)
    setSession(sessionData.session)
    setLoading(false)
  }

  useEffect(() => {
    syncAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncAuthState()
    })

    return () => subscription.unsubscribe()
  }, [])

  // Auth actions
  const signIn = async (email: string, password: string) => {
    // Check if email is authorized before attempting login
    const authorizedEmail = process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL
    if (authorizedEmail && email.toLowerCase() !== authorizedEmail.toLowerCase()) {
      throw new Error('Email tidak diizinkan untuk login')
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)
  }

  const signInWithGoogle = async (lang = 'en') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${lang}/dashboard`,
        queryParams: { flowType: 'pkce' },
      },
    })

    if (error) throw new Error(error.message)
  }

  const signInWithGitHub = async (lang = 'en') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${lang}/dashboard`,
        queryParams: { flowType: 'pkce' },
      },
    })

    if (error) throw new Error(error.message)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    isAuthorized: isAuthorizedUser(user),
    userDisplayName: getUserDisplayName(user),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}