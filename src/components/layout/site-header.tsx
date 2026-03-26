"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 hover:bg-primary/10 hover:text-primary transition-colors" />
        <div className="h-6 w-px bg-border/60" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Project</span>
          <span className="text-sm font-black tracking-tight text-foreground leading-none">Feedback Intelligence</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full border border-border/40">
          <div className="px-3 py-1 rounded-full bg-white shadow-sm border border-border/20">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Business</span>
          </div>
          <div className="px-3 py-1 rounded-full opacity-40">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Personal</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
