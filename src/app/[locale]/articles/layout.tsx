import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import { getMessages } from "@/lib/getMessages";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations({ locale, namespace: "Metadata.page.articles" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
  };
}


export default async function ProjectsLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) notFound();

  const messages = await getMessages(locale);
  if (!messages) notFound();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <main className="min-h-screen">
        {children}
      </main>
    </NextIntlClientProvider>
  );
}
