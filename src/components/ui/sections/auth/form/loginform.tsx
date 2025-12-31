import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

interface Props {
  email: string
  password: string
  loading: boolean
  isDark: boolean
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  const t = useTranslations('Login')

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label>{t('form.emailLabel')}</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t('form.emailPlaceholder')}
          required
        />
      </div>

      <div>
        <Label>{t('form.passwordLabel')}</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={t('form.passwordPlaceholder')}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('form.signingIn') : t('form.signIn')}
      </Button>
    </form>
  )
}
