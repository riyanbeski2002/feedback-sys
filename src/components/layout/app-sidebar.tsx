"use client"

import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  Settings2,
  Hotel,
  Bell,
  CheckCircle2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: BookOpen,
    },
    {
      title: "Hotels",
      url: "/hotels",
      icon: Hotel,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base tracking-tight">ziptrrip</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Feedback Intel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu className="gap-1">
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className={`transition-all duration-200 h-11 ${
                  pathname === item.url 
                    ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className={`size-5 ${pathname === item.url ? "text-primary" : ""}`} />
                  <span className="font-semibold">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
            <p className="text-xs font-bold text-primary">Verified Stays Only</p>
            <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
              Feedback loop active for Bangalore, Mumbai, Delhi.
            </p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
