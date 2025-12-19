import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ProjectFormData {
    year: number;
    technologies: string[];
    live_url?: string;
    github_url?: string;
    image_url?: string;
    title: string;
    description: string;
}

interface UseProjectActionsReturn {
    submitting: boolean;
    deleteProject: (id: string) => Promise<void>;
    createProject: (data: ProjectFormData) => Promise<void>;
    updateProject: (id: string, data: ProjectFormData) => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

export default function useProjectActions(onSuccess?: () => void): UseProjectActionsReturn {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const deleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setSubmitting(true);
        const toastId = toast.loading("Deleting project...");
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success("Project deleted", { id: toastId });
            onSuccess?.();
            router.refresh();
        } catch {
            toast.error("Failed to delete project", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const createProject = async (data: ProjectFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Creating project...");
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create');

            toast.success("Project created", { id: toastId });
            onSuccess?.();
            router.push('/dashboard/projects');
        } catch (error) {
            toast.error("Failed to create project", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const updateProject = async (id: string, data: ProjectFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Updating project...");
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success("Project updated", { id: toastId });
            onSuccess?.();
            router.push('/dashboard/projects');
        } catch (error) {
            toast.error("Failed to update project", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        setSubmitting(true);
        const toastId = toast.loading("Uploading image...");
        try {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: fd,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            toast.success("Image uploaded", { id: toastId });
            return data.url;
        } catch (error) {
            toast.error("Failed to upload image", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    }

    return { submitting, deleteProject, createProject, updateProject, uploadImage };
}
