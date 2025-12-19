"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Briefcase, Zap } from "lucide-react";
import { Button } from "../../button";
import { Card } from "../../card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import SectionHeader from "../SectionHeader";
import { useTheme } from "next-themes";
import useTestimonials from "@/hooks/api/public/useTestimonials";
import TestimonialCardSkeleton from "./testimonialcardskeleton";

const TestimonialSection = () => {
  const t = useTranslations("testimonials");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  const { testimonials, loading, error } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const nextTestimonial = useCallback(() => {
    if (isAnimating || !testimonials?.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, testimonials?.length]);


  const prevTestimonial = () => {
    if (isAnimating || !testimonials?.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex || !testimonials?.length) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };


  // -------------------------
  // Auto-play interval
  // -------------------------
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => nextTestimonial(), 8000);
    return () => clearInterval(interval);
  }, [nextTestimonial, testimonials]);

  // -------------------------
  // Early return for loading or error
  // -------------------------
  if (!mounted) return null;

  if (loading || !testimonials || testimonials.length === 0 || error) {
    return (
      <section
        id="testimonials"
        className="relative min-h-screen overflow-hidden py-28 sm:py-36 lg:py-40"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20">
            <SectionHeader title={t("titleLine1")} description={t("description1")} align="center" />
          </div>
          <TestimonialCardSkeleton />
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  if (!currentTestimonial) return null;

  // -------------------------
  // Render component
  // -------------------------
  return (
    <section
      id="testimonials"
      className={`relative min-h-screen overflow-hidden py-28 sm:py-36 lg:py-40 transition-colors duration-300 ${isDark ? "dark:bg-slate-950" : "bg-slate-50"
        }`}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-20">
          <SectionHeader title={t("titleLine1")} description={t("description1")} align="center" />
        </div>

        {/* Testimonial Card */}
        <div className="max-w-6xl mx-auto">
          <Card
            className={`relative p-8 lg:p-12 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-700/50 transition-transform duration-300 ${isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
              }`}
          >
            {/* Quote Icon */}
            <div className="absolute -top-4 left-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Content */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: Math.max(0, currentTestimonial.rating ?? 0) }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 font-medium">
                  &quot;{currentTestimonial.testimonial_translations?.[0]?.content}&quot;
                </blockquote>
              </div>

              {/* Client Info */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Image
                        src={currentTestimonial.avatar || ""}
                        alt={currentTestimonial.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-slate-700 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{currentTestimonial.name}</h4>
                      <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {currentTestimonial.role}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{currentTestimonial.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Verified Client
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center mt-12 gap-6">
          <Button
            onClick={prevTestimonial}
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${index === currentIndex
                  ? "bg-blue-600 dark:bg-blue-400 w-8"
                  : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
              />
            ))}
          </div>

          <Button
            onClick={nextTestimonial}
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;