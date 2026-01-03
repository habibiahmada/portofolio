"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../button";

import { Testimonial } from "@/lib/types/database";
import TestimonialCard from "./testimonialcard";

interface Props {
  testimonials: Testimonial[];
}

const AUTOPLAY_DELAY = 8000;
const ANIMATION_DURATION = 300;

const TestimonialCarousel: React.FC<Props> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  /* =========================
     Animation cleanup helper
  ========================= */
  const clearAnimationTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  /* =========================
     Slide changer
  ========================= */
  const changeSlide = useCallback(
    (nextIndex: number) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setCurrentIndex(nextIndex);

      clearAnimationTimeout();
      timeoutRef.current = setTimeout(
        () => setIsAnimating(false),
        ANIMATION_DURATION
      );
    },
    [isAnimating]
  );

  /* =========================
     Controls
  ========================= */
  const next = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % testimonials.length);

    clearAnimationTimeout();
    timeoutRef.current = setTimeout(
      () => setIsAnimating(false),
      ANIMATION_DURATION
    );
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );

    clearAnimationTimeout();
    timeoutRef.current = setTimeout(
      () => setIsAnimating(false),
      ANIMATION_DURATION
    );
  }, [testimonials.length]);

  /* =========================
     Autoplay
  ========================= */
  useEffect(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      next();
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      clearAnimationTimeout();
    };
  }, [next]);

  if (!testimonials.length) return null;

  return (
    <>
      <TestimonialCard
        testimonial={testimonials[currentIndex]}
        isAnimating={isAnimating}
      />

      <div className="mt-12 flex items-center justify-center gap-6">
        <Button variant="ghost" size="icon" onClick={prev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              className={`h-3 w-3 rounded-full transition ${
                i === currentIndex
                  ? "bg-blue-600"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <Button variant="ghost" size="icon" onClick={next}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default TestimonialCarousel;