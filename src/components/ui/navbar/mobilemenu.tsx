"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "@/components/theme/theme-toggle";

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  navLinks: NavLink[];
}

interface MobileNavLinkProps extends NavLink {
  onClick: () => void;
}

const MobileNavLink = ({ href, label, onClick }: MobileNavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="block py-2 text-lg hover:text-blue-600 dark:hover:text-blue-400"
  >
    {label}
  </Link>
);

export default function MobileMenu({ navLinks }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isClosingByLink = useRef(false);

  const handleLinkClick = () => {
    isClosingByLink.current = true;
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
      }, 20);
    } else {
      document.body.style.overflow = "";
      if (!isClosingByLink.current) {
        triggerRef.current?.focus();
      }
      isClosingByLink.current = false;
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span className="sr-only">Toggle menu</span>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`fixed top-18 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 transform lg:hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col px-4 py-6">
          <div className="flex justify-end">
            <ThemeSwitcher className="md:hidden" />
          </div>
          {navLinks.map((link) => (
            <MobileNavLink key={link.href} onClick={handleLinkClick} {...link} />
          ))}
        </div>
      </div>
    </>
  );
}