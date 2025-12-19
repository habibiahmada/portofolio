import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ArticleFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url: string;
    published: boolean;
    tags: string[];
    read_time: string;
}

interface UseArticleActionsReturn {
    submitting: boolean;
    deleteArticle: (id: string) => Promise<void>;
    togglePublish: (id: string, currentPublished: boolean) => Promise<void>;
    createArticle: (data: ArticleFormData) => Promise<void>;
    updateArticle: (id: string, data: ArticleFormData) => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

export default function useArticleActions(onSuccess?: () => void): UseArticleActionsReturn {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const deleteArticle = async (id: string) => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success("Article deleted successfully");
            onSuccess?.();
        } catch {
            toast.error("Failed to delete article");
        } finally {
            setSubmitting(false);
        }
    };

    const togglePublish = async (id: string, currentPublished: boolean) => {
        // Optimistic UI updates or visual feedback usually handled by component, 
        // but here we just perform the action
        const toastId = toast.loading(currentPublished ? "Unpublishing..." : "Publishing...");
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !currentPublished }),
            });
            if (!res.ok) throw new Error('Failed to update');

            toast.success(currentPublished ? "Article unpublished" : "Article published", { id: toastId });
            onSuccess?.();
            router.refresh();
        } catch {
            toast.error("Failed to update status", { id: toastId });
        }
    };

    const createArticle = async (data: ArticleFormData) => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create');

            toast.success("Article created successfully");
            onSuccess?.();
            router.push('/admin/articles'); // Adjust path if needed, e.g. /dashboard/articles
        } catch (error) {
            toast.error("Failed to create article");
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const updateArticle = async (id: string, data: ArticleFormData) => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success("Article updated successfully");
            onSuccess?.();
            router.push('/admin/articles');
        } catch (error) {
            toast.error("Failed to update article");
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

    return { submitting, deleteArticle, togglePublish, createArticle, updateArticle, uploadImage };
}
