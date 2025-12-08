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
  MessageSquare
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import SectionHeader from "../SectionHeader";

// Modular Components
import ContactForm, { ContactFormData } from './contactform';
import Consultation from './consultation';
import { useTheme } from 'next-themes';

// Types and Interfaces
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

const SOCIAL_LINKS: SocialLink[] = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/habibi-ahmad-aziz', color: 'hover:bg-blue-600' },
  { icon: Github, href: 'https://www.github.com/habibiahmada', color: 'hover:bg-slate-700' },
  { icon: Instagram, href: 'https://www.instagram.com/habibiahmad.a/', color: 'hover:bg-pink-600' }
];

// Helper Components
const ContactInfoItem: React.FC<{ info: ContactInfo }> = ({ info }) => {
  const IconComponent = info.icon;
  return (
    <div className="flex items-start space-x-4 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold dark:text-white mb-1">{info.title}</h4>
                        {info.action ? (
                          <button
                            onClick={info.action}
                            className="text-blue-400 hover:text-blue-300 text-left cursor-pointer"
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
        hover:scale-110 hover:text-white
        ${social.color} 
        bg-slate-100 border-slate-300 text-slate-600 
        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400
        transition-transform duration-300
      `}
    >
      <IconComponent className="w-5 h-5" />
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

  // Event Handlers
  const handleFormSubmit = async (formData: ContactFormData) => {
    // If there is an attachment, convert it to base64 so server can receive it in JSON.
    const payload: Record<string, unknown> = { ...formData };
    if (formData.attachment) {
      try {
        const file = formData.attachment as File;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ""));
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });
        payload.attachment = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
        };
      } catch (e: unknown) {
        console.error("Failed to read attachment", e instanceof Error ? e.message : String(e));
      }
    }

    const formRes = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (!formRes.ok) {
      throw new Error("Failed to submit form");
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
    py-16 sm:py-24 lg:py-32 transition-colors duration-300
    ${isDark ? "bg-slate-950" : "bg-gray-50"}
  `}
>
  {/* Background Effects */}
  <div className="absolute inset-0">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-slate-500/10 rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Header */}
    <div className="mb-12 sm:mb-16 lg:mb-20">
      <SectionHeader
        title={t('title')}
        description={t('description')}
        align="center"
      />
    </div>
    
    {/* Grid layout */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
      {/* Contact Form */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        <ContactForm onSubmit={handleFormSubmit} />
      </div>
      
      {/* Contact Info & Social */}
      <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-1 lg:order-2">
        {/* Contact Information */}
        <Card className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-slate-800 dark:text-white flex items-center gap-3">
              {t('contactInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {contactInfo.map((info, index) => (
              <ContactInfoItem key={index} info={info} />
            ))}
          </CardContent>
        </Card>
        
        {/* Social Media */}
        <Card className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-slate-800 dark:text-white flex items-center gap-3">
              {t('socialMedia.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {SOCIAL_LINKS.map((social, index) => (
                <SocialLinkItem key={index} social={social} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>     

        {/* Free Consultation CTA */}
        <Consultation />
      </div>
    </div>
  </div>
</section>

  );
};

export default ContactSection;