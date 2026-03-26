"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageSquare, Check, CheckCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface WhatsAppPreviewProps {
  travellerName: string
  hotelName: string
  feedbackLink: string
}

export function WhatsAppPreview({
  travellerName,
  hotelName,
  feedbackLink
}: WhatsAppPreviewProps) {
  const [type, setType] = useState<"quick" | "detailed">("detailed")

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <Button 
          variant={type === "quick" ? "secondary" : "ghost"} 
          className="flex-1 text-xs py-1 h-8"
          onClick={() => setType("quick")}
        >
          Quick
        </Button>
        <Button 
          variant={type === "detailed" ? "secondary" : "ghost"} 
          className="flex-1 text-xs py-1 h-8"
          onClick={() => setType("detailed")}
        >
          Detailed
        </Button>
      </div>

      <Card className="bg-[#E5DDD5] border-none shadow-lg overflow-hidden relative min-h-[300px] flex flex-col">
        <div className="bg-[#075E54] p-3 flex items-center gap-3 text-white">
          <MessageSquare className="size-5" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Ziptrrip Bot</span>
            <span className="text-[10px] opacity-80">Online</span>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-end space-y-4">
          <div className="bg-white rounded-lg p-3 max-w-[85%] shadow-sm relative self-start">
            <div className="absolute -left-1 top-0 w-2 h-2 bg-white rotate-45"></div>
            {type === "quick" ? (
              <p className="text-sm leading-snug">
                Hi {travellerName}, how was your stay at {hotelName}? Reply with a number from **1 to 10**, where 10 is excellent.
              </p>
            ) : (
              <p className="text-sm leading-snug">
                Hi {travellerName}, we hope your stay at {hotelName} went well. Please take a minute to rate your experience here: <span className="text-blue-600 underline break-all">{feedbackLink}</span>
              </p>
            )}
            <div className="flex justify-end items-center gap-1 mt-1">
              <span className="text-[10px] text-muted-foreground">11:32 AM</span>
              <CheckCheck className="size-3 text-blue-500" />
            </div>
          </div>
        </div>
      </Card>
      <p className="text-[10px] text-muted-foreground text-center italic">
        WhatsApp {type === "quick" ? "Quick Score" : "Detailed Link"} Template
      </p>
    </div>
  )
}
