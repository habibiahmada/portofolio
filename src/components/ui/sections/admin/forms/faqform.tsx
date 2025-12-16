'use client';

import { useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FAQTranslation {
  lang: string;
  question: string;
  answer: string;
}

interface FAQData {
  id: string;
  order_index: number;
  is_active: boolean;
  faq_translations: FAQTranslation[];
}

interface FAQFormProps {
  initialData?: FAQData;
  onSuccess: () => void;
}

export default function FAQForm({
  initialData,
  onSuccess,
}: FAQFormProps) {
  const locale = useLocale();

  const existingTranslation = initialData?.faq_translations.find(
    (translation) => translation.lang === locale
  );

  const [question, setQuestion] = useState<string>(
    existingTranslation?.question ?? ''
  );
  const [answer, setAnswer] = useState<string>(
    existingTranslation?.answer ?? ''
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    try {
      const response = await fetch(
        initialData ? `/api/faqs/${initialData.id}` : '/api/faqs',
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save FAQ');
      }

      onSuccess();
    } catch (error) {
      console.error('FAQ save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium">
          Question ({locale.toUpperCase()})
        </label>
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
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
          onChange={(event) => setAnswer(event.target.value)}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}