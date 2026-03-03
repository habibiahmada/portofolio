'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useCallback, type MouseEvent } from "react";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import ThemeSwitcher from "@/components/theme/theme-toggle";
import MobileMenu from "./mobilemenu";

interface NavbarProps {
  withNavigation?: boolean;
}

const DesktopMenu = ({
  navLinks,
  onNavLinkClick,
}: {
  navLinks: { href: string; label: string }[];
  onNavLinkClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => (
  <div className="hidden lg:flex items-center space-x-8 min-h-6">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={(event) => onNavLinkClick(event, link.href)}
        className="hover:text-blue-600 transition-colors"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default function Navbar({ withNavigation = true }: NavbarProps) {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const onNavLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      return;
    }

    const targetSection = document.querySelector<HTMLElement>(href);
    if (!targetSection) {
      return;
    }

    event.preventDefault();

    const navbarHeight = document.getElementById("header")?.getBoundingClientRect().height ?? 0;
    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.history.replaceState(null, "", href);
    window.scrollTo({ top: Math.max(targetPosition, 0), behavior: "smooth" });
  }, []);

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
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 min-h-18 transition-colors duration-300
        ${
          isScrolled
            ? "bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/40"
            : "bg-white/30 dark:bg-gray-900/30 border-b border-transparent"
        }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between py-4">
        {/* Brand */}
        <Link
          href="#home"
          onClick={(event) => onNavLinkClick(event, "#home")}
          className="text-2xl font-bold text-blue-700 dark:text-blue-600 hover:text-blue-500"
        >
          {t("Header.brand", { default: "habibiahmada" })}
        </Link>

        {withNavigation && <DesktopMenu navLinks={navLinks} onNavLinkClick={onNavLinkClick} />}

        {/* Right controls */}
        <div className="flex items-center gap-1 min-h-9">
          <LanguageSwitcher />
          <ThemeSwitcher className="hidden md:flex" />
          {withNavigation && <MobileMenu navLinks={navLinks} onNavLinkClick={onNavLinkClick} />}
        </div>
      </nav>
    </header>
  );
}
