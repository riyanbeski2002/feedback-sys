"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { HotelGrid } from "@/features/hotels/components/hotel-grid"
import { Hotel } from "lucide-react"

interface HotelData {
  id: string
  name: string
  location: string
  avg_score: number
  total_feedbacks: number
  status_bucket: string
  last_feedback_at?: string
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    const fetchHotels = async () => {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
      
      if (data) {
        setHotels(data)
      }
      setLoading(false)
    }

    fetchHotels()

    // Realtime subscription
    const channel = supabase
      .channel("hotels-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "hotels",
        },
        (payload) => {
          console.log("Hotel Update received:", payload)
          setHotels((current) =>
            current.map((hotel) =>
              hotel.id === payload.new.id ? { ...hotel, ...payload.new } : hotel
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Hotel className="size-8 text-primary" />
          Discovery Feed
        </h1>
        <p className="text-muted-foreground">
          Intelligent hotel discovery based on verified feedback and weighted reliability.
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[var(--status-top-rated-text)]"></span>
          Top Rated
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[var(--status-stable-text)]"></span>
          Reliable
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[var(--status-needs-review-text)]"></span>
          Needs Review
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[var(--status-flagged-text)]"></span>
          Flagged
        </div>
      </div>

      <HotelGrid hotels={hotels} />
    </div>
  )
}
