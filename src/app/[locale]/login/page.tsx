'use client'

import { useTheme } from 'next-themes'
import { FloatingShapes } from '@/components/ui/decorativeelement'
import { useLogin } from '@/hooks/auth/useLogin'
import { LoginHeader } from '@/components/ui/sections/auth/login/loginheader'
import { LoginForm } from '@/components/ui/sections/auth/form/loginform'
import { OAuthButtons } from '@/components/ui/sections/auth/login/oauthbutton'
import { LoginError } from '@/components/ui/sections/auth/login/loginerror'

export default function LoginPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const {
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
  } = useLogin()

  if (!mounted) return null

  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="max-w-md w-full space-y-8 z-10">
        <LoginHeader isDark={isDark} />
        <div className="rounded-xl shadow-2xl p-8">
          <LoginError error={error} description={errorDescription} />
          <LoginForm
            email={email}
            password={password}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleEmailLogin}
          />
          <OAuthButtons
            loading={loading}
            isDark={isDark}
            onGoogle={handleGoogleLogin}
            onGitHub={handleGitHubLogin}
          />
        </div>
      </div>
      <FloatingShapes isDark={isDark} />
    </section>
  )
}
