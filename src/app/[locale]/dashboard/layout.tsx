import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import ThemeSwitcher from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/lang/languageswitcher";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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

export default function Layout({children}: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            </div>
          </div>
        </header>   
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
