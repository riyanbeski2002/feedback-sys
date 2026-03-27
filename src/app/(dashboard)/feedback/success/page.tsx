"use client"

import * as React from "react"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = React.useState(3)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      router.push("/bookings")
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center space-y-8 pt-20">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-[var(--status-top-rated-bg)] p-4">
          <CheckCircle2 className="size-12 text-[var(--status-top-rated-text)]" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Thank you!</h1>
        <p className="max-w-md text-xl text-muted-foreground">
          Your feedback helps colleagues make better choices and improves our platform.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Button asChild size="lg">
          <Link href="/bookings">
            Continue to Bookings <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Redirecting to bookings in {countdown}s...
        </p>
      </div>
    </div>
  )
}
