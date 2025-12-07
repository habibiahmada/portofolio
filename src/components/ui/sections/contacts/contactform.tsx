'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Send, Upload } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ReCaptcha from '../../reCaptcha';
import Alert from '@/components/ui/alert';

// Types and Interfaces
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachment?: File | null;
  recaptcha: boolean;
}

interface ServiceOption {
  value: string;
  label: string;
}

const FormInput: React.FC<{
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, type = "text", required = false, placeholder, value, onChange }) => (
  <div className="space-y-3">
    <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">
      {label} {required && '*'}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="bg-white border border-slate-300 text-slate-800 placeholder-slate-400
        focus:border-blue-500 focus:ring-blue-200
        dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
        dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
    />
  </div>
);

interface ContactFormProps {
  onSubmit: (formData: ContactFormData) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const t = useTranslations("contacts");
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
  
  // Constants
  const SERVICES: ServiceOption[] = [
    { value: 'frontend', label: t('services.frontend') },
    { value: 'uiux', label: t('services.uiux') },
    { value: 'performance', label: t('services.performance') },
    { value: 'webapp', label: t('services.webapp') },
    { value: 'consulting', label: t('services.consulting') },
    { value: 'other', label: t('services.other') }
  ];

  // State Management
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    attachment: null,
    recaptcha: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{ open: boolean; type: 'success' | 'error' | 'info'; message: string }>({
    open: false,
    type: 'info',
    message: '',
  });

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ open: true, type, message });
  };

  const { resolvedTheme } = useTheme();

  // Event Handlers
  const handleInputChange = (field: keyof ContactFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!recaptchaToken) {
      showAlert('error', t("alerts.recaptcha"));
      setIsSubmitting(false);
      return;
    }
  
    try {
      const verifyRes = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: recaptchaToken }),
      });
  
      const verifyData = await verifyRes.json();
  
      if (!verifyData.success) {
        showAlert('error', t("alerts.recaptchaFailed"));
        setIsSubmitting(false);
        return;
      }
  
      await onSubmit(formData);
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        attachment: null,
        recaptcha: false,
      });
      setRecaptchaToken("");
  
      showAlert('success', t("alerts.success"));
    } catch (error) {
      console.error("Form submission error:", error);
      showAlert('error', t("alerts.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Card className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-xl shadow-lg">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl text-slate-800 dark:text-white flex items-center gap-3">
          <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          {t('form.title')}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {t('form.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8" aria-label="Contact Form">
          {/* Name and Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              id="name"
              label={t('form.name.label')}
              type="text"
              required
              placeholder={t('form.name.placeholder')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <FormInput
              id="email"
              label={t('form.email.label')}
              type="email"
              required
              placeholder={t('form.email.placeholder')}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          {/* Phone and Subject */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              id="phone"
              label={t('form.phone.label')}
              type="tel"
              placeholder={t('form.phone.placeholder')}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <div className="space-y-3">
              <Label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('form.subject.label')} *
              </Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger className="cursor-pointer bg-white border border-slate-300 text-slate-800
                    focus:border-blue-500 focus:ring-blue-200
                    dark:bg-slate-800 dark:border-slate-700 dark:text-white
                    dark:focus:border-blue-500 dark:focus:ring-blue-500/20">
                    <SelectValue placeholder={t('form.subject.placeholder')}/>
                  </SelectTrigger>
                <SelectContent className="bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700">
                  {SERVICES.map((service) => (
                    <SelectItem 
                      key={service.value} 
                      value={service.value} 
                      className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700
                        text-slate-800 dark:text-slate-200">
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Message */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('form.message.label')} *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              required
              rows={6}
              placeholder={t('form.message.placeholder')}
              className="bg-white border border-slate-300 text-slate-800 placeholder-slate-400
                focus:border-blue-500 focus:ring-blue-200
                dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          
          {/* File Upload */}
          <div className="space-y-3">
            <Label
              htmlFor="attachment"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {t('form.attachment.label')}
            </Label>

            <div className="relative">
              <Input
                id="attachment"
                type="file"
                onChange={(e) =>
                  handleInputChange("attachment", e.target.files?.[0] || null)
                }
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className={`
                  bg-white dark:bg-slate-900
                  border border-slate-300 dark:border-slate-700
                  text-slate-700 dark:text-slate-200
                  file:bg-blue-600 file:hover:bg-blue-700
                  file:text-white
                  file:border-0 file:rounded-md
                  file:px-4 file:mr-4
                  cursor-pointer
                  file:cursor-pointer
                  h-auto
                `}
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('form.attachment.description')}
            </p>
          </div>

          
          {/* reCAPTCHA */}
          {siteKey ? (
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[360px] sm:max-w-none">
                <ReCaptcha
                  siteKey={siteKey}
                  onVerify={(token) => setRecaptchaToken(token)}
                  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
              reCAPTCHA site key is missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.
            </p>
          )}
            
          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting || !recaptchaToken || !siteKey}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-medium transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-describedby="submit-help"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('form.submit.sending')}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>{t('form.submit.send')}</span>
              </div>
            )}
          </Button>
          
          <p id="submit-help" className="text-sm text-slate-500 dark:text-slate-400 text-center">
            {t('form.responseTime')}
          </p>
        </form>
      </CardContent>
    </Card>
    <Alert open={alert.open} type={alert.type} message={alert.message} onClose={() => setAlert(prev => ({...prev, open: false}))} />
    </>
  );
};

export default ContactForm;
