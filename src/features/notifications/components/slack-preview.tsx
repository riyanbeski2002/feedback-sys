import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Slack, MoreHorizontal, User } from "lucide-react"

interface SlackPreviewProps {
  hotelName: string
  checkinDate: string
  checkoutDate: string
  feedbackLink: string
}

export function SlackPreview({
  hotelName,
  checkinDate,
  checkoutDate,
  feedbackLink
}: SlackPreviewProps) {
  return (
    <Card className="max-w-md mx-auto bg-[#1A1D21] text-white border-none shadow-xl overflow-hidden">
      <div className="bg-[#121016] p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Slack className="size-5" />
          <span className="font-bold text-sm">Slack</span>
        </div>
        <MoreHorizontal className="size-4 opacity-50" />
      </div>

      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-3">
          <div className="size-10 rounded-md bg-[var(--primary)] flex items-center justify-center font-bold text-black">Z</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Ziptrrip Feedback</span>
              <span className="text-[10px] bg-gray-700 px-1 rounded uppercase">App</span>
              <span className="text-[10px] opacity-40">11:32 AM</span>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-sm">Hotel stay feedback requested</p>
              <div className="bg-gray-800/50 border-l-4 border-primary p-3 rounded-r">
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  <span className="opacity-60">Stay:</span>
                  <span className="font-medium text-primary-foreground">{hotelName}</span>
                  <span className="opacity-60">Dates:</span>
                  <span className="font-medium text-primary-foreground">{checkinDate} – {checkoutDate}</span>
                </div>
                <p className="mt-2 text-xs">
                  Please share your feedback here: <span className="text-blue-400 underline cursor-pointer">{feedbackLink}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
