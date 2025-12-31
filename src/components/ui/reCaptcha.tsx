"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number | void;
    };
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  className?: string;
  /** 'light' | 'dark' — if omitted, tries to detect via `prefers-color-scheme` or `.dark` class */
  theme?: "light" | "dark";
  /** 'normal' | 'compact' — if omitted, chooses 'compact' for narrow viewports */
  size?: "normal" | "compact";
}

export default function ReCaptcha({ siteKey, onVerify, className, theme, size }: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver to detect when component is in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to detect once
        }
      },
      { rootMargin: "100px" } // Start loading slightly before visible
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Load reCAPTCHA script only when visible
  useEffect(() => {
    if (!isVisible || !siteKey) {
      if (!siteKey) {
        console.error("ReCaptcha: Missing siteKey. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.");
      }
      return;
    }

    const ensureScript = () => {
      const existing = document.getElementById("recaptcha-script") as HTMLScriptElement | null;
      if (existing) return existing;
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    };

    const script = ensureScript();

    const tryRender = () => {
      if (widgetIdRef.current !== null || !recaptchaRef.current) return;
      // Avoid double-render if element already has children (Fast Refresh/StrictMode)
      if (recaptchaRef.current.childNodes.length > 0) return;
      if (!window.grecaptcha || typeof window.grecaptcha.render !== "function") return;
      try {
        // determine theme
        let resolvedTheme: "light" | "dark" = "light";
        if (theme) resolvedTheme = theme;
        else if (typeof window !== "undefined") {
          try {
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
              resolvedTheme = "dark";
            } else if (document.documentElement.classList.contains("dark")) {
              resolvedTheme = "dark";
            }
          } catch {
            // ignore
          }
        }

        // determine size (compact on small viewports by default)
        let resolvedSize: "normal" | "compact" = "normal";
        if (size) resolvedSize = size;
        else if (typeof window !== "undefined") resolvedSize = window.innerWidth < 420 ? "compact" : "normal";

        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
          theme: resolvedTheme,
          size: resolvedSize,
        });
        widgetIdRef.current = typeof widgetId === "number" ? widgetId : 0;
      } catch (err) {
        console.error("ReCaptcha: render failed", err);
      }
    };

    const handleReady = () => {
      tryRender();
    };

    if (window.grecaptcha && typeof window.grecaptcha.ready === "function") {
      window.grecaptcha.ready(handleReady);
    } else if (script) {
      script.addEventListener("load", () => {
        if (window.grecaptcha && typeof window.grecaptcha.ready === "function") {
          window.grecaptcha.ready(handleReady);
        } else {
          // Fallback: attempt render shortly after load
          setTimeout(tryRender, 300);
        }
      });
    }

    return () => {
      // nothing to cleanup explicitly; widget is managed by Google API inside the div
    };
  }, [isVisible, siteKey, onVerify, size, theme]);

  return (
    <div ref={containerRef} className={className ?? "flex justify-center"}>
      {isVisible ? (
        <div ref={recaptchaRef} />
      ) : (
        <div className="h-[78px] w-[304px] bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      )}
    </div>
  );
}
