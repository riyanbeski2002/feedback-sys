"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hotel, MapPin, Star, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface HotelCardProps {
  hotel: {
    id: string
    name: string
    location: string
    avg_score: number
    total_feedbacks: number
    status_bucket: string
    last_feedback_at?: string
  }
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [isFlashing, setIsFlashing] = useState(false)

  // Flash highlight effect when score changes
  useEffect(() => {
    if (hotel.last_feedback_at) {
      const lastFeedback = new Date(hotel.last_feedback_at).getTime()
      const now = new Date().getTime()
      
      // If feedback was in the last 5 seconds, flash
      if (now - lastFeedback < 5000) {
        setIsFlashing(true)
        const timer = setTimeout(() => setIsFlashing(false), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [hotel.avg_score, hotel.last_feedback_at])

  const getStatusColor = (score: number) => {
    if (score >= 4.5) return "bg-[var(--status-top-rated-bg)] text-[var(--status-top-rated-text)] border-[var(--status-top-rated-border)]"
    if (score >= 3.0) return "bg-[var(--status-stable-bg)] text-[var(--status-stable-text)] border-[var(--status-stable-border)]"
    if (score >= 2.0) return "bg-[var(--status-needs-review-bg)] text-[var(--status-needs-review-text)] border-[var(--status-needs-review-border)]"
    return "bg-[var(--status-flagged-bg)] text-[var(--status-flagged-text)] border-[var(--status-flagged-border)]"
  }

  const getStatusLabel = (score: number) => {
    if (score >= 4.5) return "Top Rated"
    if (score >= 3.0) return "Reliable"
    if (score >= 2.0) return "Needs Review"
    return "Flagged"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isFlashing ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
        borderColor: isFlashing ? "rgba(59, 130, 246, 0.5)" : "inherit"
      }}
      transition={{ duration: 0.5 }}
      className={cn(
        "transition-all duration-500 rounded-xl overflow-hidden border",
        isFlashing && "ring-2 ring-primary/50 bg-primary/5 shadow-lg scale-[1.02]"
      )}
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Hotel className="size-4 text-muted-foreground" />
            {hotel.name}
          </CardTitle>
          <Badge className={cn("font-medium", getStatusColor(hotel.avg_score))}>
            {getStatusLabel(hotel.avg_score)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-xs text-muted-foreground mb-4">
            <MapPin className="mr-1 size-3" />
            {hotel.location}
          </div>
          
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                {hotel.avg_score.toFixed(2)}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3",
                      i <= Math.round(hotel.avg_score)
                        ? "fill-[var(--rating-fill)] text-[var(--rating-fill)]"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <MessageSquare className="mr-1 size-3" />
              {hotel.total_feedbacks} reviews
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
