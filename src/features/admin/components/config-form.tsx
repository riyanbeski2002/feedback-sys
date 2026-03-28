"use client"

import { useState } from "react"
import { updateConfig } from "../actions/update-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Save, Scale, Bell, Settings2 } from "lucide-react"
import { toast } from "sonner"

interface Config {
  id: string
  trigger_delay_hours: number
  reminder_enabled: boolean
  reminder_frequency_hours: number
  max_reminders: number
  email_enabled: boolean
  whatsapp_enabled: boolean
  slack_enabled: boolean
  teams_enabled: boolean
  cleanliness_weight: number
  service_weight: number
  value_weight: number
  amenities_weight: number
  intent_weight: number
  boost_threshold: number
  neutral_threshold: number
  flagged_threshold: number
}

interface ConfigFormProps {
  initialConfig: Config
}

export function ConfigForm({ initialConfig }: ConfigFormProps) {
  const [config, setConfig] = useState(initialConfig)
  const [loading, setLoading] = useState(false)

  const totalWeight = 
    Number(config.cleanliness_weight) + 
    Number(config.service_weight) + 
    Number(config.value_weight) + 
    Number(config.amenities_weight) + 
    Number(config.intent_weight)

  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isWeightValid) {
      toast.error("Invalid Weights", {
        description: `Weights must sum to 1.0 (Current: ${totalWeight.toFixed(2)})`,
      })
      return
    }

    setLoading(true)
    const result = await updateConfig({
      ...config,
      reminder_enabled: config.reminder_enabled ? "true" : "false",
      email_enabled: config.email_enabled ? "true" : "false",
      whatsapp_enabled: config.whatsapp_enabled ? "true" : "false",
      slack_enabled: config.slack_enabled ? "true" : "false",
      teams_enabled: config.teams_enabled ? "true" : "false",
    })

    if (result.success) {
      toast.success("Settings Saved", {
        description: "Configuration and hotel scores updated successfully.",
      })
    } else {
      toast.error("Error", {
        description: result.error,
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scoring Weights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="size-5 text-primary" />
                <CardTitle>Scoring Weights</CardTitle>
              </div>
              <Badge variant={isWeightValid ? "outline" : "destructive"}>
                Sum: {totalWeight.toFixed(2)}
              </Badge>
            </div>
            <CardDescription>
              Define how much each category contributes to the total weighted score (0.0 - 1.0).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium">Cleanliness</label>
              <Input 
                type="number" step="0.01" 
                value={config.cleanliness_weight} 
                onChange={(e) => setConfig({ ...config, cleanliness_weight: Number(e.target.value) })}
              />
              <label className="text-sm font-medium">Service Quality</label>
              <Input 
                type="number" step="0.01" 
                value={config.service_weight} 
                onChange={(e) => setConfig({ ...config, service_weight: Number(e.target.value) })}
              />
              <label className="text-sm font-medium">Value for Money</label>
              <Input 
                type="number" step="0.01" 
                value={config.value_weight} 
                onChange={(e) => setConfig({ ...config, value_weight: Number(e.target.value) })}
              />
              <label className="text-sm font-medium">Amenities</label>
              <Input 
                type="number" step="0.01" 
                value={config.amenities_weight} 
                onChange={(e) => setConfig({ ...config, amenities_weight: Number(e.target.value) })}
              />
              <label className="text-sm font-medium">Future Intent</label>
              <Input 
                type="number" step="0.01" 
                value={config.intent_weight} 
                onChange={(e) => setConfig({ ...config, intent_weight: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thresholds */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="size-5 text-primary" />
              <CardTitle>Score Thresholds</CardTitle>
            </div>
            <CardDescription>
              Adjust thresholds for status buckets and visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium text-[var(--status-top-rated-text)]">Top Rated (Min)</label>
              <Input 
                type="number" step="0.1" 
                value={config.boost_threshold} 
                onChange={(e) => setConfig({ ...config, boost_threshold: Number(e.target.value) })}
              />
              <label className="text-sm font-medium text-[var(--status-stable-text)]">Neutral (Min)</label>
              <Input 
                type="number" step="0.1" 
                value={config.neutral_threshold} 
                onChange={(e) => setConfig({ ...config, neutral_threshold: Number(e.target.value) })}
              />
              <label className="text-sm font-medium text-[var(--status-flagged-text)]">Flagged (Below)</label>
              <Input 
                type="number" step="0.1" 
                value={config.flagged_threshold} 
                onChange={(e) => setConfig({ ...config, flagged_threshold: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <CardTitle>Communication Rules</CardTitle>
          </div>
          <CardDescription>
            Manage notification channels and reminder logic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Active Channels</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" variant={config.email_enabled ? "default" : "outline"}
                  onClick={() => setConfig({ ...config, email_enabled: !config.email_enabled })}
                >Email</Button>
                <Button 
                  type="button" variant={config.whatsapp_enabled ? "default" : "outline"}
                  onClick={() => setConfig({ ...config, whatsapp_enabled: !config.whatsapp_enabled })}
                >WhatsApp</Button>
                <Button 
                  type="button" variant={config.slack_enabled ? "default" : "outline"}
                  onClick={() => setConfig({ ...config, slack_enabled: !config.slack_enabled })}
                >Slack</Button>
                <Button 
                  type="button" variant={config.teams_enabled ? "default" : "outline"}
                  onClick={() => setConfig({ ...config, teams_enabled: !config.teams_enabled })}
                >Teams</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Timing & Reminders</h3>
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-xs font-medium">Trigger Delay (hrs)</label>
                <Input 
                  type="number" 
                  value={config.trigger_delay_hours} 
                  onChange={(e) => setConfig({ ...config, trigger_delay_hours: Number(e.target.value) })}
                />
                <label className="text-xs font-medium">Frequency (hrs)</label>
                <Input 
                  type="number" 
                  value={config.reminder_frequency_hours} 
                  onChange={(e) => setConfig({ ...config, reminder_frequency_hours: Number(e.target.value) })}
                />
                <label className="text-xs font-medium">Max Reminders</label>
                <Input 
                  type="number" 
                  value={config.max_reminders} 
                  onChange={(e) => setConfig({ ...config, max_reminders: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={loading || !isWeightValid}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
