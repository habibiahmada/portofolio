'use client';

import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/ui/sections/admin/forms/projectform';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import useAdminProjects from '@/hooks/api/admin/projects/useAdminProjects';

export default function ProjectEditPage() {
    const router = useRouter();
    const routeParams = useParams();
    const id = routeParams.id as string;

    const { projects, loading: fetching } = useAdminProjects();
    const initialData = projects.find(p => p.id === id);

    if (fetching) {
        return <p className="p-8 text-center text-muted-foreground">Loading project data...</p>;
    }

    return (
        <div className="min-h-screen space-y-6">
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

            {initialData && (
                <ProjectForm
                    initialData={initialData}
                    onSuccess={() => router.push('/dashboard/projects')}
                />
            )}
        </div>
    );
}
