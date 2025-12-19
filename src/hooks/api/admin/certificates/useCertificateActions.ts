import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export interface CertificateFormData {
    issuer: string;
    year: string;
    preview: string;
    skills: string[];
    title: string;
    description: string;
}

interface UseCertificateActionsReturn {
    submitting: boolean;
    deleteCertificate: (id: string) => Promise<void>;
    createCertificate: (data: CertificateFormData) => Promise<void>;
    updateCertificate: (id: string, data: CertificateFormData) => Promise<void>;
    uploadFile: (file: File) => Promise<string>;
}

export default function useCertificateActions(onSuccess?: () => void): UseCertificateActionsReturn {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const locale = useLocale();

    const deleteCertificate = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certificate?")) return;

        setSubmitting(true);
        const toastId = toast.loading("Deleting certificate...");
        try {
            const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success("Certificate deleted", { id: toastId });
            onSuccess?.();
            router.refresh();
        } catch {
            toast.error("Failed to delete certificate", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const createCertificate = async (data: CertificateFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Creating certificate...");
        try {
            const payload = {
                issuer: data.issuer,
                year: data.year,
                preview: data.preview,
                translations: [
                    {
                        language: locale,
                        title: data.title,
                        description: data.description,
                        skills: data.skills,
                    },
                ],
            };

            const res = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create');

            toast.success("Certificate created", { id: toastId });
            onSuccess?.();
            router.push('/dashboard/certificates');
        } catch (error) {
            toast.error("Failed to create certificate", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const updateCertificate = async (id: string, data: CertificateFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Updating certificate...");
        try {
            const payload = {
                issuer: data.issuer,
                year: data.year,
                preview: data.preview,
                translations: [
                    {
                        language: locale,
                        title: data.title,
                        description: data.description,
                        skills: data.skills,
                    },
                ],
            };

            const res = await fetch(`/api/certificates/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success("Certificate updated", { id: toastId });
            onSuccess?.();
            router.push('/dashboard/certificates');
        } catch (error) {
            toast.error("Failed to update certificate", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // For certificates, it might be a PDF or Image. Reusing image upload or specific endpoint?
    // Project used /api/upload/image. CertificatePreview implies it's a file URL.
    // Assuming same upload endpoint for now or need to check certificate form.
    // Let's assume generic file upload or same image upload if it supports pdfs?
    // ArticleForm uses /api/upload/image.
    // Let's name it uploadFile and point to /api/upload/image for now (often used for assets).
    const uploadFile = async (file: File): Promise<string> => {
        setSubmitting(true);
        const toastId = toast.loading("Uploading file...");
        try {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload/image", { // Adjust endpoint if specific for certs
                method: "POST",
                body: fd,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            toast.success("File uploaded", { id: toastId });
            return data.url;
        } catch (error) {
            toast.error("Failed to upload file", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    }

    return { submitting, deleteCertificate, createCertificate, updateCertificate, uploadFile };
}
