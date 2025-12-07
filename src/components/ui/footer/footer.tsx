"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import ThemeSwitcher from "@/components/theme/theme-toggle";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Footer");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <footer
      className={`py-16 ${
        isDark ? "bg-black text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("brandName")}
            </h3>
            <p
              className={`mb-6 leading-relaxed max-w-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("brandDesc")}
            </p>

            {/* Socials */}
            <div className="flex space-x-4">
              {[Linkedin, Github, Twitter, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className={`p-2 rounded-lg ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("quickLinks")}
            </h4>
            <ul className={`${isDark ? "text-gray-400" : "text-gray-600"} space-y-2`}>
              <li>
                <Link href="#about" className="hover:text-primary">
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary">
                  {t("links.services")}
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-primary">
                  {t("links.projects")}
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-primary">
                  {t("links.experience")}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-primary">
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className={`font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("services")}
            </h4>
            <ul className={`${isDark ? "text-gray-400" : "text-gray-600"} space-y-2`}>
              <li>
                <Link href="#services" className="hover:text-primary">
                  {t("serviceList.frontend")}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary">
                  {t("serviceList.uiux")}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary">
                  {t("serviceList.performance")}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary">
                  {t("serviceList.consulting")}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary">
                  {t("serviceList.webapp")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr
          className={`my-10 ${isDark ? "border-gray-700" : "border-gray-300"}`}
        />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
            {t("copyright")}
          </p>
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}