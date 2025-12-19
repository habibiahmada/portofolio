'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Mail,
  Clock,
  Linkedin,
  Github,
  Instagram,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

// UI Components
import SectionHeader from "../SectionHeader";
import ContactForm, { ContactFormData } from './contactform';

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

// Helper Component for Info Item
const ContactInfoItem: React.FC<{ info: ContactInfo }> = ({ info }) => {
  const IconComponent = info.icon;
  return (
    <div className="flex items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 group">
      <div className={`
        shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center 
        ${info.color} 
        bg-opacity-10 dark:bg-opacity-10
        group-hover:scale-110 transition-transform duration-500 ease-out
      `}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="ml-5 flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {info.title}
        </h4>
        {info.action ? (
          <button
            onClick={info.action}
            className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate w-full flex items-center gap-2 group/btn"
          >
            {info.content}
            <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        ) : (
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-snug">
            {info.content}
          </p>
        )}
        {info.subContent && (
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
             {info.subContent}
           </p>
        )}
      </div>
    </div>
  );
};

const SocialLinkItem: React.FC<{ social: SocialLink }> = ({ social }) => {
  const IconComponent = social.icon;

  return (
    <Link
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex items-center gap-3 px-5 py-3
        bg-white dark:bg-slate-900/80 
        border border-slate-200 dark:border-slate-700
        rounded-xl shadow-sm hover:shadow-md
        transition-all duration-300
        ${social.bgClass} hover:border-transparent
      `}
    >
      <IconComponent className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${social.textClass} transition-colors`} />
      <span className={`font-medium text-slate-700 dark:text-slate-300 ${social.textClass} transition-colors`}>
        {social.label}
      </span>
    </Link>
  );
};


// Component
const ContactSection: React.FC = () => {
  const t = useTranslations("contacts");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // State Management
  const [showContactInfo, setShowContactInfo] = useState({
    phone: false,
    email: false
  });

  const handleFormSubmit = async (formData: ContactFormData) => {
    try {
      // Prepare payload
      const payload: Record<string, unknown> = { ...formData };

      if (formData.attachment) {
        const file = formData.attachment as File;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ""));
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

      // Send request
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Terlalu banyak permintaan", {
            description: "Silakan tunggu sebentar sebelum mengirim pesan lagi.",
          });
          return;
        }
        throw new Error("FAILED");
      }

      toast.success("Pesan terkirim", {
        description: "Terima kasih, pesanmu sudah masuk dan akan dibalas.",
      });

    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Gagal mengirim pesan", {
        description: "Terjadi kesalahan. Coba lagi beberapa saat.",
      });
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
      color: 'text-blue-600 bg-blue-500 dark:text-blue-400 dark:bg-blue-400'
    },
    {
      icon: MessageSquare,
      title: t('contactInfo.whatsapp'),
      content: showContactInfo.phone ? '+62 856-9339-0636' : t('contactInfo.whatsappReveal'),
      color: 'text-green-600 bg-green-500 dark:text-green-400 dark:bg-green-400',
      action: () => revealContact('phone')
    },
    {
      icon: Mail,
      title: t('contactInfo.email'),
      content: showContactInfo.email ? 'habibiahmadaziz@gmail.com' : t('contactInfo.emailReveal'),
      color: 'text-purple-600 bg-purple-500 dark:text-purple-400 dark:bg-purple-400',
      action: () => revealContact('email')
    },
    {
      icon: Clock,
      title: t('contactInfo.workingHours'),
      content: t('contactInfo.workingHoursValue'),
      color: 'text-orange-600 bg-orange-500 dark:text-orange-400 dark:bg-orange-400'
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
            <ContactForm onSubmit={handleFormSubmit} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;