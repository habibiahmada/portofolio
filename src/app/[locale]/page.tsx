'use client';

import Navbar from "@/components/ui/navbar/main";
import Hero from "@/components/ui/sections/banner/hero";
import Stats from "@/components/ui/sections/stats/stats";
import { useState, useEffect } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Navbar />

      {/* Cursor follower */}
      <div
        className="fixed top-10 left-10 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full pointer-events-none z-50 opacity-50 blur-sm transition-all duration-150 ease-out"
        style={{
          transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
        }}
        aria-hidden="true"
      />

      <main id="main" role="main">
        <Hero />
        <Stats />
      </main>
    </>
  );
}
