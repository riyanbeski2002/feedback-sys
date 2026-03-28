"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-background px-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 hover:bg-primary/10 hover:text-primary transition-colors" />
        <div className="h-4 w-px bg-border" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Project</span>
          <span className="text-sm font-black tracking-tight text-foreground leading-none">Feedback Intelligence</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">Business</span>
          <span className="text-xs text-border">|</span>
          <span className="text-xs font-medium text-muted-foreground">Personal</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
