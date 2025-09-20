'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { onAuthStateChange, isAuthorizedUser, getUserDisplayName } from '@/lib/auth'
import type { AuthUser, AuthState } from '@/lib/auth'
import type { Session } from '@supabase/supabase-js'

const supabase = createClient()

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
  isAuthorized: boolean
  userDisplayName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Get validated user from Supabase Auth server
        const { data: { user } } = await supabase.auth.getUser()
        setUser((user as AuthUser) || null)
        // Optionally keep session state for tokens, but do not trust session.user
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    try {
      const { data: { subscription } } = onAuthStateChange(async (event) => {
        try {
          if (event === 'SIGNED_OUT') {
            setUser(null)
            setSession(null)
          } else {
            // For SIGNED_IN, TOKEN_REFRESHED, etc., fetch validated user
            const [{ data: { user } }, { data: { session } }] = await Promise.all([
              supabase.auth.getUser(),
              supabase.auth.getSession(),
            ])
            setUser((user as AuthUser) || null)
            setSession(session)
          }
        } finally {
          setLoading(false)
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user && !isAuthorizedUser(data.user as AuthUser)) {
        await supabase.auth.signOut()
        throw new Error('Access denied. This portfolio is private.')
      }

      // Update state immediately after successful login
      setUser(data.user as AuthUser)
      setSession(data.session)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/en/dashboard`,
        queryParams: {
          flowType: 'pkce',
        },
      }
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/en/dashboard`,
        queryParams: {
          flowType: 'pkce',
        },
      }
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      // Clear local state immediately
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const isAuthorized = isAuthorizedUser(user)
  const userDisplayName = getUserDisplayName(user)

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    isAuthorized,
    userDisplayName,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
