"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlitchText } from "@/components/ui/glitch-text";
import { NodeNetwork } from "@/components/ui/node-network";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnRef1 = useRef<HTMLButtonElement>(null);
  const btnRef2 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([subtitleRef.current, btnRef1.current, btnRef2.current], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={containerRef}
      className="relative py-24 w-full bg-transparent overflow-hidden"
    >
      {/* Node network background (section-level) */}
      <NodeNetwork />

      <div className="relative z-10 w-full max-w-200 mx-auto px-6 md:px-12 text-center">
        {/* Glassmorphic box container */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-black/1.5 dark:bg-white/1.5 p-12 md:p-20 shadow-xl backdrop-blur-md">
          {/* Accent radial glow behind text */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-87.5 h-87.5 bg-red-500/5 blur-[130px] rounded-full -z-10 pointer-events-none" />

          {/* Label */}
          <span className="relative z-10 text-[10px] font-mono tracking-widest text-[#ef4444] dark:text-blue-400 font-semibold uppercase block mb-4">
            // Start a Project
          </span>

          {/* Title with glitch effect */}
          <GlitchText
            as="h2"
            className="relative z-10 text-4xl md:text-5xl font-black mb-6 tracking-tight text-foreground leading-[1.1]"
            interval={5000}
            duration={320}
          >
            Ready to Build?
          </GlitchText>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="relative z-10 text-sm md:text-base text-muted-foreground/80 mb-12 mx-auto leading-relaxed font-medium"
          >
            Let&apos;s work together to bring your digital product concepts to
            life with high-performance frameworks and pristine animated
            interactions.
          </p>

          {/* CTA Buttons — static, no magnetic hover */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              ref={btnRef1}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm shadow-md cursor-pointer select-none"
            >
              Get Free Consultation
            </button>

            <button
              ref={btnRef2}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 text-foreground cursor-pointer select-none transition-colors duration-300"
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
