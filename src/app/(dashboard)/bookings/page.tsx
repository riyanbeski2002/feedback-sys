import { createClient } from "@/lib/supabase/server"
import { BookingTable } from "@/features/bookings/components/booking-table"

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      hotels (
        name
      )
    `)
    .order("checkin_date", { ascending: false })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
      </div>
      <div className="space-y-4">
        <BookingTable initialData={bookings || []} />
      </div>
    </div>
  )
}
