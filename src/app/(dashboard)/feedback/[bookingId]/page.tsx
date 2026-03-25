import { createClient } from "@/lib/supabase/server"
import { FeedbackForm } from "@/features/feedback/components/feedback-form"
import { DuplicateError } from "@/features/feedback/components/duplicate-error"
import { notFound, redirect } from "next/navigation"

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const supabase = await createClient()

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      hotels (
        id,
        name
      )
    `)
    .eq("id", bookingId)
    .single()

  if (!booking) {
    notFound()
  }

  // Redirect if not completed
  if (booking.status !== "completed") {
    redirect("/bookings")
  }

  if (booking.feedback_submitted) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DuplicateError />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <FeedbackForm 
        bookingId={bookingId} 
        hotelId={booking.hotel_id} 
        hotelName={booking.hotels.name} 
      />
    </div>
  )
}
