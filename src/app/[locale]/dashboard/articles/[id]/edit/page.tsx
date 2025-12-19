'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

interface ArticleData {
    id: string;
    image?: string;
    published: boolean;
    article_translations?: Array<{
        language: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        tags: string[];
        read_time: string;
    }>;
}

export default function ArticleEditPage() {
    const router = useRouter();
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations('Dashboard.articles');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [initialData, setInitialData] = useState<ArticleData | null>(null);

    const id = params?.id as string;

    /* ================= FETCH ================= */
    useEffect(() => {
        async function fetchArticle() {
            if (!id) return;

            try {
                const res = await fetch(`/api/articles/${id}?lang=${locale}`);
                const json = await res.json();

                if (json.error) {
                    toast.error(t('loadError'));
                    router.push('/dashboard/articles');
                    return;
                }

                setInitialData(json.data);
            } catch {
                toast.error(t('loadError'));
                router.push('/dashboard/articles');
            } finally {
                setFetching(false);
            }
        }

        fetchArticle();
    }, [id, locale, router, t]);

    /* ================= SUBMIT ================= */
    const handleSubmit = async (formData: ArticleFormData) => {
        setLoading(true);

        try {
            const payload = {
                image: formData.image || null,
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

            const response = await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            toast.success(t('saveSuccess'));
            router.push('/dashboard/articles');
        } catch (error) {
            console.error('Update article error:', error);
            toast.error(t('saveError'));
        } finally {
            setLoading(false);
        }
    };

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

            <ArticleForm
                initialData={initialData ?? undefined}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
