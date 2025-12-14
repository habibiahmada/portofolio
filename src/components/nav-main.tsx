"use client"

import * as React from "react"
import { usePathname } from "@/i18n/routing"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  url?: string
  icon?: React.ElementType
  items?: {
    title: string
    url: string
  }[]
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  const isActive = (url?: string) => {
    if (!url) return false
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <>
      {items.map((item) => (
        <SidebarGroup key={item.title} className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                className={cn(item.items?.length && "font-medium")}
              >
                {item.url ? (
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <span>
                    {item.icon && <item.icon />}
                    {item.title}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {item.items?.map((sub) => (
              <SidebarMenuItem key={sub.title} className="ml-6">
                <SidebarMenuButton
                  asChild
                  isActive={isActive(sub.url)}
                >
                  <Link href={sub.url}>
                    <span>{sub.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
