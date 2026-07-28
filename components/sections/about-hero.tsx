"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { GlitchText } from "@/components/ui/glitch-text";
import { NodeNetworkLazy } from "@/components/ui/node-network-lazy";

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const nodeMouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      nodeMouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Parallax: photo floats up as user scrolls
  useEffect(() => {
    if (!photoRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

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

      ctx = { revert: () => { tween.scrollTrigger?.kill(); tween.kill(); } };
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="about-hero"
      ref={containerRef}
      aria-label="About hero"
      className="relative min-h-[90vh] w-full flex flex-col justify-center py-1 4 overflow-hidden"
    >
      {/* Node Network Background Canvas — clustered top-left, mouse coords from hero */}
      <NodeNetworkLazy externalMouseRef={nodeMouseRef} densityBias="topLeft" />

      {/* Background Image positioned on the right */}
      <div
        className="absolute hidden lg:block inset-y-0 right-50 h-full w-full lg:w-[40%] pointer-events-none z-0 opacity-60 dark:opacity-80"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 30%)",
        }}
      >
        <Image
          src="/images/habibiahmada.webp"
          alt="Habibi Ahmad Aziz Background"
          fill
          priority
          draggable={false}
          className="object-cover lg:object-[90%_35%]"
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Main Content: Bold Typography */}
        <div className="lg:col-span-9 max-w-4xl flex flex-col items-start gap-8 lg:self-center z-10 relative">
          {/* Heading — name as identity */}
          <GlitchText
            as="h1"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading font-black tracking-tighter leading-[0.95] select-none text-foreground w-full lg:w-full"
            interval={6000}
            duration={400}
          >
            <span
              className="inline-block"
              style={{ color: "var(--navy-accent-text)" }}
            >
              Habibi
            </span>
            <br />
            <span className="inline-block">Ahmad</span>{" "}
            <span className="inline-block">Aziz</span>
          </GlitchText>

          {/* One-liner description */}
          <p className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed font-medium max-w-2xl mt-4">
            <span className="text-foreground font-semibold">
              Full-Stack Web Developer
            </span>{" "}
            experienced in building responsive apps and CMS products. Skilled in
            crafting end-to-end features using{" "}
            <span
              style={{ color: "var(--navy-accent-text)" }}
              className="font-semibold"
            >
              Next.js, React, Laravel, Node.js,
            </span>{" "}
            and <span className="text-foreground font-semibold">WordPress</span>{" "}
            to deliver production-ready solutions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-8">
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tighter">
                3<span className="text-red-500 dark:text-blue-400">+</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mt-1">
                Years Building
              </div>
            </div>
            <div className="w-px h-12 bg-black/8 dark:bg-white/8" />
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tighter">
                10<span className="text-red-500 dark:text-blue-400">+</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mt-1">
                Projects Shipped
              </div>
            </div>
            <div className="w-px h-12 bg-black/8 dark:bg-white/8" />
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tighter">
                2
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mt-1">
                Awards Won
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
