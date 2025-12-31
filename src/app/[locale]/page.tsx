import dynamic from "next/dynamic";
import CursorFollower from "@/components/ui/cursor-follower";
import Navbar from "@/components/ui/navbar/main";
import HeroServer from "@/components/ui/sections/hero/hero.server";
import Stats from "@/components/ui/sections/stats/stats";
import About from "@/components/ui/sections/about/about";
import MyService from "@/components/ui/sections/service/service";
import Projects from "@/components/ui/sections/projects/projects";

// Lazy load below-the-fold sections for better initial load performance
const Education = dynamic(() => import("@/components/ui/sections/educations/educations"));
const SkillsSection = dynamic(() => import("@/components/ui/sections/skills/skills"));
const CertificationsSection = dynamic(() => import("@/components/ui/sections/certifications/certifications"));
const TestimonialSection = dynamic(() => import("@/components/ui/sections/testimonials/testimonials"));
const ArticlesSection = dynamic(() => import("@/components/ui/sections/articles/articles"));
const ModernFAQSection = dynamic(() => import("@/components/ui/sections/faqs/faqs"));
const ContactSection = dynamic(() => import("@/components/ui/sections/contacts/contacts"));
const Footer = dynamic(() => import("@/components/ui/footer/footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <CursorFollower />

      <main id="main" role="main">
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
      </main>

      <Footer />
    </>
  );
}
