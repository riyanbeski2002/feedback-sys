"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { simulateCheckout } from "../actions/simulate-checkout"
import { useTransition } from "react"
import { toast } from "sonner"

export function CheckoutDialog({ bookingId, hotelName }: { bookingId: string, hotelName?: string }) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()

  async function onConfirm() {
    startTransition(async () => {
      const result = await simulateCheckout(bookingId)
      if (result.success) {
        toast.success("Checkout simulated successfully")
        setOpen(false)
      } else {
        toast.error("Simulation failed: " + result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Simulate Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simulate Checkout</DialogTitle>
          <DialogDescription>
            You are about to simulate a completed stay at <strong>{hotelName}</strong>. This will trigger feedback eligibility.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Simulating..." : "Confirm Checkout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
