"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
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
import { NavProjects } from "@/components/nav-projects"
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
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Description",
          url: "/dashboard/about/descriptions",
        },
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Services",
          url: "/dashboard/services/all",
        },
        {
          title: "Add Service",
          url: "/dashboard/services/add",
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: Frame,
      items: [
        {
          title: "All Projects",
          url: "/dashboard/projects/all",
        },
        {
          title: "Add Project",
          url: "/dashboard/projects/add",
        },
      ],
    },
    {
      title: "Tools & Technology",
      url: "#",
      icon: Wrench,
      items: [
        {
          title: "All Tools & Tech",
          url: "/dashboard/tools-tech/all",
        },
        {
          title: "Add Tools & Tech",
          url: "/dashboard/tools-tech/add",
        },
      ],
    },
    {
      title: "Experience & Education",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "All Exp & Edu",
          url: "/dashboard/exp-edu/all",
        },
        {
          title: "Add Exp & Edu",
          url: "/dashboard/exp-edu/add",
        },
      ],
    },
    {
      title: "Certifications",
      url: "#",
      icon: Award,
      items: [
        {
          title: "All Certificates",
          url: "/dashboard/certificates/all",
        },
        {
          title: "Add Certificate",
          url: "/dashboard/certificates/add",
        },
      ],
    },
    {
      title: "Testimonials",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "All Testimonials",
          url: "/dashboard/testimonials/all",
        },
        {
          title: "Add Testimonial",
          url: "/dashboard/testimonials/add",
        },
      ],
    },
    {
      title: "Articles",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "All Articles",
          url: "/dashboard/articles/all",
        },
        {
          title: "Add Article",
          url: "/dashboard/articles/add",
        },
      ],
    },
    {
      title: "FAQs",
      url: "#",
      icon: HelpCircle,
      items: [
        {
          title: "All FAQs",
          url: "/dashboard/faqs/all",
        },
        {
          title: "Add FAQ",
          url: "/dashboard/faqs/add",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Email",
      url: "/dashboard/contacts",
      icon: Mail,
    },
  ],
}

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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
