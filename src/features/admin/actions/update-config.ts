"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateConfig(formData: any) {
  const supabase = await createClient()

  // Weights validation
  const totalWeight = 
    Number(formData.cleanliness_weight) + 
    Number(formData.service_weight) + 
    Number(formData.value_weight) + 
    Number(formData.amenities_weight) + 
    Number(formData.intent_weight)

  if (Math.abs(totalWeight - 1.0) > 0.001) {
    return { error: "Weights must sum to 1.0 (currently " + totalWeight.toFixed(2) + ")" }
  }

  const { error } = await supabase
    .from("feedback_config")
    .upsert(
      {
        singleton: true,
        trigger_delay_hours: Number(formData.trigger_delay_hours),
        reminder_enabled: formData.reminder_enabled === "true",
        reminder_frequency_hours: Number(formData.reminder_frequency_hours),
        max_reminders: Number(formData.max_reminders),
        email_enabled: formData.email_enabled === "true",
        whatsapp_enabled: formData.whatsapp_enabled === "true",
        slack_enabled: formData.slack_enabled === "true",
        teams_enabled: formData.teams_enabled === "true",
        cleanliness_weight: Number(formData.cleanliness_weight),
        service_weight: Number(formData.service_weight),
        value_weight: Number(formData.value_weight),
        amenities_weight: Number(formData.amenities_weight),
        intent_weight: Number(formData.intent_weight),
        boost_threshold: Number(formData.boost_threshold),
        neutral_threshold: Number(formData.neutral_threshold),
        flagged_threshold: Number(formData.flagged_threshold),
      },
      { onConflict: 'singleton' }
    )

  if (error) {
    return { error: error.message }
  }

  // --- Score recalculation ---
  const { data: feedbackRows, error: feedbackFetchError } = await supabase
    .from("feedback")
    .select("hotel_id, room_cleanliness, service_quality, value_for_money, amenities_provided, recommend_to_colleagues")

  if (feedbackFetchError) {
    return { error: "Config saved but score recalculation failed: " + feedbackFetchError.message }
  }

  if (feedbackRows && feedbackRows.length > 0) {
    const weights = {
      cleanliness: Number(formData.cleanliness_weight),
      service: Number(formData.service_weight),
      value: Number(formData.value_weight),
      amenities: Number(formData.amenities_weight),
      intent: Number(formData.intent_weight),
    }

    // Group feedback by hotel_id and accumulate weighted scores
    const hotelScores: Record<string, { sum: number; count: number }> = {}
    for (const row of feedbackRows) {
      const score =
        (row.room_cleanliness ?? 0) * weights.cleanliness +
        (row.service_quality ?? 0) * weights.service +
        (row.value_for_money ?? 0) * weights.value +
        (row.amenities_provided ?? 0) * weights.amenities +
        (row.recommend_to_colleagues ?? 0) * weights.intent

      if (!hotelScores[row.hotel_id]) {
        hotelScores[row.hotel_id] = { sum: 0, count: 0 }
      }
      hotelScores[row.hotel_id].sum += score
      hotelScores[row.hotel_id].count += 1
    }

    // Update each hotel's avg_score and status_bucket
    for (const [hotelId, { sum, count }] of Object.entries(hotelScores)) {
      const newAvg = Math.round((sum / count) * 100) / 100
      const status_bucket =
        newAvg >= Number(formData.boost_threshold) ? "top_rated" :
        newAvg >= Number(formData.neutral_threshold) ? "stable" :
        newAvg >= Number(formData.flagged_threshold) ? "needs_review" : "flagged"

      const { error: updateError } = await supabase
        .from("hotels")
        .update({ avg_score: newAvg, status_bucket })
        .eq("id", hotelId)

      if (updateError) {
        return { error: "Config saved but hotel update failed: " + updateError.message }
      }
    }
  }
  // --- End score recalculation ---

  revalidatePath("/settings")
  revalidatePath("/admin")
  revalidatePath("/hotels")

  return { success: true }
}
