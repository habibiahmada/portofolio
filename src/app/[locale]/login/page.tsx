'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorDescription, setErrorDescription] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const { signIn, signInWithGoogle, signInWithGitHub, user, isAuthorized } = useAuth()
  const router = useRouter()
  const { resolvedTheme } = useTheme()

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
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGitHub()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub login failed')
      setLoading(false)
    }
  }


  return (
    <section className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className={`mt-6 text-3xl font-extrabold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Portfolio Access
          </h2>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-slate-400' : 'text-gray-600'
          }`}>
            This is a private portfolio. Access is restricted.
          </p>
        </div>

        <div className={`mt-8 rounded-xl shadow-2xl ${
          isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'
        }`}>
          <div className="px-8 py-10">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                  {error === 'oauth_error' && 'OAuth Error'}
                  {error === 'no_code' && 'No Authorization Code'}
                  {error === 'exchange_error' && 'Session Exchange Failed'}
                  {error === 'no_session' && 'Session Creation Failed'}
                  {error === 'unauthorized' && 'Access Denied'}
                  {error === 'callback_error' && 'Callback Error'}
                  {error === 'auth_callback_error' && 'Authentication Error'}
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
                <label htmlFor="email" className={`block text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    isDark ? 'border-slate-600' : 'border-gray-300'
                  }`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${
                    isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-gray-500'
                  }`}>
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full inline-flex justify-center py-3 px-4 border rounded-lg shadow-sm text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </button>

              <button
                onClick={handleGitHubLogin}
                disabled={loading}
                className={`w-full inline-flex justify-center py-3 px-4 border rounded-lg shadow-sm text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>


            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className={`text-sm ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                ← Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
