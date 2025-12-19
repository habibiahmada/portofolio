import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import ThemeSwitcher from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import { useTranslations } from "next-intl";
import {
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input";
import { Bell, Search, Shield, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "sonner";

export const metadata = {
  title: "Dashboard | Portofolio",
  description: "My personal portfolio website",
  openGraph: {
    title: "Dashboard | Portofolio",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  const t = useTranslations("Dashboard.header");

  return (
    <SidebarProvider>
      <Toaster position="top-center" richColors />
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 py-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-2">
                <form action="#" className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={t('search')}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="submit"
                  >
                    <Search />
                  </Button>
                </form>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger className="cursor-pointer w-8 h-8 border rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <h3>{t('notifications')}</h3>
                    <p>{t('notificationCount', { count: 10 })}</p>
                  </div>
                </PopoverContent>
              </Popover>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
        <SidebarFooter>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
            <div className="px-4 pb-4 space-y-4">
              {/* System Status - Simplified */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('systemStatus')}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">{t('online')}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">99.9%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">{t('secure')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">v0.1.0</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-700"></div>

              {/* Copyright */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  © 2025 Habibi Ahmad Aziz
                </p>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </SidebarInset>
    </SidebarProvider>
  )
}
