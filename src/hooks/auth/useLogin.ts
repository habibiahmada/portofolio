'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorDescription, setErrorDescription] = useState('')
  const [mounted, setMounted] = useState(false)

  const { signIn, signInWithGoogle, signInWithGitHub, user, isAuthorized } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Login')

  useEffect(() => {
    setMounted(true)

    const params = new URLSearchParams(window.location.search)
    const urlError = params.get('error')
    const urlDescription = params.get('description')

    if (urlError) {
      setError(urlError)
      if (urlDescription) {
        setErrorDescription(decodeURIComponent(urlDescription))
      }
    }
  }, [])

  useEffect(() => {
    if (user && isAuthorized) {
      router.push('/dashboard')
    }
  }, [user, isAuthorized, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle(locale)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.googleFailed'))
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGitHub(locale)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.githubFailed'))
      setLoading(false)
    }
  }

  return {
    email,
    password,
    loading,
    error,
    errorDescription,
    mounted,
    setEmail,
    setPassword,
    handleEmailLogin,
    handleGoogleLogin,
    handleGitHubLogin,
  }
}
