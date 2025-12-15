"use client"

import { useTranslations } from "next-intl"
import SectionHeader from "../SectionHeader"
import { useEffect, useState } from "react"
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

  useEffect(() => {
    setMounted(true)
    loadSiIcons()
  }, [])

  if (!mounted) return null

  return (
    <section
      id="skills"
      className="bg-white dark:bg-slate-950 py-5 md:py-8 lg:py-10 transition-colors duration-300"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeader
          title={t("titleLine1")}
          description={t("description1")}
          align="center"
          className="mb-12"
        />

        {loading ? (
          <SkillGridSkeleton />
        ) : error ? (
          <p className="text-center text-sm text-red-500">
            {t("loadError", { default: "Failed to load skills" })}
          </p>
        ) : (
          <div className="overflow-hidden relative py-3 group">
            <div className="flex gap-8 animate-scroll group-hover:[animation-play-state:paused]">
              {[...techStacks, ...techStacks].map((tech, i) => (
                <div key={i} className="min-w-[120px] flex-shrink-0">
                  <SkillCard tech={tech as TechItem} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}