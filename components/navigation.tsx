"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  return <AnimatedThemeToggle />;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
] as const;

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
        `}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
            scrolled ? "bg-black/10 dark:bg-white/10" : "bg-transparent"
          }`}
          aria-hidden="true"
        />

        <nav
          role="navigation"
          aria-label="Main navigation"
          className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-18 flex items-center justify-between"
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Link
              href="/"
              aria-label="Habibi Ahmad — home"
              className="relative text-lg md:text-xl font-black tracking-tight text-foreground select-none"
            >
              habibiahmada
              <span className="text-brand">.</span>
            </Link>
          </motion.div>

          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link, i) => {
              const active = linkActive(pathname, link.href);
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
                  <Link
                    href={link.href}
                    data-text={link.label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.18em] nav-link",
                      active && "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.a
              href="mailto:contact@habibiahmada.dev"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="hidden md:inline-flex items-center justify-center px-5 py-2 text-xs font-mono font-bold uppercase tracking-[0.15em] rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 shadow-md hover:bg-brand hover:text-white dark:hover:text-zinc-950 hover:shadow-lg hover:shadow-brand/10 transition-all duration-300 hover:scale-[1.04] active:scale-[0.96]"
            >
              Let&apos;s Talk
            </motion.a>

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
                    ? "border-brand/30 bg-brand/10"
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
                    <X size={15} strokeWidth={1.75} className="text-brand" />
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
                  const active = linkActive(pathname, link.href);
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
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        data-text={link.label}
                        aria-current={active ? "page" : undefined}
                        className="block px-4 py-3 text-base font-mono font-bold uppercase tracking-[0.2em] text-foreground/50 nav-link"
                      >
                        <span className="flex items-center">
                          <span>{link.label}</span>
                        </span>
                      </Link>
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

      <div className="h-18" aria-hidden="true" />
    </>
  );
}
