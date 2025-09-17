'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  MapPin, 
  Mail, 
  Clock, 
  Linkedin,
  Github,
  Twitter,
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


// Component
const ContactSection: React.FC = () => {
  const t = useTranslations("contacts");
  
  // State Management
  const [showContactInfo, setShowContactInfo] = useState({
    phone: false,
    email: false
  });

  // Event Handlers
  const handleFormSubmit = async (formData: ContactFormData) => {
    const formRes = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(formData),
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
        <div className="mb-20">
          <SectionHeader
            title={t('title')}
            description={t('description')}
            align="center"
          />
        </div>
        
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact Form - 3 columns */}
          <div className="lg:col-span-3">
            <ContactForm onSubmit={handleFormSubmit} />
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
            <Consultation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;