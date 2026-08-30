"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Copy, Check } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";
import { NodeNetworkLazy } from "@/components/ui/node-network-lazy";
import Image from "next/image";

function TerminalCopyBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = command;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [command]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : `Copy ${command}`}
      className="group flex w-full sm:flex-1 min-w-0 items-center justify-between gap-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 px-3 py-2.5 font-mono text-xs sm:text-sm text-muted-foreground hover:border-black/20 dark:hover:border-white/20 hover:text-foreground transition-all duration-200 cursor-pointer"
    >
      <code className="truncate text-left">
        <span className="text-brand/80 select-none">$ </span>
        {command}
      </code>
      <span className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </span>
    </button>
  );
}

const CvModal = dynamic(
  () => import("@/components/ui/cv-modal").then((m) => m.CvModal),
  { ssr: false },
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const nodeMouseRef = useRef<{ x: number; y: number; active: boolean } | null>(
    {
      x: 0,
      y: 0,
      active: false,
    },
  );
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

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero section"
      className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col pt-20 pb-12 md:pt-24 md:pb-24 min-h-[90vh] overflow-hidden group/hero"
    >
      {/* Node Network Background Canvas , clustered top-left, mouse coords from hero */}
      <NodeNetworkLazy externalMouseRef={nodeMouseRef} densityBias="topLeft" />

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
          sizes="(max-width: 1024px) 0px, 40vw"
          className="object-cover lg:object-[80%_35%]"
        />
      </div>

      {/* Full-width background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-red-500/3 via-blue-500/1 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">
        {/* Main Content: Cinematic Copywriting */}
        <div className="lg:col-span-9 max-w-3xl flex flex-col items-start gap-6 sm:gap-8 lg:self-center z-10 relative">
          {/* Tagline */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 max-w-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest text-muted-foreground uppercase">
              Open to freelance & full-time · Remote (WIB)
            </span>
          </div>

          {/* Heading with Glitch Effect */}
          <GlitchText
            as="h1"
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.08] select-none text-foreground"
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
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
            Frontend-leaning full-stack developer. I craft clear interfaces and the
            APIs behind them, with a bias for performance you can measure, not just
            claim.
          </p>

          {/* Terminal commands */}
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground/70">
              Try in your terminal
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <TerminalCopyBlock command="npx habibiahmada" />
              <TerminalCopyBlock command="ssh habibiahmada.dev" />
            </div>
          </div>

          {/* CTA buttons: primary contact, secondary work */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <a
              href="mailto:contact@habibiahmada.dev"
              aria-label="Email Habibi to collaborate"
              className="px-8 py-3.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold text-sm text-center shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Let&apos;s Talk
            </a>
            <a
              href="/projects"
              aria-label="View my projects"
              className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/2 dark:bg-white/2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-foreground"
            >
              View My Work
            </a>
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              aria-label="View CV"
              className="px-8 py-3.5 rounded-full font-bold text-sm text-center border border-transparent hover:border-black/10 dark:hover:border-white/10 text-muted-foreground hover:text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              View CV
            </button>
          </div>
        </div>
      </div>

      {/* Full-width bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />

      {/* CV Modal , code-split; only mount after first open */}
      {cvOpen ? (
        <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
      ) : null}
    </section>
  );
}
