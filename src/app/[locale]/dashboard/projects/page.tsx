'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'

import DashboardHeader from '@/components/ui/sections/admin/dashboardheader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAdminProjects from '@/hooks/api/admin/projects/useAdminProjects'
import useProjectActions from '@/hooks/api/admin/projects/useProjectActions'

// Expecting the structure from useAdminProjects
// AdminProject in useAdminProjects has translation object.
// We can define it here if needed or just use the hook's return type implicitly.

export default function Page() {
  const router = useRouter()
  const t = useTranslations("Dashboard.projects")
  const tc = useTranslations("Common")

  const { projects, loading, refreshProjects } = useAdminProjects()
  const { deleteProject } = useProjectActions(refreshProjects)

  /* ================= HANDLERS ================= */

  const handleDelete = async (id: string) => {
    // Hook handles confirmation if implemented there, but current useProjectActions implementation has confirm inside it.
    await deleteProject(id)
  }

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen p-6 space-y-6">

      <DashboardHeader
        title={t('title')}
        description={t('description')}
        actionLabel={t('add')}
        actionIcon={<Plus className="h-4 w-4 mr-2" />}
        onClick={() => router.push('/dashboard/projects/new')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] animate-pulse rounded-xl border bg-card"
            />
          ))}

        {!loading && projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {t('empty')}
          </div>
        )}

        {projects.map(project => (
          <Card key={project.id} className="overflow-hidden">
            {project.image_url && (
              <div className="aspect-video relative">
                <Image
                  src={project.image_url}
                  alt={project.translation?.title ?? 'Project image'}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <CardHeader className="p-4">
              <CardTitle className="text-lg">
                {project.translation?.title ?? 'Untitled'}
              </CardTitle>
              <p className="line-clamp-2 text-sm text-muted-foreground min-h-[40px]">
                {project.translation?.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4 p-4 pt-0">
              {project.technologies && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span
                      key={tech}
                      className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[10px] text-muted-foreground pt-0.5">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  {tc('actions.edit')}
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
