import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface TestimonialFormData {
    name: string;
    role: string;
    company: string;
    rating: number;
    avatar: string;
    content: string; // The translation content
}

interface UseTestimonialActionsReturn {
    submitting: boolean;
    deleteTestimonial: (id: string) => Promise<void>;
    createTestimonial: (data: TestimonialFormData) => Promise<void>;
    updateTestimonial: (id: string, data: TestimonialFormData) => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

export default function useTestimonialActions(onSuccess?: () => void): UseTestimonialActionsReturn {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const deleteTestimonial = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        setSubmitting(true);
        // const toastId = toast.loading("Deleting testimonial...");
        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success("Testimonial deleted");
            onSuccess?.();
            router.refresh();
        } catch {
            toast.error("Failed to delete testimonial");
        } finally {
            setSubmitting(false);
        }
    };

    const createTestimonial = async (data: TestimonialFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Creating testimonial...");
        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create');

            toast.success("Testimonial created", { id: toastId });
            onSuccess?.();
            router.push('/dashboard/testimonials');
        } catch (error) {
            toast.error("Failed to create testimonial", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const updateTestimonial = async (id: string, data: TestimonialFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Updating testimonial...");
        try {
            const res = await fetch(`/api/testimonials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success("Testimonial updated", { id: toastId });
            onSuccess?.();
            router.push('/dashboard/testimonials');
        } catch (error) {
            toast.error("Failed to update testimonial", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        setSubmitting(true);
        const toastId = toast.loading("Uploading avatar...");
        try {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: fd,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            toast.success("Avatar uploaded", { id: toastId });
            return data.url;
        } catch (error) {
            toast.error("Failed to upload avatar", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    }

    return { submitting, deleteTestimonial, createTestimonial, updateTestimonial, uploadImage };
}
