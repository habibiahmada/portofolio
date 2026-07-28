"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { NodeNetworkProps } from "@/components/ui/node-network";

const NodeNetwork = dynamic(
  () =>
    import("@/components/ui/node-network").then((m) => m.NodeNetwork),
  { ssr: false },
);

function shouldSkipCanvas() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  // Lighthouse mobile + phones: canvas rAF is a major TBT / long-task source
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  if (
    "connection" in navigator &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData
  ) {
    return true;
  }
  return false;
}

/**
 * Lazy canvas: skipped on mobile / reduced-motion; on desktop waits for
 * in-view + idle so it does not compete with hydration (TBT).
 */
export function NodeNetworkLazy(props: NodeNetworkProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (shouldSkipCanvas()) return;

    const el = anchorRef.current;
    if (!el) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      if (cancelled) return;
      const start = () => {
        if (!cancelled) setReady(true);
      };
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        timeoutId = setTimeout(start, 600);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        arm();
      },
      { rootMargin: "80px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={anchorRef} className="absolute inset-0 z-0 pointer-events-none">
      {ready ? <NodeNetwork {...props} /> : null}
    </div>
  );
}

export type { NodeNetworkProps };
