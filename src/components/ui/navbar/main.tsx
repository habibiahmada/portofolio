import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import ThemeSwitcher from "@/components/theme/theme-toggle";
import MobileMenu from "./mobilemenu";

export default function Navbar() {
  const t = useTranslations();

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
    <header
      id="header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                 bg-white/30 dark:bg-gray-900/30 
                 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/40"
    >
      <nav className="container mx-auto px-4 flex items-center justify-between py-4">
        {/* Brand */}
        <div className="text-2xl font-bold">
          <Link
            href="#home"
            className="text-blue-700 dark:text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
          >
            {t("Header.brand")}
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <MobileMenu navLinks={navLinks} />
        </div>
      </nav>
    </header>
  );
}