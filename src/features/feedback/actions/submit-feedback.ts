"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { calculateWeightedScore } from "../lib/scoring"
import { analyzeFeedback } from "../lib/analysis"

export async function submitFeedback(data: any) {
  const supabase = await createClient()

  // Calculate the weighted score before inserting
  const computed_score = calculateWeightedScore({
    value_for_money: data.value_for_money,
    service_quality: data.service_quality,
    room_cleanliness: data.room_cleanliness,
    amenities_provided: data.amenities_provided,
    recommend_to_colleagues: data.recommend_to_colleagues,
  })

  // 0.5 Analyze the comment for sentiment and category
  const { sentiment_label, sentiment_score, issue_category, urgency_flag } = analyzeFeedback(data.comment, computed_score)

  // 1. Insert the feedback
  const { error: feedbackError } = await supabase
    .from("feedback")
    .insert([
      {
        booking_id: data.bookingId,
        hotel_id: data.hotelId,
        value_for_money: data.value_for_money,
        service_quality: data.service_quality,
        room_cleanliness: data.room_cleanliness,
        amenities_provided: data.amenities_provided,
        repeat_stay_likelihood: data.repeat_stay_likelihood,
        recommend_to_colleagues: data.recommend_to_colleagues,
        comment: data.comment,
        computed_score,
        sentiment_label,
        sentiment_score,
        issue_category,
        urgency_flag,
      }
    ])

  if (feedbackError) {
    return { error: feedbackError.message }
  }

  // 1.5 Update the hotel's statistics
  const { data: hotel, error: hotelFetchError } = await supabase
    .from("hotels")
    .select("avg_score, total_feedbacks")
    .eq("id", data.hotelId)
    .single()

  if (hotelFetchError) {
    return { error: hotelFetchError.message }
  }

  const oldTotal = hotel.total_feedbacks || 0
  const oldAvg = hotel.avg_score || 0
  const newTotal = oldTotal + 1
  const newAvg = (oldAvg * oldTotal + computed_score) / newTotal
  
  // Determine status bucket
  let status_bucket = "stable"
  if (newAvg >= 4.5) status_bucket = "top_rated"
  else if (newAvg >= 3.0) status_bucket = "stable"
  else if (newAvg >= 2.0) status_bucket = "needs_review"
  else status_bucket = "flagged"

  const { error: hotelUpdateError } = await supabase
    .from("hotels")
    .update({
      avg_score: Math.round(newAvg * 100) / 100,
      total_feedbacks: newTotal,
      status_bucket,
      last_feedback_at: new Date().toISOString()
    })
    .eq("id", data.hotelId)

  if (hotelUpdateError) {
    return { error: hotelUpdateError.message }
  }

  // 2. Update the booking status
  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ feedback_submitted: true })
    .eq("id", data.bookingId)

  if (bookingError) {
    return { error: bookingError.message }
  }

  // 3. Revalidate related paths
  revalidatePath("/bookings")
  revalidatePath("/hotels")
  revalidatePath("/admin")

  return { success: true }
}
