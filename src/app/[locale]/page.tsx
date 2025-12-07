import CursorFollower from "@/components/ui/cursor-follower";
import Navbar from "@/components/ui/navbar/main";
import Hero from "@/components/ui/sections/hero/hero";
import Stats from "@/components/ui/sections/stats/stats";
import About from "@/components/ui/sections/about/about";
import MyService from "@/components/ui/sections/service/service";
import Projects from "@/components/ui/sections/projects/projects";
import Education from "@/components/ui/sections/educations/educations";
import SkillsSection from "@/components/ui/sections/skills/skills";
import CertificationsSection from "@/components/ui/sections/certifications/certifications";
import TestimonialSection from "@/components/ui/sections/testimonials/testimonials";
import ArticlesSection from "@/components/ui/sections/articles/articles";
import ModernFAQSection from "@/components/ui/sections/faqs/faqs";
import ContactSection from "@/components/ui/sections/contacts/contacts";
import Footer from "@/components/ui/footer/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Cursor follower */}
      <CursorFollower />

      <main id="main" role="main">
        <Hero />
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
        <ContactSection />
      </main>
      
      <Footer />
    </>
  );
}