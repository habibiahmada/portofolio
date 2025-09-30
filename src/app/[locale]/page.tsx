'use client';

import { useState, useEffect } from "react";
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


export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Navbar />
      {/* Cursor follower */}
      <div
        className="fixed top-10 left-10 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full pointer-events-none z-50 opacity-50 blur-sm transition-all duration-150 ease-out"
        style={{
          transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
        }}
        aria-hidden="true"
        />

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
    </>
  );
}