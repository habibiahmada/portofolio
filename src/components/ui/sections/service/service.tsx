import { useTheme } from "next-themes";
import { useState, useEffect, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import useServices from "@/hooks/useServices";
import ServiceCard from "./servicecard";
import ServiceCardSkeleton from "./servicecardskeleton";
import SectionHeader from "../SectionHeader";

let cachedLucideIcons: Record<string, ComponentType<{ className?: string }>> | null = null;
let loadLucideIconsPromise: Promise<Record<string, ComponentType<{ className?: string }>>> | null = null;

function preloadLucideIcons() {
  if (!loadLucideIconsPromise) {
    loadLucideIconsPromise = import("lucide-react").then((icons) => {
      cachedLucideIcons = icons as unknown as Record<string, ComponentType<{ className?: string }>>;
      return cachedLucideIcons;
    });
  }
  return loadLucideIconsPromise;
}

function DynamicIcon({ name }: { name: string }) {
  const [Icon, setIcon] = useState<ComponentType<{ className?: string }> | null>(() => {
    if (cachedLucideIcons) {
      return cachedLucideIcons[name] || null;
    }
    return null;
  });

  useEffect(() => {
    let isActive = true;
    if (cachedLucideIcons) {
      const existing = cachedLucideIcons[name] || null;
      setIcon(existing);
      return;
    }
    preloadLucideIcons().then((icons) => {
      if (!isActive) return;
      setIcon(() => icons[name] || null);
    });
    return () => {
      isActive = false;
    };
  }, [name]);

  if (!Icon) return null;
  return <Icon className="w-8 h-8 text-white" />;
}

export default function MyService() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("service");
  const { services, loading, error } = useServices();

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    preloadLucideIcons();
  }, []);
  
  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";
  
  return (
    <section
      id="services"
      className={`relative overflow-hidden transition-all duration-700 pt-28 sm:pt-36 lg:pt-40 pb-5
        ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-white to-slate-50"}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } animate-blob`}
        />
        <div
          className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-10 ${
            isDark ? "bg-cyan-500" : "bg-cyan-300"
          } animate-blob animation-delay-2000`}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <div className="mb-20">
          <SectionHeader
            title={t("titleLine1")}
            description={t("description1")}
            align="center"
          />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            Array.from({ length: 3 }).map((_, i) => (
              <ServiceCardSkeleton key={`svc-skel-${i}`} />
            ))
          )}
          {error && (
            <div className="col-span-full text-center text-red-600 dark:text-red-400">
              {t("error", { default: "Failed to load services" as unknown as string })}
            </div>
          )}
          {!loading && !error && services.map((service) => {
            const tr = Array.isArray(service.service_translations)
              ? service.service_translations[0]
              : service.service_translations as unknown as {
                  title?: string;
                  description?: string;
                  bullets?: string[];
                  bullet?: string[];
                } | undefined;

            const title = tr?.title || "";
            const description = tr?.description || "";
            const bullets = (tr?.bullets || tr?.bullet || []) as string[];

            return (
              <ServiceCard
                key={service.id}
                icon={<DynamicIcon name={service.icon} />}
                title={title}
                description={description}
                bullets={bullets}
                color={service.color}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}