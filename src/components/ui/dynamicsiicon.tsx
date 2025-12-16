"use client"

import { useEffect, useState } from "react"
import type { ComponentType } from "react"
import { loadSiIcons, getSiIconCache } from "@/lib/si-icon-cache"

interface DynamicSiIconProps {
  name?: string
  size?: number
  color?: string
}

type SiIconType = ComponentType<{
  className?: string
  style?: React.CSSProperties
  color?: string
}>

export function DynamicSiIcon({
  name,
  size = 32,
  color,
}: DynamicSiIconProps) {
  const [Icon, setIcon] = useState<SiIconType | null>(null)

  useEffect(() => {
    if (!name) return

    const cached = getSiIconCache()
    if (cached?.[name]) {
      setIcon(() => cached[name])
      return
    }

    loadSiIcons().then((icons) => {
      setIcon(() => icons[name])
    })
  }, [name])

  if (!Icon) {
    return (
      <div
        className="rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <Icon
      color={color}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    />
  )
}
