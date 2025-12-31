import { useTranslations } from 'next-intl'

const ERROR_KEYS = [
  'oauth_error',
  'no_code',
  'exchange_error',
  'no_session',
  'unauthorized',
  'callback_error',
  'auth_callback_error',
]

export function LoginError({
  error,
  description,
}: {
  error: string
  description?: string
}) {
  const t = useTranslations('Login')

  if (!error) return null

  return (
    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        {ERROR_KEYS.includes(error) ? t(`errors.${error}`) : error}
      </p>
      {description && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
          {description}
        </p>
      )}
    </div>
  )
}
