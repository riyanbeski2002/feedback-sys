import { createClient } from "@/lib/supabase/server"
import { FeedbackForm } from "@/features/feedback/components/feedback-form"
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

  // Redirect if not eligible or already submitted
  if (booking.status !== "completed") {
    redirect("/bookings")
  }

  if (booking.feedback_submitted) {
    // This will be handled by a duplicate error component later in Task 2 of Plan 03
    // For now, let's redirect back to bookings or success if already submitted
    redirect("/bookings")
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
