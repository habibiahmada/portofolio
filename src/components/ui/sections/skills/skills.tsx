"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState, useMemo } from "react"
import SkillGridSkeleton from "./skillgridskeleton"
import SkillCard from "./skillcard"
import useTechstacks from "@/hooks/useTechstacks"
import { TechItem } from "@/lib/types/database"
import { loadSiIcons } from "@/lib/si-icon-cache"
import "./skills.css"

export default function SkillsSection() {
  const t = useTranslations("skills")
  const [mounted, setMounted] = useState(false)
  const { techStacks, loading, error } = useTechstacks()

  // Membagi tech stack menjadi 2 baris untuk efek visual yang lebih padat
  const { row1, row2 } = useMemo(() => {
    const half = Math.ceil(techStacks.length / 2)
    return {
      row1: techStacks.slice(0, half),
      row2: techStacks.slice(half)
    }
  }, [techStacks])

  useEffect(() => {
    setMounted(true)
    loadSiIcons()
  }, [])

  if (!mounted) return null

  return (
    <section
      id="skills"
      className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24 transition-colors duration-300 overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {loading ? (
          <SkillGridSkeleton />
        ) : error ? (
          <p className="text-center text-sm text-red-500">
            {t("loadError", { default: "Failed to load skills" })}
          </p>
        ) : (
          <div className="relative -mx-6 md:-mx-12 lg:-mx-20">
            
            {/* Gradient Masks untuk efek Fade di kiri dan kanan */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-6 md:gap-8 opacity-90 hover:opacity-100 transition-opacity duration-500">
              
              {/* Row 1: Bergerak ke Kiri */}
              <div className="flex relative overflow-hidden group">
                <div className="flex gap-4 md:gap-6 animate-scroll whitespace-nowrap pl-4 md:pl-6">
                  {[...row1, ...row1, ...row1].map((tech, i) => (
                    <div key={`row1-${i}`} className="w-[180px] md:w-[220px] flex-shrink-0">
                      <SkillCard tech={tech as TechItem} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: Bergerak ke Kanan (Reverse) */}
              <div className="flex relative overflow-hidden group">
                <div className="flex gap-4 md:gap-6 animate-scroll-reverse whitespace-nowrap pl-4 md:pl-6">
                  {[...row2, ...row2, ...row2].map((tech, i) => (
                    <div key={`row2-${i}`} className="w-[180px] md:w-[220px] flex-shrink-0">
                      <SkillCard tech={tech as TechItem} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  )
}