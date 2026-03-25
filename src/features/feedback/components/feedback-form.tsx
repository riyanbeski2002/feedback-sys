"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./star-rating"
import { submitFeedback } from "../actions/submit-feedback"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const feedbackSchema = z.object({
  bookingId: z.string().uuid(),
  hotelId: z.string().uuid(),
  value_for_money: z.number().min(1).max(5),
  service_quality: z.number().min(1).max(5),
  room_cleanliness: z.number().min(1).max(5),
  amenities_provided: z.number().min(1).max(5),
  repeat_stay_likelihood: z.number().min(1).max(5),
  recommend_to_colleagues: z.number().min(1).max(5),
  comment: z.string().optional(),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

export function FeedbackForm({ bookingId, hotelId, hotelName }: { bookingId: string, hotelId: string, hotelName: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      bookingId,
      hotelId,
      value_for_money: 0,
      service_quality: 0,
      room_cleanliness: 0,
      amenities_provided: 0,
      repeat_stay_likelihood: 0,
      recommend_to_colleagues: 0,
      comment: "",
    },
  })

  async function onSubmit(data: FeedbackFormValues) {
    startTransition(async () => {
      const result = await submitFeedback(data)
      if (result.success) {
        toast.success("Feedback submitted successfully")
        router.push("/feedback/success")
      } else {
        toast.error("Submission failed: " + result.error)
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Rate Your Stay</h1>
        <p className="text-muted-foreground">
          How was your experience at <strong>{hotelName}</strong>?
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 rounded-lg border bg-card p-6 shadow-sm">
            <FormField
              control={form.control}
              name="room_cleanliness"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Room Cleanliness</FormLabel>
                    <FormControl>
                      <StarRating value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_quality"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Service Quality</FormLabel>
                    <FormControl>
                      <StarRating value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value_for_money"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Value for Money</FormLabel>
                    <FormControl>
                      <StarRating value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities_provided"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Amenities Provided</FormLabel>
                    <FormControl>
                      <StarRating value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommend_to_colleagues"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Recommend to Colleagues</FormLabel>
                    <FormControl>
                      <StarRating value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your stay..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your feedback helps us improve hotel recommendations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
