import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote,  Briefcase, Zap } from 'lucide-react';
import { Button } from '../../button';
import { Card } from '../../card';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "CEO & Founder",
    company: "TechStartup Inc.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    content: "Habibi sangat profesional dan menghasilkan kualitas kerja yang luar biasa. Website yang dia buat untuk startup kami meningkatkan conversion rate hingga 40%. Komunikasi yang sangat baik dan deadline selalu tepat waktu!",
    rating: 5,
    metrics: { increase: "40%", type: "Conversion Rate" },
    industry: "Technology"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    role: "Marketing Director",
    company: "E-commerce Co",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b278?w=80&h=80&fit=crop&crop=face",
    content: "Kerjasama dengan Habibi sangat menyenangkan. Dia memahami kebutuhan bisnis dengan baik dan selalu memberikan solusi terbaik. Platform e-commerce kami sekarang jauh lebih user-friendly dan penjualan meningkat drastis.",
    rating: 5,
    metrics: { increase: "85%", type: "User Engagement" },
    industry: "E-commerce"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Product Manager",
    company: "FinTech Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    content: "Habibi memiliki skill teknis yang excellent dan pemahaman UX yang mendalam. Dashboard analytics yang dia buat sangat intuitif dan membantu tim kami membuat keputusan data-driven dengan lebih efektif.",
    rating: 5,
    metrics: { increase: "60%", type: "Decision Speed" },
    industry: "Financial Technology"
  },
  {
    id: 4,
    name: "Lisa Rodriguez",
    role: "Creative Director", 
    company: "Digital Agency",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    content: "Desain yang dibuat Habibi selalu beyond expectations. Dia tidak hanya fokus pada estetika, tapi juga functionality dan user experience. Portfolio website kami sekarang menjadi conversation starter di setiap client meeting.",
    rating: 5,
    metrics: { increase: "120%", type: "Client Inquiries" },
    industry: "Creative Services"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const t = useTranslations("testimonials");

  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);


  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, nextTestimonial]);



  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
        id="testimonials"
        className="
            relative min-h-screen overflow-hidden
            py-28 sm:py-36 lg:py-40
            dark:bg-slate-950
        "
        >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="block font-extrabold leading-tight 
                     text-4xl sm:text-5xl lg:text-6xl 
                     bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 
                     bg-clip-text text-transparent mb-4 sm:mb-6"
        >
            {t("titleLine1")}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t("description1")}
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-6xl mx-auto">
          <Card className={`relative p-8 lg:p-12 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Quote Icon */}
            <div className="absolute -top-4 left-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Testimonial Content */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 font-medium">
                &quot;{currentTestimonial.content}&quot;
                </blockquote>
              </div>

              {/* Client Info */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Image
                        src={currentTestimonial.avatar}
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
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {currentTestimonial.role}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {currentTestimonial.company}
                      </p>
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
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'bg-blue-600 dark:bg-blue-400 w-8'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
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