"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Slack as SlackIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmailPreview } from "@/features/notifications/components/email-preview"
import { WhatsAppPreview } from "@/features/notifications/components/whatsapp-preview"
import { SlackPreview } from "@/features/notifications/components/slack-preview"
import { TeamsPreview } from "@/features/notifications/components/teams-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const SAMPLE_DATA = {
  travellerName: "Riyan Khan",
  hotelName: "Grand Royal Bangalore",
  checkinDate: "20 Mar 2026",
  checkoutDate: "22 Mar 2026",
  expiryTime: "25 Mar 2026, 11:59 PM",
  feedbackLink: "https://ziptrrip.com/f/bk-9283-xk"
}

type Channel = "email" | "whatsapp" | "slack" | "teams"

export default function NotificationsPage() {
  const [activeChannel, setActiveChannel] = useState<Channel>("email")

  const channels = [
    { id: "email", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "slack", label: "Slack", icon: SlackIcon },
    { id: "teams", label: "Teams", icon: Users },
  ] as const

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
                <p className="text-xs font-medium">{SAMPLE_DATA.travellerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Hotel</p>
                <p className="text-xs font-medium">{SAMPLE_DATA.hotelName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Link</p>
                <p className="text-[10px] font-mono bg-background p-1 rounded break-all">{SAMPLE_DATA.feedbackLink}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 min-h-[500px] flex items-center justify-center bg-muted/20 rounded-xl p-4 md:p-8 border-2 border-dashed">
          {activeChannel === "email" && (
            <EmailPreview 
              travellerName={SAMPLE_DATA.travellerName}
              hotelName={SAMPLE_DATA.hotelName}
              checkinDate={SAMPLE_DATA.checkinDate}
              checkoutDate={SAMPLE_DATA.checkoutDate}
              expiryTime={SAMPLE_DATA.expiryTime}
            />
          )}
          {activeChannel === "whatsapp" && (
            <WhatsAppPreview 
              travellerName={SAMPLE_DATA.travellerName}
              hotelName={SAMPLE_DATA.hotelName}
              feedbackLink={SAMPLE_DATA.feedbackLink}
            />
          )}
          {activeChannel === "slack" && (
            <SlackPreview 
              hotelName={SAMPLE_DATA.hotelName}
              checkinDate={SAMPLE_DATA.checkinDate}
              checkoutDate={SAMPLE_DATA.checkoutDate}
              feedbackLink={SAMPLE_DATA.feedbackLink}
            />
          )}
          {activeChannel === "teams" && (
            <TeamsPreview 
              hotelName={SAMPLE_DATA.hotelName}
              checkinDate={SAMPLE_DATA.checkinDate}
              checkoutDate={SAMPLE_DATA.checkoutDate}
            />
          )}
        </div>
      </div>
    </div>
  )
}
