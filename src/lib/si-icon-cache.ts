import type { ComponentType } from "react"

export type SiIcon = ComponentType<{ size?: number; color?: string }>

let cache: Record<string, SiIcon> | null = null
let promise: Promise<Record<string, SiIcon>> | null = null

export function loadSiIcons() {
  if (!promise) {
    promise = import("react-icons/si").then((icons) => {
      cache = icons as unknown as Record<string, SiIcon>
      return cache
    })
  }
  return promise
}

export function getSiIconCache() {
  return cache
}
