"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import SectionHeader from "../SectionHeader";
import useTestimonials from "@/hooks/api/public/useTestimonials";
import TestimonialCarousel from "./testimonialcarousel";
import TestimonialCardSkeleton from "./testimonialcardskeleton";

const TestimonialSection = () => {
  const t = useTranslations("testimonials");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  const { testimonials, loading, error } = useTestimonials();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section
      id="testimonials"
      className={`relative py-24 transition-colors ${
        isDark ? "dark:bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-20">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        {loading || error || testimonials.length === 0 ? (
          <TestimonialCardSkeleton />
        ) : (
          <TestimonialCarousel testimonials={testimonials} />
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
