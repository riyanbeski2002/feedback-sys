"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Slack as SlackIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmailPreview } from "./email-preview"
import { WhatsAppPreview } from "./whatsapp-preview"
import { SlackPreview } from "./slack-preview"
import { TeamsPreview } from "./teams-preview"

type FeedbackRow = {
  id: string
  computed_score: number | null
  comment: string | null
  created_at: string
  bookings: { traveller_name: string; checkin_date: string; checkout_date: string } | null
  hotels: { name: string } | null
}

type Channel = "email" | "whatsapp" | "slack" | "teams"

export function NotificationsClient({ feedbackList }: { feedbackList: FeedbackRow[] }) {
  const [activeChannel, setActiveChannel] = useState<Channel>("email")
  const [selectedId, setSelectedId] = useState<string>(feedbackList[0]?.id ?? "")

  const channels = [
    { id: "email", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "slack", label: "Slack", icon: SlackIcon },
    { id: "teams", label: "Teams", icon: Users },
  ] as const

  const selected = feedbackList.find(f => f.id === selectedId)
  const travellerName = selected?.bookings?.traveller_name ?? "Unknown"
  const hotelName = selected?.hotels?.name ?? "Unknown hotel"
  const score = selected?.computed_score != null ? selected.computed_score.toString() : "—"
  const comment = selected?.comment ?? ""
  const checkinDate = selected?.bookings?.checkin_date
    ? new Date(selected.bookings.checkin_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—"
  const checkoutDate = selected?.bookings?.checkout_date
    ? new Date(selected.bookings.checkout_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—"
  const feedbackLink = "https://ziptrrip.com/f/bk-9283-xk"
  const expiryTime = "25 Mar 2026, 11:59 PM"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="size-8 text-primary" />
          Notification Center
        </h1>
        <p className="text-muted-foreground">
          Preview how feedback requests appear across different communication channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {/* Submission Selector */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Submission</h2>
            {feedbackList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            ) : (
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a submission" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackList.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.bookings?.traveller_name ?? "Unknown"} — {f.hotels?.name ?? "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Channel Selector */}
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Channels</h2>
          <div className="flex flex-col gap-2">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={activeChannel === channel.id ? "default" : "outline"}
                className="justify-start gap-3 h-12"
                onClick={() => setActiveChannel(channel.id)}
              >
                <channel.icon className="size-4" />
                {channel.label}
              </Button>
            ))}
          </div>

          <Card className="mt-8 bg-muted/50 border-none">
            <CardHeader className="p-4">
              <CardTitle className="text-xs">Context Variables</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Traveller</p>
                <p className="text-xs font-medium">{travellerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Hotel</p>
                <p className="text-xs font-medium">{hotelName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Score</p>
                <p className="text-xs font-medium">{score}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Comment</p>
                <p className="text-xs font-medium">{comment.slice(0, 80)}{comment.length > 80 ? "…" : ""}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Link</p>
                <p className="text-[10px] font-mono bg-background p-1 rounded break-all">{feedbackLink}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 min-h-[500px] flex items-center justify-center bg-muted/20 rounded-xl p-4 md:p-8 border-2 border-dashed">
          {activeChannel === "email" && (
            <EmailPreview
              travellerName={travellerName}
              hotelName={hotelName}
              checkinDate={checkinDate}
              checkoutDate={checkoutDate}
              expiryTime={expiryTime}
            />
          )}
          {activeChannel === "whatsapp" && (
            <WhatsAppPreview
              travellerName={travellerName}
              hotelName={hotelName}
              feedbackLink={feedbackLink}
            />
          )}
          {activeChannel === "slack" && (
            <SlackPreview
              hotelName={hotelName}
              checkinDate={checkinDate}
              checkoutDate={checkoutDate}
              feedbackLink={feedbackLink}
            />
          )}
          {activeChannel === "teams" && (
            <TeamsPreview
              hotelName={hotelName}
              checkinDate={checkinDate}
              checkoutDate={checkoutDate}
            />
          )}
        </div>
      </div>
    </div>
  )
}
