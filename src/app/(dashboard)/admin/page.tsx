import { createClient } from "@/lib/supabase/server"
import { MetricCards } from "@/features/admin/components/metric-cards"
import { FlaggedHotelsTable } from "@/features/admin/components/flagged-hotels-table"
import { RecentFeedbackFeed } from "@/features/admin/components/recent-feedback-feed"
import { LayoutDashboard, AlertTriangle, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Fetch Summary Metrics
  const { data: hotelsData } = await supabase.from("hotels").select("avg_score, total_feedbacks")
  const totalHotels = hotelsData?.length || 0
  const totalFeedbacks = hotelsData?.reduce((acc, h) => acc + (h.total_feedbacks || 0), 0) || 0
  const platformAvg = hotelsData?.length 
    ? hotelsData.reduce((acc, h) => acc + (h.avg_score || 0), 0) / hotelsData.length 
    : 0
  const flaggedCount = hotelsData?.filter(h => h.avg_score < 2.0).length || 0

  // 2. Fetch Flagged Hotels
  const { data: flaggedHotels } = await supabase
    .from("hotels")
    .select("*")
    .lt("avg_score", 2.0)
    .order("avg_score", { ascending: true })

  // 3. Fetch Recent Feedbacks
  const { data: recentFeedbacks } = await supabase
    .from("feedback")
    .select(`
      id,
      computed_score,
      comment,
      sentiment_label,
      sentiment_score,
      issue_category,
      urgency_flag,
      created_at,
      hotels (name)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Operational overview of platform quality and guest feedback activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full shadow-none border-border">
            Export Report
          </Button>
          <Button className="rounded-full shadow-md shadow-primary/20">
            System Config
          </Button>
        </div>
      </div>

      <MetricCards 
        metrics={{
          totalFeedbacks,
          avgScore: platformAvg,
          flaggedCount,
          totalHotels
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Flagged Hotels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-destructive/10 p-1.5 rounded-md">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Flagged Properties</h2>
          </div>
          <Card className="border-none shadow-sm">
            <FlaggedHotelsTable hotels={flaggedHotels || []} />
          </Card>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Activity className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Live Activity</h2>
          </div>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">Recent Feedback</CardTitle>
              <CardDescription className="text-xs font-medium">Latest submissions from verified stays.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentFeedbackFeed feedbacks={(recentFeedbacks as any) || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
