import Navbar from "@/components/ui/navbar/main";
import Footer from "@/components/ui/footer/footer";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getAllArticles } from "@/services/api/public/articles";
import { routing } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/metadata";
import ArticlesClient from "./articles-client";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Generate static params for all locale variants
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

// Generate metadata for articles listing page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });

  return generatePageMetadata({
    title: `${t("titleLine1")} ${t("titleHighlight")}`,
    description: t("description1"),
    image: "/open-graph/og-image.png",
    locale,
    type: "website",
  });
}

export default async function ArticlesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const t = await getTranslations("articles");

  // Fetch articles at build time
  const articles = await getAllArticles(locale);

  return (
    <>
      <Navbar withNavigation={false} />
      <main className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative">
            <div className="max-w-3xl">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">{t('breadcrumb.home')}</BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    <BreadcrumbPage>{t('breadcrumb.articles')}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                {t('titleLine1')}{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600">
                  {t('titleHighlight')}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('description1')}
              </p>
            </div>
          </div>
        </section>

        {/* Client-side filtering and rendering */}
        <ArticlesClient articles={articles} locale={locale} />
      </main>
      <Footer />
    </>
  );
}
