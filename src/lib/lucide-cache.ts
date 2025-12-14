import type { ComponentType } from "react"

export type LucideIcon = ComponentType<{ className?: string }>

let cache: Record<string, LucideIcon> | null = null
let promise: Promise<Record<string, LucideIcon>> | null = null

export function loadLucideIcons() {
  if (!promise) {
    promise = import("lucide-react").then((icons) => {
      cache = icons as unknown as Record<string, LucideIcon>
      return cache
    })
  }
  return promise
}

export function getLucideCache() {
  return cache
}
