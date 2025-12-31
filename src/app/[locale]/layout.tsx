import "./globals.css";
import { Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import { Providers } from "./providers";
import { getMessages } from "@/lib/getMessages";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import Script from "next/script";
import { getTranslations } from "next-intl/server";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-outfit",

  // 🔥 penting untuk Lighthouse
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

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      shortcut: "/icon/favicon-96x96.png",
      apple: "/icon/apple-touch-icon.png",
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
      "Habibi Ahmad",
      "Web Developer",
      "Fullstack Developer",
      "Software Engineer",
      "Coding Camp",
      "PPLG",
      "RPL",
      "SMKN 1 Karawang",
      "Habibi Ahmad Aziz",
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
      <head>
        {/* Recaptcha – non blocking */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}
        <link
          rel="preload"
          as="image"
          href="/images/self-photo-habibi-ahmad-aziz.webp"
          fetchPriority="high"
          type="image/webp"
        />
      </head>

      <body
        className={`${outfit.variable} font-sans antialiased bg-background`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen">
              {children}
            </main>
            <Analytics />
            <Toaster position="top-center" richColors />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
