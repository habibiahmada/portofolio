"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlitchText } from "@/components/ui/glitch-text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // Parallax: photo floats up as user scrolls
  useEffect(() => {
    const el = photoRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.7,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="about-hero"
      ref={containerRef}
      aria-label="About hero"
      className="relative min-h-screen w-full flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* Full-width background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-red-500/3 via-blue-500/1 to-transparent pointer-events-none" />

      {/* Massive Background Text */}
      <div className="absolute top-24 left-0 -translate-x-4 md:-translate-x-10 text-[6rem] md:text-[12rem] lg:text-[14rem] font-heading font-black text-foreground/3 leading-none whitespace-nowrap z-0 pointer-events-none select-none">
        ABOUT ME
      </div>

      {/* Subtle radial bg glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-red-500/4 blur-3xl" />
      </div>

      <div className="relative z-10 w-full mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── Left: Bold Typography ── */}
          <div className="w-full lg:w-3/5 space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                Get To Know Me
              </span>
            </motion.div>

            {/* Heading — name as identity */}
            <GlitchText
              as="h1"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading font-black tracking-tighter leading-[0.95] select-none text-foreground"
              interval={6000}
              duration={400}
            >
              <motion.span
                className="inline-block origin-bottom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                style={{ color: "var(--navy-accent-text)" }}
              >
                Habibi
              </motion.span>{" "}
              <motion.span
                className="inline-block origin-bottom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.17, ease: [0.215, 0.61, 0.355, 1] }}
              >
                Ahmad
              </motion.span>
              <br />
              <motion.span
                className="inline-block origin-bottom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: [0.215, 0.61, 0.355, 1] }}
              >
                Aziz
              </motion.span>
            </GlitchText>

            {/* One-liner description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium max-w-lg"
            >
              Full-stack developer crafting high-performance, accessible, and
              beautifully animated web products from concept to deployment.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="flex items-center gap-8 md:gap-12 pt-4"
            >
              <div>
                <div className="text-4xl md:text-5xl font-heading font-black text-foreground mb-1">
                  3<span style={{ color: "var(--navy-accent-text)" }}>+</span>
                </div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                  Years Exploring
                </div>
              </div>
              <div className="w-px h-14 bg-black/10 dark:bg-white/10" />
              <div>
                <div className="text-4xl md:text-5xl font-heading font-black text-foreground mb-1">
                  15<span style={{ color: "var(--navy-accent-text)" }}>+</span>
                </div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                  Digital Works
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <a
                href="#cta"
                className="px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm text-center shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Let&apos;s Collaborate
              </a>
              <a
                href="#about-timeline"
                className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-foreground"
              >
                View Experience
              </a>
            </motion.div>
          </div>

          {/* ── Right: Architectural Photo Frame ── */}
          <div className="w-full lg:w-2/5 relative mt-8 lg:mt-0">
            <motion.div
              ref={photoRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative w-full aspect-3/4 max-w-sm mx-auto lg:ml-auto"
            >
              {/* Offset dark background shape */}
              <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-800 rounded-t-[8rem] rounded-b-2xl transform translate-x-5 translate-y-5 transition-transform duration-500 hover:translate-x-3 hover:translate-y-3" />

              {/* Main Image Frame — Arch Style */}
              <div className="relative h-full w-full rounded-t-[8rem] rounded-b-2xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl shadow-black/20 z-10 group bg-zinc-100 dark:bg-zinc-950">
                <Image
                  src="/images/habibiahmada.webp"
                  alt="Habibi Ahmad Aziz"
                  fill
                  className="object-cover object-center transition-all duration-700 transform group-hover:scale-105"
                  priority
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-red-900/5 dark:bg-blue-900/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Full-width bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
