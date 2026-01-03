'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Plus, Pencil, Trash2, Eye, EyeOff, Clock, Tag } from 'lucide-react'
import Image from 'next/image'

import DashboardHeader from '@/components/ui/sections/admin/dashboardheader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import useAdminArticles from '@/hooks/api/admin/articles/useAdminArticles'
import useArticleActions from '@/hooks/api/admin/articles/useArticleActions'

interface ArticleItem {
    id: string
    image?: string
    published: boolean
    published_at?: string
    created_at: string
    translation?: {
        title?: string
        slug?: string
        excerpt?: string
        tags?: string[]
        read_time?: string
    } | null
}

export default function Page() {
    const router = useRouter()
    const t = useTranslations("Dashboard.articles")
    const tc = useTranslations("Common")

    // Use hooks
    const { articles, loading, refreshArticles } = useAdminArticles()
    const { deleteArticle, togglePublish, submitting } = useArticleActions(refreshArticles)

    /* ================= HANDLERS ================= */

    const handleDelete = async (id: string) => {
        await deleteArticle(id)
    }

    const handleTogglePublish = async (id: string, currentPublished: boolean) => {
        await togglePublish(id, currentPublished)
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    /* ================= RENDER ================= */

    const displayedArticles = articles as unknown as ArticleItem[];

    return (
        <div className="min-h-screen space-y-6">
            <DashboardHeader
                title={t('title')}
                description={t('description')}
                actionLabel={t('add')}
                actionIcon={<Plus className="h-4 w-4 mr-2" />}
                onClick={() => router.push('/dashboard/articles/new')}
            />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">{t('table.image')}</TableHead>
                                <TableHead>{t('table.title')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('table.tags')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('table.readTime')}</TableHead>
                                <TableHead className="hidden sm:table-cell">{t('table.status')}</TableHead>
                                <TableHead className="hidden sm:table-cell">{t('table.date')}</TableHead>
                                <TableHead className="text-right">{t('table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <>
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell colSpan={7}>
                                                <div className="h-16 animate-pulse bg-muted rounded" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}

                            {!loading && displayedArticles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        {t('empty')}
                                    </TableCell>
                                </TableRow>
                            )}

                            {displayedArticles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell>
                                        {article.image ? (
                                            <div className="w-16 h-10 relative rounded overflow-hidden">
                                                <Image
                                                    src={article.image}
                                                    alt={article.translation?.title ?? 'Article'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                                                <span className="text-xs text-muted-foreground">-</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            <p className="font-medium truncate">{article.translation?.title ?? t('untitled')}</p>
                                            <p className="text-sm text-muted-foreground truncate hidden sm:block">
                                                {article.translation?.excerpt}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                                            {article.translation?.tags?.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                                                >
                                                    <Tag className="w-2.5 h-2.5" />
                                                    {tag}
                                                </span>
                                            ))}
                                            {(article.translation?.tags?.length ?? 0) > 2 && (
                                                <span className="text-xs text-muted-foreground">
                                                    +{(article.translation?.tags?.length ?? 0) - 2}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {article.translation?.read_time ?? '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={article.published}
                                                onCheckedChange={() => handleTogglePublish(article.id, article.published)}
                                                disabled={submitting}
                                            />
                                            <span className="text-sm">
                                                {article.published ? (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                        <Eye className="w-3 h-3" />
                                                        {t('published')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                                        <EyeOff className="w-3 h-3" />
                                                        {t('draft')}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                                        {article.published ? formatDate(article.published_at) : formatDate(article.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}
                                                aria-label={tc('actions.edit')}
                                            >
                                                <Pencil className="h-3 w-3" />
                                                <span className="sr-only">{tc('actions.edit')}</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(article.id)}
                                                disabled={submitting}
                                                aria-label={tc('actions.delete')}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                <span className="sr-only">{tc('actions.delete')}</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}