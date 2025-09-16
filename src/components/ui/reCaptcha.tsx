"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: {
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

    const loadScript = () => {
      if (document.getElementById("recaptcha-script")) return;

      const script = document.createElement("script");
      script.id = "recaptcha-script";
      // Explicit render ensures v2 checkbox/invisible mode instead of v3
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadScript();

    const checkReady = setInterval(() => {
      if (widgetIdRef.current !== null) {
        clearInterval(checkReady);
        return;
      }
      if (window.grecaptcha && recaptchaRef.current) {
        // Avoid double-render if the element already has content (e.g., Fast Refresh/StrictMode)
        if (recaptchaRef.current.childNodes.length > 0) {
          clearInterval(checkReady);
          return;
        }
        try {
          const widgetId = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
          });
          // Some typings mark render return as void; in practice v2 returns widgetId (number)
          if (typeof widgetId === "number") {
            widgetIdRef.current = widgetId;
          } else {
            widgetIdRef.current = 0; // mark as rendered even if id not provided
          }
        } catch (err) {
          console.error("ReCaptcha: render failed", err);
        } finally {
          clearInterval(checkReady);
        }
      }
    }, 300);

    return () => clearInterval(checkReady);
  }, [siteKey, onVerify]);

  return <div ref={recaptchaRef} />;
}
