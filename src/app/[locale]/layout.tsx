import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import { Providers } from './providers';
import { getMessages } from '@/lib/getMessages';

type Props = {
  children: React.ReactNode;
  params: { locale: string }; 
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
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)){
    notFound();
  }

  const messages = await getMessages(locale);
  if (!messages) notFound();

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
