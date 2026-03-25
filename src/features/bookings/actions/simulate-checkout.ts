"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function simulateCheckout(bookingId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "completed",
      feedback_eligible: true,
    })
    .eq("id", bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/bookings")
  return { success: true }
}
