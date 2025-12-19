'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ProjectNewPage() {
    const router = useRouter();
    const locale = useLocale();
    const [loading, setLoading] = useState(false);

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

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Creation failed');
            }

            toast.success('Project berhasil dibuat');
            router.push('/dashboard/projects');
        } catch (error) {
            console.error('Create project error:', error);
            toast.error('Gagal membuat project');
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
                        <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>New Project</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">Add New Project</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new project entry with details and technologies
                    </p>
                </div>
            </div>

            <ProjectForm
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
