'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import ThemeSwitcher from "@/components/theme/theme-toggle";
import MobileMenu from "./mobilemenu";

interface NavbarProps {
  withNavigation?: boolean;
}

const DesktopMenu = ({ navLinks }: { navLinks: { href: string; label: string }[] }) => (
  <div className="hidden lg:flex items-center space-x-8">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="hover:text-blue-600 cursor-pointer"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default function Navbar({ withNavigation = true }: NavbarProps) {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = useMemo(
    () => [
      { href: "#home", label: t("Header.nav.home", { default: "Home" }) },
      { href: "#about", label: t("Header.nav.about", { default: "About" }) },
      { href: "#services", label: t("Header.nav.services", { default: "Services" }) },
      { href: "#projects", label: t("Header.nav.projects", { default: "Projects" }) },
      { href: "#experience", label: t("Header.nav.experience", { default: "Experience" }) },
      { href: "#testimonials", label: t("Header.nav.testimonials", { default: "Testimonials" }) },
      { href: "#contact", label: t("Header.nav.contact", { default: "Contact" }) },
    ],
    [t]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/40"
          : "bg-white/30 dark:bg-gray-900/30 border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between py-4">
        {/* Brand */}
        <div className="text-2xl font-bold">
          <Link
            href="#home"
            className="text-blue-700 dark:text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            {t("Header.brand", { default: "habibiahmada" })}
          </Link>
        </div>

        {/* Desktop Menu - hanya kalau withNavigation true */}
        {withNavigation && (
          <DesktopMenu navLinks={navLinks} />
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-1">
          <LanguageSwitcher />
          <ThemeSwitcher className="hidden md:flex" />
          {withNavigation && <MobileMenu navLinks={navLinks} />}
        </div>
      </nav>
    </header>
  );
}
