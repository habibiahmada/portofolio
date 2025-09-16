'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  Lightbulb,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  MessageSquare,
  Upload,
  CheckCircle2
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReCaptcha from '../../reCaptcha';
import Link from 'next/link';

// Types and Interfaces
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachment?: File | null;
  recaptcha: boolean;
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  color: string;
  action?: () => void;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/habibi-ahmad-aziz', color: 'hover:bg-blue-600' },
  { icon: Github, href: 'https://www.github.com/habibiahmada', color: 'hover:bg-slate-700' },
  { icon: Twitter, href: '#', color: 'hover:bg-blue-400' },
  { icon: Instagram, href: 'https://www.instagram.com/habibiahmad.a/', color: 'hover:bg-pink-600' }
];

// Helper Components
const ContactInfoItem: React.FC<{ info: ContactInfo }> = ({ info }) => {
  const IconComponent = info.icon;
  return (
    <div className="flex items-start space-x-4 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform duration-200`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold dark:text-white mb-1">{info.title}</h4>
                        {info.action ? (
                          <button
                            onClick={info.action}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-left"
                            aria-label={`Reveal ${info.title}`}
                          >
                            {info.content}
                          </button>
                        ) : (
                          <p className="text-slate-400">{info.content}</p>
                        )}
      </div>
    </div>
  );
};

const SocialLinkItem: React.FC<{ social: SocialLink; index: number }> = ({ social, index }) => {
  const IconComponent = social.icon;
  const platformName = social.icon.name || 'Social Media';
  
  return (
    <Link
      key={index}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit my ${platformName} profile`}
      className={`
        w-12 h-12 
        flex items-center justify-center 
        rounded-xl 
        border 
        transition-all duration-300 
        hover:scale-110 hover:text-white
        ${social.color} 
        bg-slate-100 border-slate-300 text-slate-600 
        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400
      `}
    >
      <IconComponent className="w-5 h-5" />
    </Link>
  );
};

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

// Component
const ContactSection: React.FC = () => {
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
  const [showContactInfo, setShowContactInfo] = useState({
    phone: false,
    email: false
  });

  // Event Handlers
  const handleInputChange = (field: keyof ContactFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!recaptchaToken) {
      alert(t("alerts.recaptcha"));
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
        alert(t("alerts.recaptchaFailed"));
        setIsSubmitting(false);
        return;
      }
  
      const formRes = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!formRes.ok) {
        throw new Error("Failed to submit form");
      }
      
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
  
      alert(t("alerts.success"));
    } catch (error) {
      console.error("Form submission error:", error);
      alert(t("alerts.error"));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const revealContact = (type: 'phone' | 'email') => {
    setShowContactInfo(prev => ({ ...prev, [type]: true }));
  };

  // Derived Data
  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      title: t('contactInfo.location'),
      content: t('contactInfo.locationValue'),
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
    },
    {
      icon: MessageSquare,
      title: t('contactInfo.whatsapp'),
      content: showContactInfo.phone ? '+62 856-9339-0636' : t('contactInfo.whatsappReveal'),
      color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
      action: () => revealContact('phone')
    },
    {
      icon: Mail,
      title: t('contactInfo.email'),
      content: showContactInfo.email ? 'habibiahmadaziz@gmail.com' : t('contactInfo.emailReveal'),
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      action: () => revealContact('email')
    },
    {
      icon: Clock,
      title: t('contactInfo.workingHours'),
      content: t('contactInfo.workingHoursValue'),
      color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
    }
  ];

  return (
    <section 
    id="contact" 
    className="
      relative min-h-screen overflow-hidden
      py-28 sm:py-36 lg:py-40
      bg-gray-50 dark:bg-slate-950
    ">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight block bg-gradient-to-r
            from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-5" 
          >
            {t('title')}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-700 dark:text-slate-400">
            {t('description')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact Form - 3 columns */}
          <div className="lg:col-span-3">
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
                          file:px-4 file:py-2 file:mr-4
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
                    <ReCaptcha 
                      siteKey={siteKey}
                      onVerify={(token) => setRecaptchaToken(token)}
                    />
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      reCAPTCHA site key is missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.
                    </p>
                  )}
                    
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !recaptchaToken || !siteKey}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          </div>
          
          {/* Contact Info - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <Card className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 dark:text-white flex items-center gap-3">{t('contactInfo.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <ContactInfoItem key={index} info={info} />
                ))}
              </CardContent>
            </Card>
            
            {/* Social Media */}
            <Card className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 dark:text-white flex items-center gap-3">
                  {t('socialMedia.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLinkItem key={index} social={social} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>     
            {/* Free Consultation CTA */}
            <Card className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-xl shadow-lg">
              <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-800 dark:text-blue-100 text-lg mb-2">
                      {t('consultation.title')} 
                    </h4>
                    <p className="text-blue-600/80 dark:text-blue-200/80 mb-6 leading-relaxed">
                      {t('consultation.description')}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {t('consultation.bookButton')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-slate-800 dark:text-white">{t('consultation.dialog.title')}</DialogTitle>
                          <DialogDescription className="text-slate-600 dark:text-slate-400">
                            {t('consultation.dialog.description')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="text-slate-600 dark:text-slate-400">
                          <p>{t('consultation.dialog.placeholder')}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;