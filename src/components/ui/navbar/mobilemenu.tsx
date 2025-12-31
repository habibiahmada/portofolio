'use client';

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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "";
      if (!isClosingByLink.current) {
        triggerRef.current?.focus();
      }
      isClosingByLink.current = false;
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Menu */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        className={`fixed top-[72px] left-0 right-0 z-50 lg:hidden
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg
        border-t border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-4 py-6 gap-2">
          <div className="flex justify-end">
            <ThemeSwitcher className="md:hidden" />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="py-2 text-lg hover:text-blue-600 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}