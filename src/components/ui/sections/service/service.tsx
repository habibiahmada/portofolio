"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import useServices from "@/hooks/useServices"
import ServiceCard from "./servicecard"
import ServiceCardSkeleton from "./servicecardskeleton"
import SectionHeader from "../SectionHeader"
import { DynamicIcon } from "../../dynamicIcon"
import { loadLucideIcons } from "@/lib/lucide-cache"

export default function MyService() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("service")
  const { services, loading, error } = useServices()

  useEffect(() => {
    setMounted(true)
    loadLucideIcons() // ✅ preload icon (dipakai DynamicIcon)
  }, [])

  if (!mounted) return null
  const isDark = resolvedTheme === "dark"

  return (
    <section
      id="services"
      className={`relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-5 transition-colors duration-300
        ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-white to-slate-50"}`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${isDark ? "bg-blue-500" : "bg-blue-300"} animate-blob`} />
        <div className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-10 ${isDark ? "bg-cyan-500" : "bg-cyan-300"} animate-blob animation-delay-2000`} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="mb-20">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}

          {error && (
            <div className="col-span-full text-center text-red-600 dark:text-red-400">
              {t("error", { default: "Failed to load services" as unknown as string })}
            </div>
          )}

          {!loading &&
            !error &&
            services.map((service) => {
              const tr = Array.isArray(service.service_translations)
                ? service.service_translations[0]
                : service.service_translations

              return (
                <ServiceCard
                  key={service.id}
                  icon={
                    <DynamicIcon
                      name={service.icon}
                      className="w-7 h-7 text-white"
                    />
                  }
                  title={tr?.title ?? ""}
                  description={tr?.description ?? ""}
                  bullets={(tr?.bullets || tr?.bullet || []) as string[]}
                  color={service.color}
                />
              )
            })}
        </div>
      </div>
    </section>
  )
}
