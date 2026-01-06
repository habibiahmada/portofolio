import "./globals.css";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import { Providers } from "./providers";
import { getMessages } from "@/lib/getMessages";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { getTranslations } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-outfit",

  // penting untuk Lighthouse
  adjustFontFallback: true,
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: t("page.main.title"),
    description: t("page.main.description"),

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      shortcut: "/icons/favicon-96x96.png",
      apple: "/icons/apple-touch-icon.png",
    },

    openGraph: {
      title: t("openGraph.title"),
      description: t("openGraph.description"),
      siteName: t("openGraph.siteName"),
      url: baseUrl,
      type: "website",
      locale,
      images: [
        {
          url: "/open-graph/og-image.png",
          width: 1200,
          height: 630,
          alt: t("openGraph.imageAlt"),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      images: [
        {
          url: "/open-graph/og-image.png",
          width: 1200,
          height: 630,
          alt: t("twitter.imageAlt"),
        },
      ],
    },

    alternates: {
      canonical: `${baseUrl}/${locale}`,
    },

    robots: {
      index: true,
      follow: true,
    },

    keywords: [
      "Habibi Ahmad Aziz",
      "Web Developer",
      "Fullstack Developer",
      "Software Engineer",
      "Coding Camp",
      "PPLG",
      "RPL",
      "SMKN 1 Karawang",
      "Habibi Ahmad Aziz",
      "habibiahmada",
      "habibiahmadaziz",
      "HabibiAhmad",
      "HabibiAhmadAziz",
      "Siswa SMKN 1 Karawang",
      "Siswa PPLG",
      "Siswa RPL",
      "Siswa SMK",
      "Siswa"
    ],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) notFound();

  const messages = await getMessages(locale);
  if (!messages) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${inter.className} font-sans antialiased bg-background`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen">
              {children}
            </main>
            {process.env.NODE_ENV === 'production' && <Analytics />}
            <Toaster position="top-center" richColors />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
