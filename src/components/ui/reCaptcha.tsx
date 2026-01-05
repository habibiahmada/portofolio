"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

/* =========================
   Global grecaptcha typing
========================= */
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

/* =========================
   Singleton script loader
========================= */
let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const existing = document.getElementById(
      "recaptcha-script"
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));

    document.body.appendChild(script);
  });

  return scriptPromise;
}

/* =========================
   Types
========================= */
interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
  className?: string;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
}

export interface ReCaptchaHandle {
  reset: () => void;
}

/* =========================
   Component
========================= */
const ReCaptcha = forwardRef<ReCaptchaHandle, ReCaptchaProps>(
  ({ siteKey, onVerify, onExpired, onError, className, theme, size }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const captchaRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [visible, setVisible] = useState(false);

    /* expose reset() */
    useImperativeHandle(ref, () => ({
      reset() {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      },
    }));

    /* IntersectionObserver (lazy render) */
    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    /* Render captcha */
    useEffect(() => {
      if (!visible || !siteKey || !captchaRef.current) return;
      if (widgetIdRef.current !== null) return;

      loadRecaptchaScript()
        .then(() => {
          window.grecaptcha?.ready(() => {
            if (!captchaRef.current) return;
            if (captchaRef.current.childNodes.length > 0) return;

            const resolvedTheme: "light" | "dark" =
              theme ??
              (document.documentElement.classList.contains("dark") ||
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light");

            const resolvedSize: "normal" | "compact" =
              size ?? (window.innerWidth < 420 ? "compact" : "normal");

            widgetIdRef.current = window.grecaptcha!.render(
              captchaRef.current,
              {
                sitekey: siteKey,
                callback: onVerify,
                "expired-callback": onExpired,
                "error-callback": onError,
                theme: resolvedTheme,
                size: resolvedSize,
              }
            );
          });
        })
        .catch((err) => {
          console.error("ReCaptcha load error:", err);
        });
    }, [visible, siteKey, onVerify, onExpired, onError, theme, size]);

    return (
      <div ref={containerRef} className={className ?? "flex justify-center"}>
        {visible ? (
          <div ref={captchaRef} />
        ) : (
          <div className="h-[78px] w-[304px] rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}
      </div>
    );
  }
);

ReCaptcha.displayName = "ReCaptcha";
export default ReCaptcha;