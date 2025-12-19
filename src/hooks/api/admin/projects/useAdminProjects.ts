import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Project } from "@/lib/types/database";

// Define a type that matches what the API returns (Project + specific translation structure if needed)
// Database type has projects_translations array.
// Dashboard page uses a 'translation' object which implies a join/transform.
// Let's assume the API returns standard structure or a transformed one.
// The dashboard page uses `project.translation?.title`.
// So we define an ExtendedProject interface.

export interface AdminProject extends Omit<Project, 'projects_translations'> {
    translation?: {
        title: string;
        description: string;
    } | null;
}

interface UseAdminProjectsReturn {
    projects: AdminProject[];
    loading: boolean;
    refreshProjects: () => Promise<void>;
}

export default function useAdminProjects(): UseAdminProjectsReturn {
    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects?lang=${locale}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error("Failed to fetch projects");

            const json = await res.json();
            setProjects(json.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, refreshProjects: fetchProjects };
}
