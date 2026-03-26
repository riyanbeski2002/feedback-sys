import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Star, AlertCircle, Hotel } from "lucide-react"

interface MetricCardsProps {
  metrics: {
    totalFeedbacks: number
    avgScore: number
    flaggedCount: number
    totalHotels: number
  }
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const items = [
    {
      label: "Total Feedbacks",
      value: metrics.totalFeedbacks.toLocaleString(),
      description: "Verified guest responses",
      icon: MessageSquare,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Platform Avg",
      value: metrics.avgScore.toFixed(2),
      description: "Global quality benchmark",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Flagged Hotels",
      value: metrics.flaggedCount.toString(),
      description: "Score below 2.0",
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Active Hotels",
      value: metrics.totalHotels.toString(),
      description: "Onboarded properties",
      icon: Hotel,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <div className={`${item.bg} p-2 rounded-lg`}>
                <item.icon className={`size-4 ${item.color}`} />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold tracking-tight">{item.value}</div>
              <p className="text-[10px] font-medium text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
