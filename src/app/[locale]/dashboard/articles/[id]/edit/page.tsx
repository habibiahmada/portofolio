'use client';

import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ArticleForm from '@/components/ui/sections/admin/forms/articleform';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import useAdminArticles from '@/hooks/api/admin/articles/useAdminArticles';

export default function ArticleEditPage() {
    const router = useRouter();
    const params = useParams();
    const t = useTranslations('Dashboard.articles');

    const id = params?.id as string;
    const { articles, loading: fetching } = useAdminArticles();
    const initialData = articles.find(a => a.id === id);

    if (fetching) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                    {t('loading')}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/articles">{t('title')}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t('edit')}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">{t('edit')}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t('editDescription')}
                    </p>
                </div>
            </div>

            {initialData && (
                <ArticleForm
                    initialData={initialData}
                    onSuccess={() => router.push('/dashboard/articles')}
                />
            )}
        </div>
    );
}
