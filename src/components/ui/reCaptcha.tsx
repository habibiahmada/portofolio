"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import Script from "next/script";

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
   Script loading state
========================= */
let isScriptLoaded = false;
let scriptLoadPromise: Promise<void> | null = null;
let activeTimers: { interval?: NodeJS.Timeout; timeout?: NodeJS.Timeout } = {};

function waitForRecaptchaScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve) => {
    if (window.grecaptcha) {
      isScriptLoaded = true;
      resolve();
      return;
    }

    // Poll for grecaptcha availability
    activeTimers.interval = setInterval(() => {
      if (window.grecaptcha) {
        isScriptLoaded = true;
        if (activeTimers.interval) clearInterval(activeTimers.interval);
        if (activeTimers.timeout) clearTimeout(activeTimers.timeout);
        activeTimers = {};
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    activeTimers.timeout = setTimeout(() => {
      if (activeTimers.interval) clearInterval(activeTimers.interval);
      activeTimers = {};
      if (!isScriptLoaded) {
        console.error("reCAPTCHA script failed to load");
      }
      resolve();
    }, 10000);
  });

  return scriptLoadPromise;
}

function cleanupRecaptchaTimers(): void {
  if (activeTimers.interval) {
    clearInterval(activeTimers.interval);
  }
  if (activeTimers.timeout) {
    clearTimeout(activeTimers.timeout);
  }
  activeTimers = {};
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
    const [scriptReady, setScriptReady] = useState(false);

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
      return () => {
        observer.disconnect();
        // Clean up any pending timers from script loading
        cleanupRecaptchaTimers();
      };
    }, []);

    /* Render captcha */
    useEffect(() => {
      if (!visible || !scriptReady || !siteKey || !captchaRef.current) return;
      if (widgetIdRef.current !== null) return;

      let isMounted = true;

      waitForRecaptchaScript()
        .then(() => {
          if (!isMounted) return;
          
          window.grecaptcha?.ready(() => {
            if (!isMounted || !captchaRef.current) return;
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
          if (isMounted) {
            console.error("ReCaptcha load error:", err);
          }
        });

      return () => {
        isMounted = false;
      };
    }, [visible, scriptReady, siteKey, onVerify, onExpired, onError, theme, size]);

    return (
      <>
        {/* Load reCAPTCHA script only when component is visible (conditional loading) */}
        {visible && (
          <Script
            src="https://www.google.com/recaptcha/api.js?render=explicit"
            strategy="lazyOnload"
            onLoad={() => setScriptReady(true)}
            onError={() => console.error("Failed to load reCAPTCHA script")}
          />
        )}
        <div ref={containerRef} className={className ?? "flex justify-center"}>
          {visible ? (
            <div ref={captchaRef} />
          ) : (
            <div className="h-[78px] w-[304px] rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          )}
        </div>
      </>
    );
  }
);

ReCaptcha.displayName = "ReCaptcha";
export default ReCaptcha;