"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth wheel scrolling with Lenis (about 4 KB gzip). Touch keeps native
 * scrolling, and people who ask for reduced motion get the browser default.
 * Dialogs, the mobile menu, and anything marked data-lenis-prevent scroll
 * natively so their own scroll locks keep working.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      anchors: { offset: -80 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      prevent: (node) =>
        Boolean(node.closest?.('[role="dialog"], #mobile-menu, [data-lenis-prevent]')),
    });

    // Modals and the blog sidebar lock scroll with body overflow: hidden.
    // Lenis scrolls the window itself, so pause it while that lock is on.
    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
