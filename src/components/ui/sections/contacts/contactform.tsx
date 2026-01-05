'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Send } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Alert from '@/components/ui/alert';

import ContactBasicInfo from './contactbasicinfo';
import ContactService from './contactservice';
import ContactMessage from './contactmessage';
import ContactAttachment from './contactattachment';
import ContactRecaptcha from './contactrecaptcha';
import ContactSubmit from './contactsubmit';

import { ContactFormData } from '@/hooks/api/public/useContact';
import { ReCaptchaHandle } from '@/components/ui/reCaptcha';

/* =========================
   Types
========================= */
type FormData = Omit<ContactFormData, 'recaptchaToken'>;

interface Props {
  onSubmit: (data: ContactFormData) => Promise<void>;
  loading?: boolean;
}

interface AlertState {
  open: boolean;
  type: 'success' | 'error';
  message: string;
}

/* =========================
   Initial state
========================= */
const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  attachment: null,
};

/* =========================
   Component
========================= */
export default function ContactForm({ onSubmit, loading = false }: Props) {
  const t = useTranslations('contacts');
  const { resolvedTheme } = useTheme();
  const recaptchaRef = useRef<ReCaptchaHandle>(null);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    type: 'success',
    message: '',
  });

  /* =========================
     Field updater (type-safe)
  ========================= */
  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  /* =========================
     Submit handler
  ========================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setAlert({
        open: true,
        type: 'error',
        message: t('alerts.recaptcha'),
      });
      return;
    }

    try {
      await onSubmit({ ...formData, recaptchaToken });

      setAlert({
        open: true,
        type: 'success',
        message: t('alerts.success'),
      });

      setFormData(INITIAL_FORM_DATA);
      setRecaptchaToken('');
      recaptchaRef.current?.reset();
    } catch {
      setAlert({
        open: true,
        type: 'error',
        message: t('alerts.error'),
      });

      setRecaptchaToken('');
      recaptchaRef.current?.reset();
    }
  };

  return (
    <>
      <Card className="bg-white dark:bg-slate-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            {t('form.title')}
          </CardTitle>
          <CardDescription>{t('form.description')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <ContactBasicInfo
              formData={formData}
              onChange={updateField}
            />

            <ContactService
              value={formData.subject}
              onChange={value => updateField('subject', value)}
            />

            <ContactMessage
              value={formData.message}
              onChange={value => updateField('message', value)}
            />

            <ContactAttachment
              onChange={file => updateField('attachment', file)}
            />

            <ContactRecaptcha
              ref={recaptchaRef}
              theme={resolvedTheme}
              onVerify={setRecaptchaToken}
              onExpired={() => setRecaptchaToken('')}
            />

            <ContactSubmit
              loading={loading}
              disabled={!recaptchaToken}
            />
          </form>
        </CardContent>
      </Card>

      <Alert
        {...alert}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      />
    </>
  );
}