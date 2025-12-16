"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FAQForm from "@/components/ui/sections/admin/forms/faqform";
import { useLocale } from "next-intl";

interface FAQ {
  id: string;
  order_index: number;
  is_active: boolean;
  faq_translations: {
    lang: string;
    question: string;
    answer: string;
  }[];
}

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [open, setOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const locale = useLocale();

  const fetchFaqs = async () => {
    const res = await fetch("/api/faqs?lang=" + locale, { cache: "no-store" });
    const data = await res.json();
    setFaqs(data);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

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
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border rounded-xl p-4 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">
                {faq.faq_translations[0]?.question}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {faq.faq_translations[0]?.answer}
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
                onClick={async () => {
                  if (!confirm("Delete this FAQ?")) return;
                  await fetch(`/api/faqs/${faq.id}`, { method: "DELETE" });
                  fetchFaqs();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFAQ ? "Edit FAQ" : "Add FAQ"}
            </DialogTitle>
          </DialogHeader>

          <FAQForm
            initialData={editingFAQ}
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