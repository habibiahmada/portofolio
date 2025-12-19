import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export interface FAQFormData {
    question: string;
    answer: string;
    order_index: number;
    is_active: boolean;
}

interface UseFaqActionsReturn {
    submitting: boolean;
    deleteFaq: (id: string) => Promise<void>;
    createFaq: (data: FAQFormData) => Promise<void>;
    updateFaq: (id: string, data: FAQFormData) => Promise<void>;
}

export default function useFaqActions(onSuccess?: () => void): UseFaqActionsReturn {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const locale = useLocale();

    const deleteFaq = async (id: string) => {
        if (!confirm("Delete this FAQ?")) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success("FAQ deleted");
            onSuccess?.();
            router.refresh();
        } catch {
            toast.error("Failed to delete FAQ");
        } finally {
            setSubmitting(false);
        }
    };

    const createFaq = async (data: FAQFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Creating FAQ...");
        try {
            const payload = {
                order_index: data.order_index,
                is_active: data.is_active,
                translations: [
                    {
                        lang: locale,
                        question: data.question,
                        answer: data.answer,
                    },
                ],
            };

            const res = await fetch('/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create');

            toast.success("FAQ created", { id: toastId });
            onSuccess?.();
            router.refresh(); // FAQs list usually on same page
        } catch (error) {
            toast.error("Failed to create FAQ", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const updateFaq = async (id: string, data: FAQFormData) => {
        setSubmitting(true);
        const toastId = toast.loading("Updating FAQ...");
        try {
            const payload = {
                order_index: data.order_index,
                is_active: data.is_active,
                translations: [
                    {
                        lang: locale,
                        question: data.question,
                        answer: data.answer,
                    },
                ],
            };

            const res = await fetch(`/api/faqs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success("FAQ updated", { id: toastId });
            onSuccess?.();
            router.refresh();
        } catch (error) {
            toast.error("Failed to update FAQ", { id: toastId });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    return { submitting, deleteFaq, createFaq, updateFaq };
}
