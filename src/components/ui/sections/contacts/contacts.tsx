'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Mail,
  Clock,
  MessageSquare,
  Linkedin,
  Github,
  Instagram
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

// UI Components
import SectionHeader from "../SectionHeader";
import ContactForm from './contactform';
import useContact, { ContactFormData } from "@/hooks/api/public/useContact";
import SocialLinkItem from './sociallinkitem';
import ContactInfoItem from './contactinfoitem';

// Types and Interfaces
interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  subContent?: string;
  color: string;
  action?: () => void;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  bgClass: string;
  textClass: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/habibi-ahmad-aziz',
    label: 'LinkedIn',
    bgClass: 'hover:bg-[#0077b5]',
    textClass: 'group-hover:text-white'
  },
  {
    icon: Github,
    href: 'https://www.github.com/habibiahmada',
    label: 'GitHub',
    bgClass: 'hover:bg-[#333]',
    textClass: 'group-hover:text-white'
  },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/habibiahmad.a/',
    label: 'Instagram',
    bgClass: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]',
    textClass: 'group-hover:text-white'
  }
];

// Component
interface ContactSectionProps {
  email?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ email }) => {
  const t = useTranslations("contacts");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // State Management
  const [showContactInfo, setShowContactInfo] = useState({
    phone: false,
    email: false
  });

  const { submitContact, loading } = useContact();

  const handleFormSubmit = async (formData: ContactFormData) => {
    try {
      await submitContact(formData);
      toast.success('Pesan terkirim', {
        description: 'Terima kasih, pesanmu sudah masuk.',
      });
    } catch (e) {
      if ((e as Error).message === 'TOO_MANY_REQUESTS') {
        toast.error('Terlalu banyak permintaan');
      } else {
        toast.error('Gagal mengirim pesan');
      }
      throw e;
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
      subContent: 'Indonesia',
      color: 'text-blue-600 bg-blue-500 dark:text-blue-200 dark:bg-blue-400'
    },
    {
      icon: MessageSquare,
      title: t('contactInfo.whatsapp'),
      content: showContactInfo.phone ? '+62 856-9339-0636' : t('contactInfo.whatsappReveal'),
      color: 'text-green-600 bg-green-500 dark:text-green-200 dark:bg-green-400',
      action: () => revealContact('phone')
    },
    {
      icon: Mail,
      title: t('contactInfo.email'),
      content: showContactInfo.email ? (email || 'habibi.ahmada@gmail.com') : t('contactInfo.emailReveal'),
      color: 'text-purple-600 bg-purple-500 dark:text-purple-200 dark:bg-purple-400',
      action: () => revealContact('email')
    },
    {
      icon: Clock,
      title: t('contactInfo.workingHours'),
      content: t('contactInfo.workingHoursValue'),
      color: 'text-orange-600 bg-orange-500 dark:text-orange-200 dark:bg-orange-400'
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      id="contact"
      className={`
        relative overflow-hidden
        py-20 lg:py-32 transition-colors duration-500
        ${isDark ? "bg-slate-950" : "bg-white"}
      `}
    >
      {/* Modern Gradient Backgrounds - More subtle and larger */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-blue-400/5 dark:bg-blue-600/10 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/5 dark:bg-purple-600/10 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 dark:bg-emerald-600/10 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header - More space below */}
        <div className="mb-16 lg:mb-24">
          <SectionHeader
            title={t('title')}
            description={t('description')}
            align="center"
          />
        </div>

        {/* Layout Grid - Updated Proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Contact Info & Socials (4 cols) */}
          <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">

            {/* Intro Text for Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('contactInfo.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Feel free to reach out for collaborations, questions, or just a friendly hello. I usually respond within a few hours.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <ContactInfoItem key={index} info={info} />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

            {/* Social Media - Expanded Look */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('socialMedia.title')}
              </h3>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social, index) => (
                  <SocialLinkItem key={index} social={social} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) - Giving form more prominence */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <ContactForm onSubmit={handleFormSubmit} loading={loading} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;