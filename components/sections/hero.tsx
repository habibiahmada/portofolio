"use client";

import { useEffect, useRef, useState } from "react";
import { GlitchText } from "@/components/ui/glitch-text";
import { NodeNetwork } from "@/components/ui/node-network";
import { CvModal } from "@/components/ui/cv-modal";
import Image from "next/image";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const nodeMouseRef = useRef<{ x: number; y: number; active: boolean } | null>({
    x: 0,
    y: 0,
    active: false,
  });
  const [cvOpen, setCvOpen] = useState(false);

  // Track mouse coordinates for spotlight + node network
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update spotlight
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty("--mouse-x", `${x}px`);
      spotlightRef.current.style.setProperty("--mouse-y", `${y}px`);
    }

    // Update node network cursor position
    if (nodeMouseRef.current) {
      nodeMouseRef.current.x = x;
      nodeMouseRef.current.y = y;
      nodeMouseRef.current.active = true;
    }
  };

  const handleMouseLeave = () => {
    if (nodeMouseRef.current) {
      nodeMouseRef.current.active = false;
    }
  };

  const headingText = "Building digital experiences that actually matter";
  const words = headingText.split(" ");

  // ── Auth error from ?error= query param ──
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      setAuthError(decodeURIComponent(err));
      // Clean URL after reading
      window.history.replaceState(null, "", window.location.pathname);
      // Auto-dismiss
      const t = setTimeout(() => setAuthError(null), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero section"
      className="relative w-full px-24 flex flex-col pt-24 h-[90vh] pb-24 overflow-hidden group/hero"
    >
      {/* Node Network Background Canvas — clustered top-left, mouse coords from hero */}
      <NodeNetwork externalMouseRef={nodeMouseRef} densityBias="topLeft" />

      {/* Background Image positioned on the right */}
      <div
        className="absolute hidden lg:block inset-y-0 right-40 h-full w-full lg:w-[40%] pointer-events-none z-0 opacity-60"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 30%)",
        }}
      >
        <Image
          src="/images/glitch-hero.webp"
          alt="Hero Background"
          fill
          priority
          draggable={false}
          className="object-cover lg:object-[80%_35%]"
        />
      </div>

      {/* Full-width background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-red-500/3 via-blue-500/1 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Main Content: Cinematic Copywriting */}
        <div className="lg:col-span-9 max-w-3xl flex flex-col items-start gap-8 lg:self-center z-10 relative">
          {/* Auth error banner */}
          {authError && (
            <div className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 dark:border-red-500/25 text-xs text-red-600 dark:text-red-400 font-mono">
              {authError}
            </div>
          )}

          {/* Tagline */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              available for create big impacts
            </span>
          </div>

          {/* Heading with Glitch Effect */}
          <GlitchText
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.08] select-none text-foreground"
            interval={5000}
            duration={400}
          >
            {words.map((word, i) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
              const isAccent =
                cleanWord === "experiences" || cleanWord === "matter";
              return (
                <span
                  key={i}
                  className="inline-block mr-[0.2em]"
                  style={
                    isAccent ? { color: "var(--navy-accent-text)" } : undefined
                  }
                >
                  {word}
                </span>
              );
            })}
          </GlitchText>

          {/* Sub description */}
          <p
            className="text-base md:text-lg text-muted-foreground/80 l leading-relaxed font-medium"
          >
            Full-stack developer crafting high-performance, accessible, and
            beautifully animated web products from concept to deployment.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2"
          >
            <a
              href="#projects"
              aria-label="View my projects"
              className="px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm text-center shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              View My Work
            </a>
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              aria-label="View CV"
              className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-foreground cursor-pointer"
            >
              View CV
            </button>
          </div>
        </div>
      </div>

      {/* Full-width bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />

      {/* ── CV Modal ── */}
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  );
}
