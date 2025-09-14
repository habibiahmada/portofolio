"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export default function ReCaptcha({ siteKey, onVerify }: ReCaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScript = () => {
      if (document.getElementById("recaptcha-script")) return;

      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadScript();

    const checkReady = setInterval(() => {
      if (window.grecaptcha && recaptchaRef.current) {
        clearInterval(checkReady);
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token); // kirim token ke parent
          },
        });
      }
    }, 500);

    return () => clearInterval(checkReady);
  }, [siteKey, onVerify]);

  return <div ref={recaptchaRef} />;
}
