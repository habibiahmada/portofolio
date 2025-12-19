'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import ArticleForm, {
    ArticleFormData,
} from '@/components/ui/sections/admin/forms/articleform';
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
    const locale = useLocale();
    const t = useTranslations('Dashboard.articles');
    const [loading, setLoading] = useState(false);

    /* ================= SUBMIT ================= */
    const handleSubmit = async (formData: ArticleFormData) => {
        setLoading(true);

        try {
            const payload = {
                image_url: formData.image || null,
                published: formData.published,
                translations: [
                    {
                        language: locale,
                        title: formData.title,
                        slug: formData.slug,
                        content: formData.content,
                        excerpt: formData.excerpt,
                        tags: formData.tags,
                        read_time: formData.read_time,
                    },
                ],
            };

            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Creation failed');
            }

            toast.success(t('saveSuccess'));
            router.push('/dashboard/articles');
        } catch (error) {
            console.error('Create article error:', error);
            toast.error(t('saveError'));
        } finally {
            setLoading(false);
        }
    };

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
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
