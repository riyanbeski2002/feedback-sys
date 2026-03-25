"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { calculateWeightedScore } from "../lib/scoring"

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
      }
    ])

  if (feedbackError) {
    return { error: feedbackError.message }
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
