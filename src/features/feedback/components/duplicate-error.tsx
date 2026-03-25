import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DuplicateError() {
  return (
    <div className="mx-auto max-w-md space-y-8 pt-20">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-yellow-100 p-4">
          <AlertCircle className="size-12 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback Already Submitted</h1>
        <p className="text-muted-foreground">
          You have already shared your thoughts for this stay. Each verified booking only allows one feedback submission.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <Button asChild variant="outline">
          <Link href="/bookings">
            <ArrowLeft className="mr-2 size-4" /> Back to Bookings
          </Link>
        </Button>
      </div>
    </div>
  )
}
