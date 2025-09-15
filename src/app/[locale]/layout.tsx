import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import { Providers } from './providers';
import { getMessages } from '@/lib/getMessages';

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
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function LocaleLayout({ children, params }: Props) {
  // Await params untuk Next.js 15 compatibility
  const { locale } = await params;

  // Validasi locale
  if (!routing.locales.includes(locale as Locale)){
    notFound();
  }

  // Load messages untuk locale yang valid
  const messages = await getMessages(locale);
  if (!messages) {
    console.error(`Messages not found for locale: ${locale}`);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
