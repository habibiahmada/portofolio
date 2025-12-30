import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import { Providers } from './providers';
import { getMessages } from '@/lib/getMessages';
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";
import Script from 'next/script';

import { getTranslations } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      shortcut: "/favicon-96x96.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: t('openGraph.title'),
      description: t('openGraph.description'),
      siteName: t('openGraph.siteName'),
      url: process.env.NEXT_PUBLIC_APP_URL,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t('openGraph.imageAlt'),
        }
      ],
      locale,
      type: 'website',
    },
    twitter: {
      title: t('twitter.title'),
      description: t('twitter.description'),
      card: 'summary_large_image',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t('twitter.imageAlt'),
        }
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: ['Habibi Ahmad', 'Web Developer', 'Fullstack Developer', 'Software Engineer', 'Coding Camp', 'Coding', 'Habibi Ahmad Aziz', 'SMKN 1 Karawang', 'Habibi Ahmad Aziz SMKN 1 Karawang', 'Habibi Ahmad SMKN 1 Karawang', 'Siswa SMKN 1 Karawang', 'Siswa Coding Camp', 'PPLG', 'RPL', 'Siswa PPLG', 'Siswa RPL', 'PPLG SMKN 1 Karawang', 'RPL SMKN 1 Karawang'],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  if (!messages) {
    console.error(`Messages not found for locale: ${locale}`);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY ? (
          <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY}`}
            strategy="beforeInteractive"
          />
        ) : null}
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
            <Analytics />
            <Toaster position="top-center" richColors />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
