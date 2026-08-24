"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const Services = dynamic(
  () => import("@/components/sections/services").then((m) => m.Services),
  {
    ssr: false,
    loading: () => <div className="py-24 min-h-100" aria-hidden />,
  },
);

const CTA = dynamic(
  () => import("@/components/sections/cta").then((m) => m.CTA),
  {
    ssr: false,
    loading: () => <div className="py-24 min-h-80" aria-hidden />,
  },
);

function WhenNear({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{show ? children : <div className="py-24 min-h-100" aria-hidden />}</div>;
}

/** Below-fold home sections: defer heavy JS; slot SSR content between Services and CTA. */
export function HomeBelowFold({ afterServices }: { afterServices?: ReactNode }) {
  return (
    <>
      <WhenNear>
        <Services />
      </WhenNear>
      {afterServices}
      <WhenNear>
        <CTA />
      </WhenNear>
    </>
  );
}
