'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';
import ProjectForm, {
    ProjectFormData,
} from '@/components/ui/sections/admin/forms/projectform';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
interface ProjectInitialData {
    image_url?: string;
    year?: number;
    technologies?: string[];
    live_url?: string;
    github_url?: string;
    projects_translations?: Array<{
        language: string;
        title: string;
        description: string;
    }>;
}

export default function ProjectEditPage() {
    const router = useRouter();
    const routeParams = useParams();
    const id = routeParams.id as string;
    const locale = useLocale();

    const [data, setData] = useState<ProjectInitialData | null>(null);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH DATA ================= */
    const fetchProject = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${id}?lang=${locale}`, {
                cache: 'no-store',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    toast.error('Data project tidak ditemukan');
                    router.push('/dashboard/projects');
                    return;
                }
                throw new Error('Failed to fetch project');
            }

            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error('Fetch project error:', error);
            toast.error('Gagal memuat data project');
        }
    }, [id, router, locale]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    /* ================= SUBMIT ================= */
    const handleSubmit = async (formData: ProjectFormData) => {
        setLoading(true);

        try {
            const payload = {
                image_url: formData.image_url,
                year: formData.year,
                technologies: formData.technologies,
                live_url: formData.live_url,
                github_url: formData.github_url,
                translations: [
                    {
                        language: locale,
                        title: formData.title,
                        description: formData.description,
                    },
                ],
            };

            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            toast.success('Project berhasil diperbarui');
            router.push('/dashboard/projects');
        } catch (error) {
            console.error('Update project error:', error);
            toast.error('Gagal memperbarui project');
        } finally {
            setLoading(false);
        }
    };

    if (!data) {
        return <p className="p-8 text-center text-muted-foreground">Loading project data...</p>;
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
                        <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Project</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">Edit Project</h1>
                    <p className="text-sm text-muted-foreground">
                        Update project information and media
                    </p>
                </div>
            </div>

            <ProjectForm
                initialData={data}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
