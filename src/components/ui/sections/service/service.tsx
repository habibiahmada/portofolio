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
      className={`relative pt-28 sm:pt-36 lg:pt-40 pb-32 transition-colors duration-300
    ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-white to-slate-50"}`}
    >


      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${isDark ? "bg-blue-500" : "bg-blue-300"} animate-blob`} />
        <div className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-10 ${isDark ? "bg-cyan-500" : "bg-cyan-300"} animate-blob animation-delay-2000`} />
      </div>

      <div className="container mx-auto px-4 max-w-8xl relative">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* LEFT: Section Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-[calc(var(--navbar-height)+2rem)]">
              <SectionHeader
                title={t("titleLine1")}
                description={t("description1")}
                align="left"
              />
            </div>
          </div>


          {/* RIGHT: Services Grid */}
          <div className="lg:w-2/3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-hidden">


              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))}

              {error && (
                <div className="col-span-full text-center text-red-600">
                  {t("error", { default: "Failed to load services" })}
                </div>
              )}

              {!loading &&
                !error &&
                services.map((service) => {
                  const tr = Array.isArray(service.service_translations)
                    ? service.service_translations[0]
                    : service.service_translations

                  const technologies =
                    (tr?.bullets || tr?.bullet || []) as string[]

                  return (
                    <ServiceCard
                      key={service.id}
                      icon={
                        <DynamicIcon
                          name={service.icon}
                          className="w-7 h-7 text-white transition-colors duration-300"
                        />
                      }
                      title={tr?.title ?? ""}
                      description={tr?.description ?? ""}
                      technologies={technologies}
                      color={service.color}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
