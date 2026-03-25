# Phase 2: Feedback Loop - Research

**Researched:** Wednesday, 25 March 2026
**Domain:** Server Actions, Form Validation, Star Rating Patterns
**Confidence:** HIGH

## Summary

Phase 2 builds the core user-facing feedback flow. In Next.js 16, Server Actions are the primary way to handle form submissions and state changes like checkout simulation. To ensure a professional B2B experience, we will use Zod for strict type validation and build a custom accessible Star Rating component.

**Primary recommendation:** Use Supabase PostgreSQL triggers for real-time aggregate scoring to ensure data consistency and offload complexity from the API layer.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Checkout Simulation**: Inline Table Button with Dialog Confirmation.
- **Form Layout**: Single Page, Always Visible comments.
- **Rating Style**: Star Ratings (1-5), Icon-only UI.
- **Success State**: Success Page with 3s auto-redirect to Hotels.
- **Duplicate Prevention**: Clear error state if already submitted.

### Claude's Discretion
- **Success Page Content**: Supportive B2B messaging.
- **Table Columns**: Traveller, Hotel, Dates, Status.

### Deferred Ideas (OUT OF SCOPE)
- **Quick Feedback (WhatsApp)**: Deferred to Phase 5.
- **Background Scheduler**: Not for MVP.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TRG-01 | Simulate checkout | Server Action + DB status update. |
| COL-01 | Detailed feedback form | React Hook Form + Zod + custom Star component. |
| COL-04 | Duplicate prevention | Unique constraint on `booking_id` in `feedback` table. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Hook Form | Latest | Form State | Performance, deep integration with Zod/shadcn. |
| Zod | Latest | Validation | Schema-first validation for both client and server. |
| sonner | Latest | Notifications | Modern, accessible toast notifications. |

## Architecture Patterns

### Pattern 1: Server Action Validation
```typescript
// Example pattern for 2026
"use server"

import { z } from "zod"

const schema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
})

export async function submitFeedback(formData: FormData) {
  const validated = schema.safeParse(Object.fromEntries(formData))
  if (!validated.success) return { error: "Invalid data" }
  
  // DB logic...
}
```

### Pattern 2: Database Triggers for Scoring
Instead of manual recalculation, use a Postgres trigger:
```sql
CREATE OR REPLACE FUNCTION update_hotel_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hotels
  SET 
    avg_score = (SELECT AVG(computed_score) FROM feedback WHERE hotel_id = NEW.hotel_id),
    total_feedbacks = (SELECT COUNT(*) FROM feedback WHERE hotel_id = NEW.hotel_id),
    last_feedback_at = NOW()
  WHERE id = NEW.hotel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-step Forms | Complex state machines | React Hook Form | Built-in validation and field tracking. |
| Confirmation Dialogs | Custom Modals | shadcn/ui Dialog | Accessible, keyboard support, focus management. |

## Common Pitfalls

### Pitfall 1: Double Submissions
**What goes wrong:** Users clicking 'Submit' twice before the action completes.
**How to avoid:** Use `useFormStatus` or a local `isPending` state to disable the submit button.

### Pitfall 2: Stale Hotel Scores
**What goes wrong:** App showing old score after submission.
**How to avoid:** Use `revalidatePath('/hotels')` in the Server Action.

## Code Examples

### Custom Accessible Star Rating
```typescript
// Pattern: radio group with hidden inputs for accessibility
export function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star 
          key={s}
          className={cn("cursor-pointer", s <= value ? "fill-primary" : "text-muted")}
          onClick={() => onChange(s)}
        />
      ))}
    </div>
  )
}
```

## Sources

### Primary (HIGH confidence)
- Next.js Server Actions Docs - Form handling
- Supabase SQL Triggers - Aggregate calculation patterns
- W3C WAI-ARIA - Accessible rating patterns

## Metadata

**Research date:** Wednesday, 25 March 2026
**Valid until:** April 2026
