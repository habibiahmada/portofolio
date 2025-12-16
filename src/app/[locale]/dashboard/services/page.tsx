'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLocale } from 'next-intl'
import { loadLucideIcons } from '@/lib/lucide-cache'
import { DynamicIcon } from '@/components/ui/dynamicIcon'
import { Plus, X, Search, Eye, EyeOff, Trash2, Edit3, Save, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import DashboardHeader from '@/components/ui/sections/admin/dashboardheader'

interface ServiceItem {
  id: string
  key?: string
  icon?: string
  color?: string
  order?: number
  service_translations?: {
    title?: string
    description?: string
    bullets?: string[]
  }[]
}

interface ServiceForm {
  key: string
  icon: string
  color: string
  order: number | ''
  title: string
  description: string
  bullets: string[]
  file: File | null
}

const emptyForm: ServiceForm = {
  key: '',
  icon: '',
  color: '',
  order: '',
  title: '',
  description: '',
  bullets: [''],
  file: null,
}

const colorOptions = [
  { name: 'Indigo Blue', class: 'from-indigo-500 to-blue-500', bg: 'bg-gradient-to-r from-indigo-500 to-blue-500' },
  { name: 'Emerald Teal', class: 'from-emerald-500 to-teal-500', bg: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  { name: 'Rose Pink', class: 'from-rose-500 to-pink-500', bg: 'bg-gradient-to-r from-rose-500 to-pink-500' },
  { name: 'Amber Orange', class: 'from-amber-500 to-orange-500', bg: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  { name: 'Purple Fuchsia', class: 'from-purple-500 to-fuchsia-500', bg: 'bg-gradient-to-r from-purple-500 to-fuchsia-500' },
  { name: 'Cyan Sky', class: 'from-cyan-500 to-sky-500', bg: 'bg-gradient-to-r from-cyan-500 to-sky-500' },
]

export default function Page() {
  const locale = useLocale()

  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [form, setForm] = useState<ServiceForm>(emptyForm)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [showPreview, setShowPreview] = useState(false)

  const [icons, setIcons] = useState<string[]>([])
  const [iconSearch, setIconSearch] = useState('')
  const [showIconPicker, setShowIconPicker] = useState(false)

  const fetchServices = useCallback(async () => {
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
  }, [locale])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    loadLucideIcons().then(icons => {
      setIcons(
        Object.keys(icons)
          .filter(k => /^[A-Z]/.test(k))
          .sort()
      )
    })
  }, [])

  function updateForm<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addBullet() {
    setForm(prev => ({ ...prev, bullets: [...prev.bullets, ''] }))
  }

  function updateBullet(idx: number, value: string) {
    setForm(prev => ({
      ...prev,
      bullets: prev.bullets.map((b, i) => (i === idx ? value : b))
    }))
  }

  function removeBullet(idx: number) {
    setForm(prev => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== idx)
    }))
  }

  function startEdit(s: ServiceItem) {
    setEditing(s)
    setForm({
      key: s.key || '',
      icon: s.icon || '',
      color: s.color || '',
      order: s.order || '',
      title: s.service_translations?.[0]?.title || '',
      description: s.service_translations?.[0]?.description || '',
      bullets: s.service_translations?.[0]?.bullets || [''],
      file: null,
    })
    setView('form')
  }

  function startCreate() {
    setEditing(null)
    setForm(emptyForm)
    setView('form')
  }

  function cancelForm() {
    setEditing(null)
    setForm(emptyForm)
    setView('list')
    setShowPreview(false)
  }

  async function uploadIcon(): Promise<string | undefined> {
    if (!form.file) return undefined

    const fd = new FormData()
    fd.append('file', form.file)

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: fd,
    })

    if (!res.ok) throw new Error('Upload failed')
    const json = await res.json()
    return json.url
  }

  async function handleSubmit() {
    const toastId = toast.loading('Saving...')

    try {
      const iconUrl = await uploadIcon()

      const payload = {
        id: editing?.id,
        key: form.key || undefined,
        icon: iconUrl || form.icon || undefined,
        color: form.color || undefined,
        order: form.order || undefined,
        translations: [
          {
            language: locale,
            title: form.title,
            description: form.description,
            bullets: form.bullets.filter(Boolean),
          },
        ],
      }

      const method = editing ? 'PATCH' : 'POST'
      if (editing?.id) payload.id = editing.id

      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      toast.success(editing ? 'Service updated' : 'Service created', {
        id: toastId,
      })

      cancelForm()
      fetchServices()
    } catch {
      toast.error('Failed to save', { id: toastId })
    }
  }

  async function handleDelete(id?: string) {
    if (!id || !confirm('Delete this service?')) return
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Deleted successfully')
      fetchServices()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filteredIcons = icons.filter(i =>
    i.toLowerCase().includes(iconSearch.toLowerCase())
  )

  const PreviewCard = ({ data }: { data: ServiceForm }) => {
    const colorClass = data.color || colorOptions[0].class
    const iconSrc = data.icon || ''
    const isImg = /^https?:\/\//.test(iconSrc)

    return (
      <div className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm h-120">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${colorClass} mb-6`}>
          {isImg ? (
            <div className="w-8 h-8 relative rounded overflow-hidden">
              <Image src={iconSrc} alt="icon" fill className="object-cover" />
            </div>
          ) : iconSrc ? (
            <DynamicIcon name={iconSrc} className="w-8 h-8 text-white" />
          ) : (
            <div className="w-8 h-8 rounded bg-white/20" />
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {data.title || 'Service Title'}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          {data.description || 'Service description goes here'}
        </p>

        {data.bullets.filter(Boolean).length > 0 && (
          <ul className="space-y-2">
            {data.bullets.filter(Boolean).map((b, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colorClass} mt-1.5 flex-shrink-0`} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto p-6 space-y-6">
          <DashboardHeader
            title="Services"
            description="Manage your services and features"
            onClick={startCreate}
            actionLabel="New Service"
            actionIcon={<Plus className="w-4 h-4" />}
          />

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl border bg-card animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">No services yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first service to get started
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const colorClass = s.color || colorOptions[0].class
                const iconSrc = s.icon || ''
                const isImg = /^https?:\/\//.test(iconSrc)

                return (
                  <Card key={s.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass}`}>
                        {isImg ? (
                          <div className="w-6 h-6 relative rounded overflow-hidden">
                            <Image src={iconSrc} alt="icon" fill className="object-cover" />
                          </div>
                        ) : iconSrc ? (
                          <DynamicIcon name={iconSrc} className="w-6 h-6 text-white" />
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold line-clamp-1">
                          {s.service_translations?.[0]?.title || 'Untitled'}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {s.service_translations?.[0]?.description || ''}
                        </p>
                      </div>

                      {s.service_translations?.[0]?.bullets && s.service_translations[0].bullets.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {s.service_translations[0].bullets.length} features
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(s)} className="flex-1 gap-2">
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)} className="gap-2">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6">
        <div className='py-5'>
          <Button type="button" variant="ghost" size="sm" onClick={cancelForm} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-card border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {editing ? 'Edit Service' : 'New Service'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {editing ? 'Update service details' : 'Create a new service'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Save className="w-4 h-4" />
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="space-y-6 col-span-3">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Service Key</label>
                        <Input
                          placeholder="e.g., web-development"
                          value={form.key}
                          onChange={e => updateForm('key', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="e.g., Web Development"
                          value={form.title}
                          onChange={e => updateForm('title', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Input
                          placeholder="Brief description of the service"
                          value={form.description}
                          onChange={e => updateForm('description', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Order</label>
                        <Input
                          type="number"
                          placeholder="Display order"
                          value={form.order}
                          onChange={e => updateForm('order', e.target.value ? Number(e.target.value) : '')}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Visual Style</h3>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Icon</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => setShowIconPicker(!showIconPicker)}
                        >
                          {form.icon ? (
                            <>
                              <DynamicIcon name={form.icon} className="w-4 h-4" />
                              {form.icon}
                            </>
                          ) : (
                            'Select Icon'
                          )}
                        </Button>

                        {showIconPicker && (
                          <div className="absolute z-50 w-full mt-2 rounded-lg border bg-background shadow-lg">
                            <div className="p-3 border-b">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search icons..."
                                  value={iconSearch}
                                  onChange={e => setIconSearch(e.target.value)}
                                  className="pl-9"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-6 gap-1 p-2 max-h-64 overflow-y-auto">
                              {filteredIcons.slice(0, 60).map(name => (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() => {
                                    updateForm('icon', name)
                                    setShowIconPicker(false)
                                    setIconSearch('')
                                  }}
                                  className="p-3 hover:bg-muted rounded flex items-center justify-center"
                                  title={name}
                                >
                                  <DynamicIcon name={name} className="w-5 h-5" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Color Gradient</label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.class}
                          type="button"
                          onClick={() => updateForm('color', color.class)}
                          className={`h-12 rounded-lg ${color.bg} transition-transform hover:scale-105 ${form.color === color.class ? 'ring-2 ring-offset-2 ring-primary' : ''
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Features</h3>
                    <Button type="button" size="sm" variant="outline" onClick={addBullet} className="gap-2">
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {form.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          placeholder={`Feature ${idx + 1}`}
                          value={bullet}
                          onChange={e => updateBullet(idx, e.target.value)}
                        />
                        {form.bullets.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeBullet(idx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={`space-y-4 ${showPreview ? '' : 'hidden lg:block'}`}>
              <div className="sticky top-6">
                <div className="text-sm font-medium mb-3 text-muted-foreground">Live Preview</div>
                <PreviewCard data={form} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}