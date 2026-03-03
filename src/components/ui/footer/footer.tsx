"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import ThemeSwitcher from "@/components/theme/theme-toggle";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { animate, svg } from "animejs";

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [footerNameSvg, setFooterNameSvg] = useState("");
  const footerSvgContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Footer");

  const socials = [
    {
      name: "Linkedin",
      href: "https://linkedin.com/in/habibi-ahmad-aziz",
      icon: Linkedin,
    },
    {
      name: "Github",
      href: "https://github.com/habibiahmada",
      icon: Github,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/habibiahmad.a",
      icon: Instagram,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadFooterSvg = async () => {
      try {
        const response = await fetch("/images/footer-name.svg");
        if (!response.ok) return;

        const svgText = await response.text();
        if (isCancelled) return;

        const parser = new DOMParser();
        const parsed = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = parsed.documentElement;

        svgElement.setAttribute("class", "h-auto w-full select-none");
        svgElement.setAttribute("aria-hidden", "true");
        svgElement.setAttribute("focusable", "false");

        const drawableTargets = svgElement.querySelectorAll<SVGGeometryElement>(
          "path, line, polyline, polygon, rect, circle, ellipse",
        );

        drawableTargets.forEach((target) => {
          if (target.closest("defs")) return;

          target.classList.add("footer-name-drawable");
          target.setAttribute("fill", "currentColor");
          target.setAttribute("fill-opacity", "0");
          target.setAttribute("stroke", "currentColor");
          target.setAttribute("stroke-width", "1.25");
          target.setAttribute("stroke-linecap", "round");
          target.setAttribute("stroke-linejoin", "round");
          target.setAttribute("stroke-opacity", "1");
        });

        setFooterNameSvg(svgElement.outerHTML);
      } catch {
        // Keep footer readable even if SVG fetch fails.
      }
    };

    void loadFooterSvg();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!footerNameSvg || !footerSvgContainerRef.current) return;

    const drawableTargets = Array.from(
      footerSvgContainerRef.current.querySelectorAll<SVGGeometryElement>(
        ".footer-name-drawable",
      ),
    );

    if (!drawableTargets.length) return;

    const drawDuration = 2200;
    const revealDuration = 650;
    const resetDuration = 300;
    const cycleDelay = revealDuration + resetDuration;

    drawableTargets.forEach((target) => {
      target.setAttribute("fill-opacity", "0");
      target.setAttribute("stroke-opacity", "1");
    });

    const drawables = svg.createDrawable(drawableTargets);

    const drawAnimation = animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: drawDuration,
      loop: true,
      loopDelay: cycleDelay,
    });

    const fillAnimation = animate(drawableTargets, {
      keyframes: [
        { fillOpacity: 0, strokeOpacity: 1, duration: 0 },
        {
          fillOpacity: 0,
          strokeOpacity: 1,
          duration: drawDuration,
          ease: "linear",
        },
        {
          fillOpacity: 1,
          strokeOpacity: 0.2,
          duration: revealDuration,
          ease: "outQuad",
        },
        {
          fillOpacity: 0,
          strokeOpacity: 1,
          duration: resetDuration,
          ease: "inQuad",
        },
      ],
      loop: true,
    });

    return () => {
      drawAnimation.pause();
      drawAnimation.revert();
      fillAnimation.pause();
      fillAnimation.revert();
    };
  }, [footerNameSvg, resolvedTheme]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <footer
      className={`py-16 transition-colors duration-300 ${
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
              {socials.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
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

        <div
          className={`mt-12 overflow-hidden rounded-2xl border px-4 py-6 sm:px-6 sm:py-8 ${
            isDark
              ? "border-white/10 bg-white/3"
              : "border-gray-300 bg-white/80"
          }`}
        >
          {footerNameSvg ? (
            <div
              ref={footerSvgContainerRef}
              role="img"
              aria-label={t("brandName")}
              className={`w-full select-none transition-opacity duration-300 ${
                isDark ? "text-white/90" : "text-gray-900/80"
              }`}
              dangerouslySetInnerHTML={{ __html: footerNameSvg }}
            />
          ) : (
            <div
              className={`h-10 w-full animate-pulse rounded-md ${
                isDark ? "bg-white/10" : "bg-gray-200"
              }`}
            />
          )}
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
