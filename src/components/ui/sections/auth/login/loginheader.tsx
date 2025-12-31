import { useTranslations } from 'next-intl'

export function LoginHeader({ isDark }: { isDark: boolean }) {
  const t = useTranslations('Login')

  return (
    <div className="text-center">
      <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-5">
        {t('title')}
      </h2>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
        {t('description')}
      </p>
    </div>
  )
}
