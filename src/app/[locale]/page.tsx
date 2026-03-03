import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import CursorFollower from "@/components/ui/cursor-follower";
import Navbar from "@/components/ui/navbar/main";
import HeroServer from "@/components/ui/sections/hero/hero.server";
import Stats from "@/components/ui/sections/stats/stats";
import About from "@/components/ui/sections/about/about";
import MyService from "@/components/ui/sections/service/service";
import Projects from "@/components/ui/sections/projects/projects";
import { routing } from "@/i18n/routing";
import { generatePageMetadata } from "@/lib/metadata";

// Lazy load below-the-fold sections for better initial load performance
const Education = dynamic(() => import("@/components/ui/sections/educations/educations"));
const SkillsSection = dynamic(() => import("@/components/ui/sections/skills/skills"));
const CertificationsSection = dynamic(() => import("@/components/ui/sections/certifications/certifications"));
const TestimonialSection = dynamic(() => import("@/components/ui/sections/testimonials/testimonials"));
const ArticlesSection = dynamic(() => import("@/components/ui/sections/articles/articles"));
const ModernFAQSection = dynamic(() => import("@/components/ui/sections/faqs/faqs"));
const ContactSection = dynamic(() => import("@/components/ui/sections/contacts/contacts"));
const Footer = dynamic(() => import("@/components/ui/footer/footer"));

// Generate static params for all locale variants
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

// Generate metadata for homepage
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return generatePageMetadata({
    title: t("page.main.title"),
    description: t("page.main.description"),
    image: "/open-graph/og-image.png",
    locale,
    type: "website",
  });
}

export default function Home() {
  return (
    <>
      <Navbar />
      <CursorFollower />

      {/* <main id="main" role="main">
        <HeroServer />
        <Stats />
        <About />
        <MyService />
        <Projects />
        <SkillsSection />
        <Education />
        <CertificationsSection />
        <TestimonialSection />
        <ArticlesSection />
        <ModernFAQSection />
        <ContactSection email={process.env.AUTHORIZED_EMAIL} />
      </main> */}

      <Footer />
    </>
  );
}
