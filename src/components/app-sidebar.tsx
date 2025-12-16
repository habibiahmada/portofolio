"use client"

import * as React from "react"
import {
  BookOpen,
  Frame,
  GalleryVerticalEnd,
  Home,
  SquareTerminal,
  Wrench,
  GraduationCap,
  Award,
  MessageSquare,
  Newspaper,
  HelpCircle,
  Mail,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Link, usePathname } from "@/i18n/routing"
import { useAuth } from "@/contexts/AuthContext"
import { withLocale } from "@/lib/with-locale"

const data = {
  teams: [
    {
      name: "Habibi Ahmad",
      logo: GalleryVerticalEnd,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Banner",
      icon: SquareTerminal,
      items: [
        { title: "Description", url: "/dashboard/banner/descriptions" },
        { title: "Stats", url: "/dashboard/banner/stats" },
        { title: "Companies", url: "/dashboard/banner/companies" },
      ],
    },
    { title: "Services", url: "/dashboard/services", icon: BookOpen },
    { title: "Projects", url: "/dashboard/projects", icon: Frame },
    { title: "Tools & Technology", url: "/dashboard/tools-tech", icon: Wrench },
    { title: "Experience & Education", url: "/dashboard/exp-edu", icon: GraduationCap },
    { title: "Certifications", url: "/dashboard/certificates", icon: Award },
    { title: "Testimonials", url: "/dashboard/testimonials/all", icon: MessageSquare },
    { title: "Articles", url: "/dashboard/articles/all", icon: Newspaper },
    { title: "FAQs", url: "/dashboard/faqs/all", icon: HelpCircle },
    {
      title: "Contacts",
      icon: Mail,
      items: [
        { title: "Email", url: "/dashboard/contacts" },
        { title: "Email Template", url: "/dashboard/contacts/email-template" },
      ],
    },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const locale = pathname?.split("/")[1] || "en"

  const { user, userDisplayName, loading } = useAuth()

  const userData = React.useMemo(() => {
    if (loading) {
      return { name: "Loading...", email: "", avatar: "/self-photo-habibi-ahmad-aziz.webp" }
    }

    if (!user) {
      return { name: "Guest User", email: "", avatar: "/self-photo-habibi-ahmad-aziz.webp" }
    }

    return {
      name: userDisplayName,
      email: user.email || "",
      avatar: user.user_metadata?.avatar_url || "/self-photo-habibi-ahmad-aziz.webp",
    }
  }, [user, userDisplayName, loading])

  const localizedNavMain = React.useMemo(() => {
    return data.navMain.map(item => ({
      ...item,
      url: item.url ? withLocale(item.url, locale) : undefined,
      items: item.items?.map(sub => ({
        ...sub,
        url: withLocale(sub.url, locale)
      })),
    }))
  }, [locale])

  const isDashboardActive =
  pathname === "/dashboard" ||
  pathname === `/${locale}/dashboard`


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isDashboardActive}>
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavMain items={localizedNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}