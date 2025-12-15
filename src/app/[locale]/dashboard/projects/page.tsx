'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ProjectItem {
  id: string
  image_url?: string
  year?: number
  technologies?: string[]
  live_url?: string
  github_url?: string
  translation?: {
    title?: string
    description?: string
  } | null
}

interface ProjectForm {
  title: string
  description: string
  year: number | ''
  technologies: string
  live_url: string
  github_url: string
  file: File | null
}

const EMPTY_FORM: ProjectForm = {
  title: '',
  description: '',
  year: '',
  technologies: '',
  live_url: '',
  github_url: '',
  file: null,
}

export default function Page() {
  const locale = useLocale()

  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectItem | null>(null)
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/projects?lang=${locale}`)
      const json = await res.json()
      setProjects(json.data ?? [])
    } catch {
      toast.error('Gagal memuat project')
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (project: ProjectItem) => {
    setEditing(project)
    setForm({
      title: project.translation?.title ?? '',
      description: project.translation?.description ?? '',
      year: project.year ?? '',
      technologies: project.technologies?.join(', ') ?? '',
      live_url: project.live_url ?? '',
      github_url: project.github_url ?? '',
      file: null,
    })
    setDialogOpen(true)
  }

  const updateForm = <K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K],
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const uploadImage = async (): Promise<string | undefined> => {
    if (!form.file) return undefined

    const fd = new FormData()
    fd.append('file', form.file)

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: fd,
    })

    if (!res.ok) {
      throw new Error('Upload gagal')
    }

    const json = await res.json()
    return json.url as string
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const toastId = toast.loading('Menyimpan...')

    try {
      const imageUrl = await uploadImage()

      const payload = {
        ...(editing && { id: editing.id }),
        image_url: imageUrl,
        year: form.year || undefined,
        technologies: form.technologies
          ? form.technologies
              .split(',')
              .map(t => t.trim())
              .filter(Boolean)
          : undefined,
        live_url: form.live_url || undefined,
        github_url: form.github_url || undefined,
        translations: [
          {
            language: locale,
            title: form.title,
            description: form.description,
          },
        ],
      }

      const res = await fetch('/api/projects', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Request gagal')
      }

      toast.success(editing ? 'Project diperbarui' : 'Project dibuat', {
        id: toastId,
      })

      setDialogOpen(false)
      setForm(EMPTY_FORM)
      setEditing(null)
      fetchProjects()
    } catch {
      toast.error('Gagal menyimpan', { id: toastId })
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!window.confirm('Hapus project ini?')) return

    const toastId = toast.loading('Menghapus...')
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('Delete gagal')
      }
      toast.success('Project dihapus', { id: toastId })
      fetchProjects()
    } catch {
      toast.error('Gagal menghapus', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="rounded-md bg-card px-4 py-2 shadow">
            Loading...
          </div>
        </div>
      )}

      <header className="flex items-center justify-between rounded-xl border bg-card p-6">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Kelola project portofolio
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex gap-2">
              <Plus className="h-4 w-4" />
              Tambah Project
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Edit Project' : 'Tambah Project'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Judul"
                value={form.title}
                onChange={e => updateForm('title', e.target.value)}
                required
              />

              <Input
                placeholder="Deskripsi"
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
              />

              <Input
                type="number"
                placeholder="Tahun"
                value={form.year}
                onChange={e =>
                  updateForm(
                    'year',
                    e.target.value ? Number(e.target.value) : '',
                  )
                }
              />

              <Input
                placeholder="React, Next.js, Tailwind"
                value={form.technologies}
                onChange={e => updateForm('technologies', e.target.value)}
              />

              <Input
                placeholder="Live URL"
                value={form.live_url}
                onChange={e => updateForm('live_url', e.target.value)}
              />

              <Input
                placeholder="Github URL"
                value={form.github_url}
                onChange={e => updateForm('github_url', e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  updateForm('file', e.target.files?.[0] ?? null)
                }
                className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editing ? 'Update' : 'Simpan'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {!loading && projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Belum ada project. Portofolio kosong itu bukan strategi.
          </div>
        )}

        {projects.map(project => (
          <Card key={project.id}>
            {project.image_url && (
              <Image
                src={project.image_url}
                alt={project.translation?.title ?? 'Project image'}
                width={640}
                height={360}
                className="aspect-video object-cover"
              />
            )}

            <CardHeader>
              <CardTitle>
                {project.translation?.title ?? 'Untitled'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {project.translation?.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {project.technologies && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map(tech => (
                    <span
                      key={tech}
                      className="rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEdit(project)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}