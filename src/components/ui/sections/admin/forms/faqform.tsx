"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FAQFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export default function FAQForm({ initialData, onSuccess }: FAQFormProps) {
  const locale = useLocale(); // id | en

  const existingTranslation = initialData?.faq_translations?.find(
    (t: any) => t.lang === locale
  );

  const [question, setQuestion] = useState(
    existingTranslation?.question || ""
  );
  const [answer, setAnswer] = useState(
    existingTranslation?.answer || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      order_index: initialData?.order_index ?? 0,
      is_active: true,
      translations: [
        {
          lang: locale,
          question,
          answer,
        },
      ],
    };

    await fetch(
      initialData ? `/api/faqs/${initialData.id}` : "/api/faqs",
      {
        method: initialData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium">
          Question ({locale.toUpperCase()})
        </label>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Answer ({locale.toUpperCase()})
        </label>
        <Textarea
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
