'use client';

import { useRouter } from 'next/navigation';
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

export default function ArticleNewPage() {
    const router = useRouter();
    const t = useTranslations('Dashboard.articles');

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
                        <BreadcrumbPage>{t('new')}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">{t('new')}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t('newDescription')}
                    </p>
                </div>
            </div>

            <ArticleForm
                onSuccess={() => router.push('/dashboard/articles')}
            />
        </div>
    );
}
