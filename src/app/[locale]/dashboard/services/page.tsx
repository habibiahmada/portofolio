'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLocale } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/ui/sections/admin/dashboardheader'
import { DynamicIcon } from '@/components/ui/dynamicIcon'
import Image from 'next/image'

export default function ServicesPage() {
  const locale = useLocale()
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchServices() {
    setLoading(true)
    try {
      const res = await fetch(`/api/services?lang=${locale}`)
      const json = await res.json()
      setServices(json.data || [])
    } catch {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    fetchServices()
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Services"
        description="Manage services"
        actionLabel="New Service"
        onClick={() => router.push('/dashboard/services/new')}
        actionIcon={<Plus className="w-4 h-4" />}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl border animate-pulse" />
        ))}

        {services.map(s => {
          const icon = s.icon
          const isImg = /^https?:\/\//.test(icon || '')

          return (
            <Card key={s.id}>
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r ${s.color}`}>
                  {isImg ? (
                    <Image src={icon} alt="" fill />
                  ) : (
                    <DynamicIcon name={icon} className="w-6 h-6 text-white" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {s.service_translations?.[0]?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {s.service_translations?.[0]?.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/services/${s.id}/edit`)}
                    className="flex-1 gap-2"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}