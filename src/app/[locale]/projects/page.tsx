import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import Footer from "@/components/ui/footer/footer";
import PortalCard from "@/components/ui/sections/projects/portalcard";
import Navbar from "@/components/ui/navbar/main";
import { getAllProjects, ProjectData } from "@/services/api/public/projects";
import { routing } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/metadata";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProjectsClient from "./projects-client";

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

// Generate metadata for projects page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return generatePageMetadata({
    title: `${t("allTitle1")} ${t("allTitle2")}`,
    description: t("allDescription"),
    image: "/open-graph/og-image.png",
    locale,
    type: "website",
  });
}

export default async function ProjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const t = await getTranslations("projects");

  // Fetch projects at build time
  const projects = await getAllProjects(locale);

  return (
    <>
      <Navbar withNavigation={false} />

      <main className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200 overflow-x-hidden transition-colors duration-300">
        {/* ================= HERO / HEADER ================= */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative">
            <div className="max-w-3xl">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      {t("breadcrumb.home")}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {t("breadcrumb.projects")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                {t("allTitle1")}{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-cyan-500">
                  {t("allTitle2")}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                {t("allDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* Client-side filtering and rendering */}
        <ProjectsClient projects={projects} />
      </main>

      <Footer />
    </>
  );
}
