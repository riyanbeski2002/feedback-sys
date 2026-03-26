export interface FeedbackAnalysis {
  sentiment_label: string
  sentiment_score: number
  issue_category: string
  urgency_flag: boolean
}

export function analyzeFeedback(comment: string, score: number): FeedbackAnalysis {
  const text = (comment || "").toLowerCase()
  
  // 1. Sentiment Score (Simple mapping: score / 5)
  const sentiment_score = score / 5.0
  
  // 2. Sentiment Label
  let sentiment_label = "Neutral"
  if (score >= 4.0) sentiment_label = "Positive"
  else if (score < 3.0) sentiment_label = "Negative"
  
  // Override label if strong keywords are present
  if (text.includes("excellent") || text.includes("great") || text.includes("amazing")) {
    sentiment_label = "Positive"
  } else if (text.includes("poor") || text.includes("bad") || text.includes("dirty") || text.includes("slow")) {
    sentiment_label = "Negative"
  }

  // 3. Issue Category
  let issue_category = "Other"
  if (text.includes("clean") || text.includes("dirty") || text.includes("towel") || text.includes("dust")) {
    issue_category = "Cleanliness"
  } else if (text.includes("staff") || text.includes("service") || text.includes("slow") || text.includes("rude")) {
    issue_category = "Service"
  } else if (text.includes("price") || text.includes("expensive") || text.includes("worth") || text.includes("value")) {
    issue_category = "Value"
  } else if (text.includes("wifi") || text.includes("gym") || text.includes("pool") || text.includes("amenities")) {
    issue_category = "Amenities"
  } else if (text.includes("recommend") || text.includes("back") || text.includes("stay again")) {
    issue_category = "Intent"
  }

  // 4. Urgency Flag
  const isNegative = sentiment_label === "Negative"
  const isCriticalCategory = issue_category === "Service" || issue_category === "Cleanliness"
  const urgency_flag = isNegative && (isCriticalCategory || score < 2.0)

  return {
    sentiment_label,
    sentiment_score,
    issue_category,
    urgency_flag,
  }
}
