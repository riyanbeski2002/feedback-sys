"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  max?: number
}

export function StarRating({ value, onChange, disabled, max = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const isActive = (hoverValue !== null ? hoverValue : value) >= starValue

        return (
          <button
            key={i}
            type="button"
            className={cn(
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
            onClick={() => !disabled && onChange(starValue)}
            onMouseEnter={() => !disabled && setHoverValue(starValue)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            disabled={disabled}
          >
            <Star
              className={cn(
                "size-6",
                isActive ? "fill-[var(--rating-fill)] text-[var(--rating-fill)]" : "text-muted-foreground"
              )}
            />
            <span className="sr-only">Rate {starValue} out of {max}</span>
          </button>
        )
      })}
    </div>
  )
}
