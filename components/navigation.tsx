"use client";

import { useEffect, useState } from "react";
import { GlitchText } from "@/components/ui/glitch-text";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// ─── Theme Toggle ─────────────────────────────────────────────────────────

function ThemeToggle() {
  return <AnimatedThemeToggle />;
}

// ─── Nav links ────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#cta" },
  { label: "About", href: "/about" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const pathname = usePathname();

  // ── Periodic subtle glitch on navbar ──
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // ── Scroll-driven background opacity ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu on resize to desktop ──
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Close mobile menu on route change ──
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const getHref = (href: string) => {
    return href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
  };

  return (
    <>
      <header
        role="banner"
        className={`
          fixed top-0 left-0 right-0 w-full z-50
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "bg-white/60 dark:bg-zinc-950/70 backdrop-blur-2xl backdrop-saturate-150 shadow-lg shadow-black/5 dark:shadow-black/40"
              : "bg-white/30 dark:bg-zinc-950/30 backdrop-blur-lg"
          }
          ${glitchActive ? "animate-glitch-skew" : ""}
        `}
      >
        {/* ── Subtle bottom border (no gradient) ── */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
            scrolled ? "bg-black/10 dark:bg-white/10" : "bg-transparent"
          }`}
          aria-hidden="true"
        />

        {/* ── Periodic glitch chromatic overlay ── */}
        {glitchActive && (
          <>
            <div
              className="absolute inset-0 pointer-events-none select-none -z-10"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.04)",
                clipPath: "inset(20% 0 60% 0)",
                transform: "translate(-1px, 1px)",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 pointer-events-none select-none z-10"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.04)",
                clipPath: "inset(60% 0 10% 0)",
                transform: "translate(3px, -1px)",
              }}
              aria-hidden="true"
            />
          </>
        )}

        <nav
          role="navigation"
          aria-label="Main navigation"
          className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 h-18 flex items-center justify-between"
        >
          {/* ── Logo ── */}
          <motion.a
            href={pathname === "/" ? "#hero" : "/"}
            aria-label="Habibi Ahmad — home"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative text-lg md:text-xl font-black tracking-tight text-foreground select-none"
          >
            <GlitchText as="span" interval={5000} duration={320}>
              habibiahmada
              <span className="text-[#ef4444] dark:text-blue-400">.</span>
            </GlitchText>
          </motion.a>

          {/* ── Desktop links — glitch on hover, no active decoration ── */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link, i) => {
              const href = getHref(link.href);

              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1 + i * 0.06,
                    ease: "easeOut",
                  }}
                  className="nav-link-wrapper"
                >
                  <a
                    href={href}
                    data-text={link.label}
                    className="block px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.18em] nav-link"
                  >
                    {link.label}
                  </a>
                </motion.li>
              );
            })}
          </ul>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.a
              href="mailto:contact@habibiahmada.dev"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="hidden md:inline-flex items-center justify-center px-5 py-2 text-xs font-mono font-bold uppercase tracking-[0.15em] rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 shadow-md hover:bg-[#ef4444] dark:hover:bg-blue-400 hover:text-white dark:hover:text-zinc-950 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.04] active:scale-[0.96]"
            >
              Let&apos;s Talk
            </motion.a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className={`
                md:hidden relative w-9 h-9 flex items-center justify-center
                rounded-xl border transition-all duration-300
                ${
                  mobileOpen
                    ? "border-red-500/30 dark:border-blue-400/30 bg-red-500/10 dark:bg-blue-400/10"
                    : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
                }
              `}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <X
                      size={15}
                      strokeWidth={1.75}
                      className="text-[#ef4444] dark:text-blue-400"
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute text-foreground/70"
                  >
                    <Menu size={15} strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* ── Mobile menu — clean, no decorations ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              className="md:hidden overflow-hidden relative z-20"
            >
              <div className="px-6 py-8 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const href = getHref(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.07,
                        duration: 0.4,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                    >
                      <a
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        data-text={link.label}
                        className="block px-4 py-3 text-base font-mono font-bold uppercase tracking-[0.2em] text-foreground/50 nav-link"
                      >
                        <span className="flex items-center">
                          <span>{link.label}</span>
                        </span>
                      </a>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: NAV_LINKS.length * 0.07,
                    duration: 0.4,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="pt-4"
                >
                  <a
                    href="mailto:contact@habibiahmada.dev"
                    className="flex w-full items-center justify-center py-3 text-sm font-mono font-bold uppercase tracking-[0.2em] rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-center shadow-lg active:scale-[0.98] transition-all duration-300"
                  >
                    Let&apos;s Talk
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Spacer for fixed navbar ── */}
      <div className="h-18" aria-hidden="true" />
    </>
  );
}
