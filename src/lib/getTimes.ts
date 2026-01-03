type Translator = (key: string, values?: Record<string, string | number | Date>) => string

export function timeAgo(
  dateInput: string | Date | undefined | null,
  t: Translator
): string {
  if (!dateInput) return ''

  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return t('time.justNow')

  const intervals = [
    { seconds: 31536000, key: 'time.yearsAgo' },
    { seconds: 2592000, key: 'time.monthsAgo' },
    { seconds: 86400, key: 'time.daysAgo' },
    { seconds: 3600, key: 'time.hoursAgo' },
    { seconds: 60, key: 'time.minutesAgo' },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return t(interval.key, { count })
    }
  }

  return t('time.secondsAgo', { count: seconds })
}
