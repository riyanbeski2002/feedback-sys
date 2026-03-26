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

  revalidatePath("/settings")
  revalidatePath("/admin")
  
  return { success: true }
}
