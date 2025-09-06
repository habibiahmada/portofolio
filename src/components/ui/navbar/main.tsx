"use client";

import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import ThemeSwitcher from "@/components/theme/theme-toggle";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { X, Menu } from "lucide-react";

export default function Navbar() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#home", label: t("Header.nav.home") },
    { href: "#about", label: t("Header.nav.about") },
    { href: "#services", label: t("Header.nav.services") },
    { href: "#projects", label: t("Header.nav.projects") },
    { href: "#experience", label: t("Header.nav.experience") },
    { href: "#testimonials", label: t("Header.nav.testimonials") },
    { href: "#contact", label: t("Header.nav.contact") },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      <header
        id="header"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                  bg-white/30 dark:bg-gray-900/30 
                  backdrop-blur-lg border-b border-white/20 dark:border-gray-800/40"
      >
        <nav className="container mx-auto px-4 flex items-center justify-between py-4">
          {/* Logo / Brand */}
          <div className="text-2xl font-bold">
            <a
              href="#home"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              {t("Header.brand")}
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-primary-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Mobile Menu (animated) */}
      <div
        className={`fixed top-18 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 transform transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 py-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="hover:text-primary-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}