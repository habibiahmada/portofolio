'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import DashboardHeader from '@/components/ui/sections/admin/dashboardheader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FAQForm from '@/components/ui/sections/admin/forms/faqform';

interface FAQTranslation {
  lang: string;
  question: string;
  answer: string;
}

interface FAQ {
  id: string;
  order_index: number;
  is_active: boolean;
  faq_translations: FAQTranslation[];
}

export default function FAQAdminPage() {
  const locale = useLocale();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const fetchFaqs = useCallback(async () => {
    try {
      const response = await fetch(`/api/faqs?lang=${locale}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }

      const data: FAQ[] = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error('Fetch FAQs error:', error);
    }
  }, [locale]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this FAQ?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }

      fetchFaqs();
    } catch (error) {
      console.error('Delete FAQ error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="FAQs"
        description="Manage questions that appear on the website"
        actionLabel="Add FAQ"
        onClick={() => {
          setEditingFAQ(null);
          setOpen(true);
        }}
      />

      <div className="grid gap-4">
        {faqs.map((faq) => {
          const translation = faq.faq_translations[0];

          return (
            <div
              key={faq.id}
              className="flex items-start justify-between rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {translation?.question ?? '-'}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {translation?.answer ?? ''}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingFAQ(faq);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(faq.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFAQ ? 'Edit FAQ' : 'Add FAQ'}
            </DialogTitle>
          </DialogHeader>

          <FAQForm
            initialData={editingFAQ ?? undefined}
            onSuccess={() => {
              setOpen(false);
              fetchFaqs();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}