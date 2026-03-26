import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface EmailPreviewProps {
  travellerName: string
  hotelName: string
  checkinDate: string
  checkoutDate: string
  expiryTime: string
}

export function EmailPreview({
  travellerName,
  hotelName,
  checkinDate,
  checkoutDate,
  expiryTime
}: EmailPreviewProps) {
  return (
    <Card className="max-w-2xl mx-auto border-dashed">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Mail className="size-4" />
          <span className="text-xs font-medium">Email Preview</span>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Subject: Rate your hotel stay and help improve future recommendations</p>
          <p className="text-xs text-muted-foreground">From: Ziptrrip Notifications &lt;support@ziptrrip.com&gt;</p>
        </div>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <div className="space-y-4">
          <p className="text-sm">Hi {travellerName},</p>
          <p className="text-sm leading-relaxed">
            We hope your stay at <strong>{hotelName}</strong> from <strong>{checkinDate} to {checkoutDate}</strong> went well.
          </p>
          <p className="text-sm leading-relaxed">
            Please take a minute to rate your experience. Your feedback helps us improve future hotel recommendations and maintain quality standards across the platform.
          </p>
        </div>
        
        <div className="py-4 flex justify-center">
          <Button className="px-8 py-6 rounded-md font-bold text-base">
            Rate Your Stay
          </Button>
        </div>
        
        <p className="text-[12px] text-muted-foreground text-center">
          This feedback link will remain active until {expiryTime}.
        </p>
      </CardContent>
    </Card>
  )
}
