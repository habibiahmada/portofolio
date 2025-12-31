'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/ui/sections/admin/dashboardheader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FAQForm from '@/components/ui/sections/admin/forms/faqform';
import useAdminFaqs from '@/hooks/api/admin/faqs/useAdminFaqs';
import useFaqActions from '@/hooks/api/admin/faqs/useFaqActions';

import { FAQ } from '@/lib/types/database';

export default function FAQAdminPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const { faqs, refreshFaqs } = useAdminFaqs();
  const { deleteFaq } = useFaqActions(refreshFaqs);

  const handleDelete = async (id: string) => {
    await deleteFaq(id);
  };

  return (
    <div className="min-h-screen space-y-6">
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
          const translation = faq.faq_translations?.[0];

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
                  aria-label="Edit FAQ"
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(faq.id)}
                  aria-label="Delete FAQ"
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
              refreshFaqs();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}