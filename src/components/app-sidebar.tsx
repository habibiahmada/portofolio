"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,

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
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Description",
          url: "/dashboard/banner/descriptions",
        },
        {
          title: "Stats",
          url: "/dashboard/banner/stats",
        },
        {
          title: "Companies",
          url: "/dashboard/banner/companies",
        },
      ],
    },
    {
      title: "About",
      url: "/dashboard/about/descriptions",
      icon: Bot,
    },
    {
      title: "Services",
      url: "/dashboard/services/all",
      icon: BookOpen,
    },
    {
      title: "Projects",
      url: "/dashboard/projects/all",
      icon: Frame,
    },
    {
      title: "Tools & Technology",
      url: "/dashboard/tools-tech/all",
      icon: Wrench,
    },
    {
      title: "Experience & Education",
      url: "/dashboard/exp-edu/all",
      icon: GraduationCap,
    },
    {
      title: "Certifications",
      url: "/dashboard/certificates/all",
      icon: Award,
    },
    {
      title: "Testimonials",
      url: "/dashboard/testimonials/all",
      icon: MessageSquare,
    },
    {
      title: "Articles",
      url: "/dashboard/articles/all",
      icon: Newspaper,
    },
    {
      title: "FAQs",
      url: "/dashboard/faqs/all",
      icon: HelpCircle,
    },
    {
      title: "Contacts",
      url: "#",
      icon: Mail,
      items: [
        {
          title: "Email",
          url: "/dashboard/contacts",
        },
        {
          title: "Email Template",
          url: "/dashboard/contacts/email-template",
        },
      ],
    },
  ],
  projects: [],
  // Centralized list of dashboard routes — keep this in sync with
  // `src/app/[locale]/dashboard` so the sidebar only links to real pages.
  routes: [
    "/dashboard",
    "/dashboard/banner/companies",
    "/dashboard/banner/descriptions",
    "/dashboard/banner/stats",
    "/dashboard/about/descriptions",
    "/dashboard/services/all",
    "/dashboard/services/add",
    "/dashboard/projects/all",
    "/dashboard/projects/add",
    "/dashboard/tools-tech/all",
    "/dashboard/tools-tech/add",
    "/dashboard/exp-edu/all",
    "/dashboard/exp-edu/add",
    "/dashboard/certificates/all",
    "/dashboard/certificates/add",
    "/dashboard/testimonials/all",
    "/dashboard/testimonials/add",
    "/dashboard/articles/all",
    "/dashboard/articles/add",
    "/dashboard/faqs/all",
    "/dashboard/faqs/add",
    "/dashboard/contacts",
    "/dashboard/contacts/email-template",
  ],
}

// Create a Set for fast lookup from the centralized `data.routes`.
const ROUTES = new Set(data.routes)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, userDisplayName, loading } = useAuth()
  const isDashboard = pathname?.includes("/dashboard")

  // Create user data from AuthContext
  const userData = React.useMemo(() => {
    if (loading) {
      return {
        name: 'Loading...',
        email: '',
        avatar: '/self-photo-habibi-ahmad-aziz.webp'
      }
    }

    if (!user) {
      return {
        name: 'Guest User',
        email: '',
        avatar: '/self-photo-habibi-ahmad-aziz.webp'
      }
    }

    return {
      name: userDisplayName,
      email: user.email || '',
      avatar: user.user_metadata?.avatar_url || '/self-photo-habibi-ahmad-aziz.webp'
    }
  }, [user, userDisplayName, loading])

  // Keep only children that point to real routes. Parent groups without
  // any valid children are removed.
  // Also keep parents that have a valid direct URL in ROUTES.
  const filteredNavMain = React.useMemo(() => {
    return data.navMain
      .map((item) => ({
        ...item,
        items: item.items?.filter((it) => ROUTES.has(it.url)) ?? [],
      }))
      .filter((item) => (item.items && item.items.length > 0) || ROUTES.has(item.url))
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70 cursor-pointer" asChild isActive={!!isDashboard}>
                <Link href="/dashboard">
                  <Home className="text-sidebar-foreground/70" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
          <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
