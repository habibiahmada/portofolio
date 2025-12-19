'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { Github, Chrome } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorDescription, setErrorDescription] = useState('')
  const [mounted, setMounted] = useState(false)

  const { signIn, signInWithGoogle, signInWithGitHub, user, isAuthorized } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const t = useTranslations('Login')

  useEffect(() => {
    setMounted(true)

    // Check for URL error parameters
    const urlParams = new URLSearchParams(window.location.search)
    const urlError = urlParams.get('error')
    const urlDescription = urlParams.get('description')

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

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      router.push('/dashboard')
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


  return (
    <section className={`min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>

      <div className="absolute top-10 right-10 w-32 h-32 border border-blue-300 dark:border-blue-700 rounded-lg rotate-12 opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-cyan-300 dark:border-cyan-700 rounded-full opacity-30 pointer-events-none"></div>
      <div className="absolute top-20 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg opacity-20 rotate-45 pointer-events-none"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight block bg-gradient-to-r
              from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-5">
            {t('title')}
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>
            {t('description')}
          </p>
        </div>

        <div className={`mt-8 rounded-xl shadow-2xl ${isDark ? 'bg-slate-950 border border-slate-700' : 'bg-white'
          }`}>
          <div className="px-8 py-10">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                  {error === 'oauth_error' && t('errors.oauth_error')}
                  {error === 'no_code' && t('errors.no_code')}
                  {error === 'exchange_error' && t('errors.exchange_error')}
                  {error === 'no_session' && t('errors.no_session')}
                  {error === 'unauthorized' && t('errors.unauthorized')}
                  {error === 'callback_error' && t('errors.callback_error')}
                  {error === 'auth_callback_error' && t('errors.auth_callback_error')}
                  {!['oauth_error', 'no_code', 'exchange_error', 'no_session', 'unauthorized', 'callback_error', 'auth_callback_error'].includes(error) && error}
                </p>
                {errorDescription && (
                  <p className="text-xs text-red-500 dark:text-red-400">{errorDescription}</p>
                )}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                  {t('form.emailLabel')}
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                  {t('form.passwordLabel')}
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-12 py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    placeholder={t('form.passwordPlaceholder')}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t('form.signingIn') : t('form.signIn')}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-slate-600' : 'border-gray-300'
                    }`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-white text-gray-500'
                    }`}>
                    {t('divider')}
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full inline-flex justify-center py-3 px-4 border rounded-lg shadow-sm text-sm font-medium transition-colors ${isDark
                  ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </Button>

              <Button
                onClick={handleGitHubLogin}
                disabled={loading}
                className={`w-full inline-flex justify-center py-3 px-4 border rounded-lg shadow-sm text-sm font-medium transition-colors ${isDark
                  ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>


            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href={`/${locale}`}
                className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
              >
                {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 opacity-[1] pointer-events-none bg-[size:40px_40px]
          bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)]
          dark:bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
          [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
    </section>
  )
}
