import { createClient } from "@/lib/supabase/server"
import { NotificationsClient } from "@/features/notifications/components/notifications-client"

type FeedbackRow = {
  id: string
  computed_score: number | null
  comment: string | null
  created_at: string
  bookings: { traveller_name: string; checkin_date: string; checkout_date: string } | null
  hotels: { name: string } | null
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("feedback")
    .select(`
      id,
      computed_score,
      comment,
      created_at,
      bookings (
        traveller_name,
        checkin_date,
        checkout_date
      ),
      hotels (
        name
      )
    `)
    .order("created_at", { ascending: false })

  const feedbackList = (data as unknown as FeedbackRow[]) ?? []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <NotificationsClient feedbackList={feedbackList} />
    </div>
  )
}
