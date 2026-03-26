import { createClient } from "@/lib/supabase/server"
import { ConfigForm } from "@/features/admin/components/config-form"
import { Settings2 } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: config, error } = await supabase
    .from("feedback_config")
    .select("*")
    .single()

  if (error || !config) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <h2 className="text-xl font-bold">Error Loading Configuration</h2>
        <p className="mt-2 text-sm">{error?.message || "No configuration found."}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings2 className="size-8 text-primary" />
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure global feedback rules, scoring weights, and threshold levels.
        </p>
      </div>

      <ConfigForm initialConfig={config} />
    </div>
  )
}
