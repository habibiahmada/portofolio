import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import { Providers } from './providers';
import { getMessages } from '@/lib/getMessages';
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata = {
  title: "Habibi Ahmad Aziz | Portofolio",
  description: "My personal portfolio website",
  openGraph: {
    title: "Habibi Ahmad Aziz | Portofolio",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
};

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
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
