"use client"

import * as React from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckoutDialog } from "./checkout-dialog"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BookingTable({ initialData }: { initialData: any[] }) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Traveller</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Checkout</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No bookings found.
              </TableCell>
            </TableRow>
          ) : (
            initialData.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  <div>{booking.traveller_name}</div>
                  <div className="text-xs text-muted-foreground">{booking.traveller_email}</div>
                </TableCell>
                <TableCell>{booking.hotels?.name || "N/A"}</TableCell>
                <TableCell>{format(new Date(booking.checkin_date), "MMM d, yyyy")}</TableCell>
                <TableCell>{format(new Date(booking.checkout_date), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === "completed"
                        ? "default"
                        : booking.status === "checked_in"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {booking.status !== "completed" ? (
                    <CheckoutDialog bookingId={booking.id} hotelName={booking.hotels?.name} />
                  ) : booking.feedback_submitted ? (
                    <Badge variant="outline" className="bg-[var(--status-top-rated-bg)] text-[var(--status-top-rated-text)] border-[var(--status-top-rated-border)]">
                      Feedback Submitted
                    </Badge>
                  ) : (
                    <Link
                      href={`/feedback/${booking.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-[var(--metric-info)] border-[var(--metric-info)] hover:bg-[var(--metric-info-bg)]")}
                    >
                      Rate Now
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
