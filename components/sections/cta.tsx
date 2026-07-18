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
  const btnRef1 = useRef<HTMLAnchorElement>(null);
  const btnRef2 = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!subtitleRef.current || !btnRef1.current || !btnRef2.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [subtitleRef.current, btnRef1.current, btnRef2.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    // Refresh scroll triggers to ensure correct measurement after mounting
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

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

          {/* Title with glitch effect */}
          <h2 className="relative z-10 text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-foreground">
            Have a{" "}
            <GlitchText
              words={["project", "vision", "dream"]}
              className="text-red-500 dark:text-blue-500 font-black inline-block px-1"
              interval={4000}
              duration={300}
            />
            <br />
            in mind?
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="relative z-10 text-base md:text-lg text-muted-foreground/90 mb-10 mx-auto max-w-xl leading-relaxed font-normal"
          >
            Let&apos;s collaborate to turn your concepts into clean, high-performing digital realities. Reach out today and let&apos;s make it happen!
          </p>

          {/* CTA Buttons — static, no magnetic hover */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              ref={btnRef1}
              href="mailto:contact@habibiahmada.dev"
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-opacity cursor-pointer select-none text-center"
            >
              Send a Message
            </a>

            <a
              ref={btnRef2}
              href="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 text-foreground cursor-pointer select-none transition-colors duration-300 text-center"
              target="_blank"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
