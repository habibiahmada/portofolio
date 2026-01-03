'use client';

import { useState } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachment?: File | null;
  recaptchaToken: string;
}


interface UseContactReturn {
  submitContact: (formData: ContactFormData) => Promise<void>;
  loading: boolean;
}

export default function useContact(): UseContactReturn {
  const [loading, setLoading] = useState(false);

  const submitContact = async (formData: ContactFormData) => {
    setLoading(true);

    try {
      const payload: Record<string, unknown> = { ...formData };

      if (formData.attachment) {
        const file = formData.attachment;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        payload.attachment = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
        };
      }

      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error('TOO_MANY_REQUESTS');
        throw new Error('FAILED');
      }
    } finally {
      setLoading(false);
    }
  };

  return { submitContact, loading };
}
