"use client"

import { useEffect, useState } from "react"
import { loadLucideIcons, getLucideCache } from "@/lib/lucide-cache"
import type { ComponentType } from "react"

interface DynamicIconProps {
  name?: string
  className?: string
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  const [Icon, setIcon] = useState<ComponentType<{ className?: string }> | null>(null)

  useEffect(() => {
    if (!name) return

    const cached = getLucideCache()
    if (cached?.[name]) {
      setIcon(() => cached[name])
      return
    }

    loadLucideIcons().then((icons) => {
      setIcon(() => icons[name] || icons["CircleHelp"])
    })
  }, [name])

  if (!Icon) {
    return <span className="w-6 h-6 inline-block" />
  }

  return <Icon className={className} />
}
