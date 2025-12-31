'use client';

import { useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFaqActions, { FAQFormData } from '@/hooks/api/admin/faqs/useFaqActions';

interface FAQTranslation {
  lang: string;
  question: string;
  answer: string;
}

interface FAQData {
  id: string;
  order_index: number;
  is_active: boolean;
  faq_translations?: FAQTranslation[];
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

  const existingTranslation = initialData?.faq_translations?.find(
    (translation) => translation.lang === locale
  );

  const [question, setQuestion] = useState<string>(
    existingTranslation?.question ?? ''
  );
  const [answer, setAnswer] = useState<string>(
    existingTranslation?.answer ?? ''
  );

  const { createFaq, updateFaq, submitting } = useFaqActions(onSuccess);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: FAQFormData = {
      question,
      answer,
      order_index: initialData?.order_index ?? 0,
      is_active: true,
    };

    if (initialData) {
      await updateFaq(initialData.id, payload);
    } else {
      await createFaq(payload);
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
        <Button type="submit" disabled={submitting} aria-label="Submit FAQ">
          {submitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}