"use client"

import { HotelCard } from "./hotel-card"
import { motion, AnimatePresence } from "framer-motion"
import { calculateWeightedRanking } from "@/features/feedback/lib/scoring"
import { useMemo } from "react"

interface Hotel {
  id: string
  name: string
  location: string
  avg_score: number
  total_feedbacks: number
  status_bucket: string
  last_feedback_at?: string
}

interface HotelGridProps {
  hotels: Hotel[]
}

export function HotelGrid({ hotels }: HotelGridProps) {
  // Sort hotels by weighted ranking
  const sortedHotels = useMemo(() => {
    return [...hotels].sort((a, b) => {
      const rankA = calculateWeightedRanking(a.avg_score, a.total_feedbacks)
      const rankB = calculateWeightedRanking(b.avg_score, b.total_feedbacks)
      
      // Secondary sort by avg_score if weighted rank is equal
      if (rankB === rankA) {
        return b.avg_score - a.avg_score
      }
      
      return rankB - rankA
    })
  }, [hotels])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {sortedHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </AnimatePresence>
    </div>
  )
}
