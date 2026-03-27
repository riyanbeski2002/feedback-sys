import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Tag, Info } from "lucide-react"

interface FeedbackItem {
  id: string
  computed_score: number
  comment?: string
  sentiment_label?: string
  sentiment_score?: number
  issue_category?: string
  urgency_flag?: boolean
  created_at: string
  hotels: {
    name: string
  }
}

interface RecentFeedbackFeedProps {
  feedbacks: FeedbackItem[]
}

export function RecentFeedbackFeed({ feedbacks }: RecentFeedbackFeedProps) {
  const getSentimentColor = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "positive": return "text-primary bg-primary/10 border-primary/20"
      case "negative": return "text-destructive bg-destructive/10 border-destructive/20"
      case "neutral": return "text-[var(--status-stable-text)] bg-[var(--status-stable-bg)] border-[var(--status-stable-border)]"
      default: return "text-muted-foreground bg-muted/50"
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "cleanliness": return <Tag className="size-3" />
      case "service": return <MessageSquare className="size-3" />
      case "value": return <Tag className="size-3" />
      case "amenities": return <Tag className="size-3" />
      default: return <Info className="size-3" />
    }
  }

  return (
    <div className="space-y-8">
      {feedbacks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm font-medium italic">
          No feedback activity yet.
        </div>
      ) : (
        feedbacks.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                item.computed_score >= 4 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-muted text-muted-foreground bg-muted/20"
              }`}>
                {item.computed_score.toFixed(1)}
              </div>
              <div className="w-px flex-1 bg-border/50 my-2 group-last:hidden"></div>
            </div>
            <div className="flex-1 pb-8 group-last:pb-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold tracking-tight">{item.hotels.name}</p>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {item.urgency_flag && (
                  <Badge variant="destructive" className="text-[9px] h-5 font-black tracking-widest px-2 shadow-sm shadow-destructive/20">
                    URGENT
                  </Badge>
                )}
                {item.sentiment_label && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSentimentColor(item.sentiment_label)}`}>
                    {item.sentiment_label}
                  </span>
                )}
                {item.issue_category && (
                  <Badge variant="secondary" className="text-[10px] h-5 gap-1 font-bold px-2 bg-muted/50 border-none">
                    {getCategoryIcon(item.issue_category)}
                    {item.issue_category}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground/80 mt-1 line-clamp-3 italic leading-relaxed font-medium">
                {item.comment ? `"${item.comment}"` : "No comment provided."}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
