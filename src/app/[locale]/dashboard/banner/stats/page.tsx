'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, CheckCircle, Clock, LucideIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale, useTranslations } from 'next-intl'

const IconList: LucideIcon[] = [Users, CheckCircle, Clock]

const gradientColors = [
  'from-indigo-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-yellow-500 to-amber-500',
]

const bgOverlayLight = [
  'from-indigo-50 to-white',
  'from-emerald-50 to-white',
  'from-rose-50 to-white',
  'from-yellow-50 to-white',
]

const bgOverlayDark = [
  'from-indigo-900 to-slate-950',
  'from-emerald-900 to-slate-950',
  'from-rose-900 to-slate-950',
  'from-yellow-900 to-slate-950',
]

interface StatItem {
  id: number
  key: string
  count: number
  suffix?: string
  label?: string
  description?: string
  containerClass?: string
  labelClass?: string
  countClass?: string
}

export default function StatsAdminPage() {
  const locale = useLocale()
  const t = useTranslations('stats')
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const res = await fetch(`/api/stats?lang=${locale}`)
      const json = await res.json()
      setStats(json.data || [])
    } catch {
      toast.error(t('loadError'))
    } finally {
      setLoading(false)
    }
  }

  function updateField<T extends keyof StatItem>(
    index: number,
    field: T,
    value: StatItem[T]
  ) {
    setStats(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  async function saveStat(index: number) {
    const stat = stats[index]
    if (!stat?.id) {
      toast.error(t('invalidStatisticId'))
      return
    }

    const toastId = toast.loading(t('saving'))

    try {
      const res = await fetch('/api/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stat.id,
          language: locale,
          statistic: {
            count: stat.count,
            suffix: stat.suffix,
            label: stat.label,
            description: stat.description,
            containerClass: stat.containerClass,
            labelClass: stat.labelClass,
            countClass: stat.countClass,
          },
        }),
      })

      if (!res.ok) throw new Error()

      toast.success(t('saveSuccess'), { id: toastId })
      fetchStats()
    } catch {
      toast.error(t('saveFailed'), { id: toastId })
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card px-4 py-2 rounded-md shadow">
            {t('loadingOverlay')}
          </div>
        </div>
      )}

      <header className="bg-card border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">{t('headerTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('headerSubtitle')}</p>
      </header>

      <div className="space-y-6">
        {stats.map((s, i) => {
          const Icon = IconList[i % IconList.length]
          const overlay = isDark
            ? bgOverlayDark[i % bgOverlayDark.length]
            : bgOverlayLight[i % bgOverlayLight.length]

          return (
            <Card key={s.id} className="rounded-xl">
              <CardContent className="p-6 grid lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t('editStatistic', { key: s.key })}</h3>

                  <Input
                    placeholder={t('placeholders.label')}
                    value={s.label || ''}
                    onChange={e =>
                      updateField(i, 'label', e.target.value)
                    }
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder={t('placeholders.count')}
                      value={s.count}
                      onChange={e =>
                        updateField(i, 'count', Number(e.target.value))
                      }
                    />
                    <Input
                      placeholder={t('placeholders.suffix')}
                      value={s.suffix || ''}
                      onChange={e =>
                        updateField(i, 'suffix', e.target.value)
                      }
                    />
                  </div>

                  <Input
                    placeholder={t('placeholders.description')}
                    value={s.description || ''}
                    onChange={e =>
                      updateField(i, 'description', e.target.value)
                    }
                  />

                  <Button onClick={() => saveStat(i)}>{t('button.saveChanges')}</Button>
                </div>

                {/* Preview */}
                <div className="flex justify-center items-center">
                  <div className="relative w-full max-w-xs p-6 rounded-lg border overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${overlay} opacity-80`}
                    />
                    <div className="relative z-10">
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradientColors[i % gradientColors.length]} text-white mb-4`}
                      >
                        <Icon size={24} />
                      </div>

                      <p className="text-sm text-muted-foreground">{s.label || t('preview.defaultLabel')}</p>

                      <div className="text-3xl font-bold">
                        {s.count.toLocaleString()}
                        {s.suffix}
                      </div>

                      {s.description && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}