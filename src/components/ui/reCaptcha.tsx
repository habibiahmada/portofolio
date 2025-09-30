"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
      }) => void;
    };
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export default function ReCaptcha({ siteKey, onVerify }: ReCaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) {
      console.error("ReCaptcha: Missing siteKey. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.");
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
        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
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
  }, [siteKey, onVerify]);

  return <div ref={recaptchaRef} />;
}
