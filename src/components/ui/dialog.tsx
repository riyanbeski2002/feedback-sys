"use client"

import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { X } from "lucide-react"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Dialog = ({ open, onOpenChange, children }: { open?: boolean, onOpenChange?: (open: boolean) => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden bg-background border rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
  return <>{children}</>
}

const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("p-6", className)}>{children}</div>
}

const DialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>{children}</div>
}

const DialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>{children}</div>
}

const DialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>
}

const DialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
