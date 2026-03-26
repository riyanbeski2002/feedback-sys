import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, MoreHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TeamsPreviewProps {
  hotelName: string
  checkinDate: string
  checkoutDate: string
}

export function TeamsPreview({
  hotelName,
  checkinDate,
  checkoutDate
}: TeamsPreviewProps) {
  return (
    <Card className="max-w-md mx-auto bg-[#F5F5F5] text-black border-none shadow-lg overflow-hidden">
      <div className="bg-[#464775] p-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-white" />
          <span className="font-bold text-xs text-white">Microsoft Teams</span>
        </div>
        <MoreHorizontal className="size-4 text-white opacity-70" />
      </div>

      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-3">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xs">Z</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs">Ziptrrip Feedback</span>
              <span className="text-[10px] opacity-60">11:32 AM</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <p className="font-bold text-sm mb-3">Rate your recent hotel stay</p>
              
              <div className="grid grid-cols-2 gap-y-2 text-xs mb-4">
                <span className="opacity-60">Hotel:</span>
                <span className="font-medium text-black">{hotelName}</span>
                <span className="opacity-60">Dates:</span>
                <span className="font-medium text-black">{checkinDate} – {checkoutDate}</span>
              </div>
              
              <Button size="sm" className="w-full bg-[#464775] hover:bg-[#3b3c63] text-white">
                Open feedback form
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
