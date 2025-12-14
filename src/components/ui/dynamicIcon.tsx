import { useEffect, useState } from "react"
import { loadLucideIcons, getLucideCache } from "@/lib/lucide-cache"
import type { ComponentType } from "react"

export function DynamicIcon({ name, className }: { name?: string; className?: string }) {
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

  if (!Icon) return null
  return <Icon className={className} />
}
