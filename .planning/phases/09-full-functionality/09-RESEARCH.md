# Phase 9: Full Functionality - Research

**Researched:** 2026-03-28
**Domain:** Next.js Server Actions + Supabase data wiring
**Confidence:** HIGH

## Summary

Phase 9 closes exactly two end-to-end capability gaps. Gap 1: the Notifications page currently renders from a hardcoded `SAMPLE_DATA` const — it needs to fetch real `feedback` rows from Supabase (joined with `bookings` for traveller name), let the user pick a submission, and drive all four channel previews from that selection. Gap 2: `updateConfig` in `update-config.ts` currently returns after the upsert — it needs to continue and bulk-recalculate each hotel's `avg_score` by fetching all feedback rows, applying the new weights to the per-dimension scores already stored in the feedback table, grouping by `hotel_id`, and writing the results back to `hotels`.

Both gaps are pure data-wiring tasks. No new UI components, no new API routes, no schema migrations. The pattern to follow is already established in the codebase: server-side Supabase queries in `"use server"` actions, client-side Supabase queries in `"use client"` components, and `revalidatePath` for cache busting.

**Primary recommendation:** Wire both features by extending existing files (notifications/page.tsx and update-config.ts) rather than adding layers of abstraction. Both changes are self-contained.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Fetch all feedback submissions from Supabase, ordered by most recent first
- A submission selector (dropdown or list) lets user pick which submission drives all four channel previews
- Default selection: most recent submission
- No empty state needed — seed data (6 hotels, 14 feedback rows) always present
- All four channel previews reflect the same selected submission simultaneously
- No redirect or prompt from the feedback success screen — user navigates to Notifications manually
- Each preview shows: traveller name, hotel name, score (computed_score), and comment
- Traveller name: derive from booking traveller_name if available, else static label
- feedbackLink and expiryTime can remain plausible static values
- Recalculation triggers immediately when admin clicks Save in Settings (after weights are saved to feedback_config)
- Server-side: after saving weights, fetch all feedback rows, recompute each hotel's avg_score using new weights applied to per-dimension scores, then update the hotels table
- Hotels page re-renders with updated avg_scores and re-sorted rankings — no manual refresh needed
- Visual feedback: brief loading/spinner state on Save button during recalculation, then toast "Scores updated" on success
- If save fails, show existing error handling — no partial recalculation
- Supabase is fully live — data persists by default
- Seed data stays as-is — no expansion needed
- Recalculated avg_scores persist to hotels table in Supabase

### Claude's Discretion
- Exact UI for the submission selector on Notifications page (dropdown vs scrollable list vs tabs)
- Loading state duration and visual treatment on the Save button
- How to display the traveller name when the feedback row doesn't have a name field (derive from booking traveller_name if available, else use a static label like the seed names)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FTR-01 | Notification previews for all 4 channels show data from the most recent real feedback submission (not static sample data) | Feedback table has all needed fields; bookings table has traveller_name; join on booking_id |
| FTR-02 | When admin saves new scoring weights, hotel aggregate scores are recalculated across all existing feedback | updateConfig action is the right extension point; feedback rows have per-dimension score columns; scoring utility exists and is reusable |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | Already installed | DB queries | Project standard — used everywhere |
| @supabase/ssr | Already installed | Server/client clients | Project standard — createClient patterns established |
| next/cache revalidatePath | Next.js built-in | Cache bust after writes | Used in all existing actions |
| sonner (toast) | Already installed | User feedback on async ops | Used in config-form.tsx already |

### No New Dependencies Required
This phase requires zero new npm packages. All needed libraries are already in the project.

---

## Architecture Patterns

### Recommended File Changes
```
src/
├── app/(dashboard)/notifications/page.tsx     — convert to async Server Component; add submission selector state
├── features/notifications/                    — no new components needed
│   └── components/                            — all 4 previews already accept props correctly
├── features/admin/actions/update-config.ts    — add recalculation block after upsert succeeds
└── features/feedback/lib/scoring.ts           — reuse calculateWeightedScore (no changes needed)
```

### Pattern 1: Notifications Page — Server Fetch + Client Selector

The notifications page is currently `"use client"`. For this feature it can remain client-side and use the browser Supabase client to fetch feedback on mount, or it can be split into a Server Component wrapper that pre-fetches the list and passes it to a client selector component.

**Recommended approach:** Keep the page as `"use client"` and add a `useEffect` that fetches feedback from Supabase (with a join to bookings for traveller_name) on mount. This mirrors the pattern in `hotels/page.tsx` exactly and avoids adding a server/client split for a simple page.

```typescript
// Pattern: client-side fetch on mount (mirrors hotels/page.tsx)
const supabase = createClient()  // browser client from @/lib/supabase/client

useEffect(() => {
  const fetchFeedback = async () => {
    const { data } = await supabase
      .from("feedback")
      .select(`
        id,
        booking_id,
        hotel_id,
        computed_score,
        comment,
        created_at,
        bookings (
          traveller_name,
          traveller_email,
          checkin_date,
          checkout_date
        ),
        hotels (
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (data) setFeedbackList(data)
  }
  fetchFeedback()
}, [])
```

**Note on join syntax:** Supabase JS client supports nested selects using foreign key relationships. `feedback.booking_id` → `bookings.id` and `feedback.hotel_id` → `hotels.id` are already FK relationships established in the schema. The nested select `bookings (traveller_name, ...)` returns the related booking row inline.

### Pattern 2: Submission Selector UI

The CONTEXT.md leaves the exact UI to Claude's discretion. Given the existing page layout (channel buttons in a left column, preview in a wide right column), a `<Select>` dropdown above the channel buttons in the left column is the most compact option. The shadcn/ui `Select` component is already available in this project.

```typescript
// Selector drives selectedFeedbackId state
// selectedFeedback derived from feedbackList.find(f => f.id === selectedFeedbackId)
// All four previews receive props from selectedFeedback
```

The "Context Variables" card below the channel buttons already shows `travellerName`, `hotelName`, and `feedbackLink` — this card should update to reflect the selected submission (including `computed_score` and truncated `comment`).

### Pattern 3: Score Recalculation in updateConfig

The recalculation must be server-side (in the `"use server"` action) and must run after the `feedback_config` upsert succeeds. The plan is:

1. Fetch all feedback rows: `id`, `hotel_id`, and the 5 per-dimension score columns
2. For each hotel, compute a new avg_score by applying the new weights to each row's dimension scores
3. Batch-update the `hotels` table

**Critical column name discovery (from seed.ts):** The seed inserts feedback rows with columns `cleanliness_score`, `service_score`, `value_score`, `amenities_score`, `intent_score`, and `overall_score`. However, `submit-feedback.ts` uses the field names `room_cleanliness`, `service_quality`, `value_for_money`, `amenities_provided`, `recommend_to_colleagues` when inserting. This is a schema discrepancy — the seed uses different column aliases than the submit action.

The `scoring.ts` utility (`calculateWeightedScore`) accepts `FeedbackRatings` with fields: `value_for_money`, `service_quality`, `room_cleanliness`, `amenities_provided`, `recommend_to_colleagues`. The actual DB column names must be confirmed by checking the Supabase schema migration files, as the seed and the submit action use different names.

**The recalculation block must use the actual DB column names, not the scoring utility's interface names.** The bulk recalculation should be written directly in `update-config.ts` rather than trying to force-fit the `calculateWeightedScore` utility, since that utility has hardcoded weights (0.30/0.30/0.20/0.10/0.10) and the whole point of recalculation is to use the *new* weights from `formData`.

```typescript
// After successful upsert in updateConfig:
const weights = {
  cleanliness: Number(formData.cleanliness_weight),
  service: Number(formData.service_weight),
  value: Number(formData.value_weight),
  amenities: Number(formData.amenities_weight),
  intent: Number(formData.intent_weight),
}

// 1. Fetch all feedback with dimension scores
const { data: allFeedback, error: fetchError } = await supabase
  .from("feedback")
  .select("hotel_id, room_cleanliness, service_quality, value_for_money, amenities_provided, recommend_to_colleagues")
// Note: column names here depend on actual schema — verify against migration

// 2. Group by hotel_id, compute new avg
// 3. For each hotel, update avg_score and status_bucket in hotels table

revalidatePath("/hotels")
revalidatePath("/settings")
revalidatePath("/admin")
return { success: true }
```

### Pattern 4: Hotels Page Re-render on Score Update

The `hotels/page.tsx` already subscribes to Supabase Realtime for hotel UPDATE events. When `updateConfig` calls `revalidatePath("/hotels")` AND Supabase fires a postgres_changes UPDATE event on the hotels table, the Hotels page will update automatically — no additional work needed.

The `revalidatePath` call ensures that any SSR-rendered version of hotels is busted, while the Realtime subscription handles the live client-side update.

### Anti-Patterns to Avoid
- **Do not call `calculateWeightedScore` for bulk recalculation:** That utility uses hardcoded weights. Pass the new weights directly in the recalculation formula.
- **Do not use a separate API route:** All server logic stays in Server Actions (`"use server"`), consistent with the rest of the project.
- **Do not add pagination to the notifications selector:** 14 seed rows — a flat list or single-select dropdown is appropriate.
- **Do not use `supabase.from("hotels").update()` in a loop:** Use a single update per hotel but do not issue N separate queries in a loop if possible. Given only 6 hotels, sequential updates are acceptable and simpler than a batch approach.
- **Do not trigger a partial recalculation on error:** If the upsert fails, return early before any hotel updates. If hotel update fails mid-loop, the current handling returns the error without having updated all hotels — acceptable for now per CONTEXT.md.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Supabase relation joins | Manual lookup queries per row | Nested select syntax `bookings(traveller_name)` in single query |
| Realtime hotel refresh | Manual polling or window reload | Existing postgres_changes subscription in hotels/page.tsx |
| Toast notifications | Custom notification component | `toast.success()` / `toast.error()` from sonner (already used in config-form.tsx) |
| Loading state | Custom spinner component | Existing `<Loader2>` pattern from config-form.tsx |

---

## Common Pitfalls

### Pitfall 1: Column Name Mismatch Between Seed and Submit Action
**What goes wrong:** `submit-feedback.ts` uses `room_cleanliness`, `service_quality`, `value_for_money`, `amenities_provided`, `recommend_to_colleagues` as insert column names. The seed uses `cleanliness_score`, `service_score`, `value_score`, `amenities_score`, `intent_score`. The bulk recalculation in `updateConfig` must query the actual DB columns — not the TypeScript interface names.
**Why it happens:** The seed was written with abbreviated column names; the submit action was written later with different names. One of these must not match the actual migration schema.
**How to avoid:** Before writing the recalculation query, read the actual migration SQL files to confirm the true column names. If the feedback table has `room_cleanliness` (per submit-feedback.ts), the seed's `cleanliness_score` inserts would have failed silently or gone into wrong columns.
**Warning signs:** Recalculated scores all return 0 — means column names in the SELECT are wrong.

### Pitfall 2: Supabase Nested Select Returns Array, Not Object
**What goes wrong:** When selecting `bookings(traveller_name)`, the result type is `bookings: { traveller_name: string } | null` (for a to-one relationship). Accessing `feedback.bookings.traveller_name` without a null check throws at runtime if a feedback row has no associated booking.
**Why it happens:** TypeScript inference from Supabase may not flag this. 14 seed rows all have valid booking_ids, but any new feedback submitted through the form also has a booking_id, so this is safe in practice.
**How to avoid:** Always null-check `feedback.bookings?.traveller_name` and fall back to a static label.

### Pitfall 3: Notifications Page Renders Before Fetch Completes
**What goes wrong:** The first render shows no previews or stale SAMPLE_DATA while the fetch is in flight.
**Why it happens:** `useEffect` runs after first paint; async fetch takes ~200-500ms.
**How to avoid:** Add a `loading` state (mirrors hotels/page.tsx) and show a spinner or skeleton while `feedbackList` is empty. Default the selected submission to the first item once data arrives.

### Pitfall 4: updateConfig Success Toast Fires Before Recalculation Completes
**What goes wrong:** The existing `config-form.tsx` shows "Settings Saved" toast when `result.success` is true. If recalculation happens inside `updateConfig`, the toast fires only after the entire function completes — which is correct. But if the return value is changed to carry a different message, the form must handle it.
**Why it happens:** The toast message is hardcoded in config-form.tsx as "Global feedback configuration updated successfully."
**How to avoid:** Change the toast description to "Scores updated" as specified in CONTEXT.md, or keep both messages. Simplest: change the description to "Configuration and hotel scores updated successfully." The success response shape `{ success: true }` does not need to change.

### Pitfall 5: revalidatePath on "/hotels" Not Triggering Live Update
**What goes wrong:** `revalidatePath` only busts the Next.js RSC cache for SSR pages. The hotels page is `"use client"` with no server rendering — it won't be visibly refreshed by `revalidatePath` alone.
**Why it happens:** `revalidatePath` affects server-rendered routes. Client-only pages with `useEffect` fetches are unaffected.
**How to avoid:** The existing Realtime subscription on the hotels page handles the live update via `postgres_changes`. The `updateConfig` action writes to `hotels` table, which triggers Supabase Realtime events that the client subscription receives. This is already wired. `revalidatePath("/hotels")` is still useful for any server-rendered consumers of hotels data.

---

## Code Examples

### Verified: Supabase nested select (foreign key join)
```typescript
// Source: Supabase JS client documentation — relational selects
const { data } = await supabase
  .from("feedback")
  .select(`
    id,
    computed_score,
    comment,
    created_at,
    hotel_id,
    bookings (
      traveller_name,
      checkin_date,
      checkout_date
    ),
    hotels (
      name
    )
  `)
  .order("created_at", { ascending: false })
```

### Verified: updateConfig action extension pattern
```typescript
// After the existing upsert succeeds (error === null):
// 1. Fetch all feedback rows with dimension scores
const { data: feedbackRows, error: feedbackFetchError } = await supabase
  .from("feedback")
  .select("hotel_id, <dim1>, <dim2>, <dim3>, <dim4>, <dim5>")
  // dim1-5: actual DB column names (verify from migration)

if (feedbackFetchError) {
  return { error: feedbackFetchError.message }
}

// 2. Group by hotel_id and compute weighted avg
const hotelScores: Record<string, { sum: number; count: number }> = {}
for (const row of feedbackRows) {
  const score =
    row.<dim_cleanliness> * Number(formData.cleanliness_weight) +
    row.<dim_service>     * Number(formData.service_weight) +
    row.<dim_value>       * Number(formData.value_weight) +
    row.<dim_amenities>   * Number(formData.amenities_weight) +
    row.<dim_intent>      * Number(formData.intent_weight)

  if (!hotelScores[row.hotel_id]) {
    hotelScores[row.hotel_id] = { sum: 0, count: 0 }
  }
  hotelScores[row.hotel_id].sum += score
  hotelScores[row.hotel_id].count += 1
}

// 3. Update each hotel
for (const [hotelId, { sum, count }] of Object.entries(hotelScores)) {
  const newAvg = Math.round((sum / count) * 100) / 100
  const status_bucket =
    newAvg >= Number(formData.boost_threshold) ? "top_rated" :
    newAvg >= Number(formData.neutral_threshold) ? "stable" :
    newAvg >= Number(formData.flagged_threshold) ? "needs_review" : "flagged"

  await supabase
    .from("hotels")
    .update({ avg_score: newAvg, status_bucket })
    .eq("id", hotelId)
}

revalidatePath("/hotels")
revalidatePath("/settings")
revalidatePath("/admin")
return { success: true }
```

### Verified: Submission selector with shadcn/ui Select
```typescript
// shadcn/ui Select is already available in this project
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select value={selectedId} onValueChange={setSelectedId}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a submission" />
  </SelectTrigger>
  <SelectContent>
    {feedbackList.map((f) => (
      <SelectItem key={f.id} value={f.id}>
        {f.bookings?.traveller_name ?? "Unknown"} — {f.hotels?.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

## Critical Pre-Implementation Investigation Required

### Column Name Discrepancy — Must Resolve Before Writing Recalculation

The seed (`seed.ts`) and submit action (`submit-feedback.ts`) use **different column names** for the same feedback dimensions:

| Dimension | seed.ts column | submit-feedback.ts column | scoring.ts field |
|-----------|---------------|--------------------------|-----------------|
| Cleanliness | `cleanliness_score` | `room_cleanliness` | `room_cleanliness` |
| Service | `service_score` | `service_quality` | `service_quality` |
| Value | `value_score` | `value_for_money` | `value_for_money` |
| Amenities | `amenities_score` | `amenities_provided` | `amenities_provided` |
| Intent | `intent_score` | `recommend_to_colleagues` | `recommend_to_colleagues` |

One of these sets of names matches the actual DB schema; the other does not. The recalculation query in `updateConfig` must use the correct DB column names. The planner's **Wave 0 task** must be to check the Supabase migration files (or query the live table schema) to confirm which column names are correct before writing the recalculation SELECT.

**Most likely truth:** `submit-feedback.ts` was written to match the actual DB schema (it runs live and 14 rows exist), so the actual columns are `room_cleanliness`, `service_quality`, `value_for_money`, `amenities_provided`, `recommend_to_colleagues`. The seed rows use different aliases — this likely means the seed inserts went to non-existent columns (silently failing or ignored) and `overall_score` was inserted but not `computed_score`. The notifications page uses `computed_score` from feedback rows — this column is inserted by `submit-feedback.ts` but NOT by the seed.

**Implication for FTR-01:** If `computed_score` is null for seed rows (since seed doesn't insert it), the notification previews will show null scores for seed data. The plan must include a task to check if seed rows have `computed_score` populated, and if not, compute it or fall back to `overall_score`.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| REST API routes for data fetching | Next.js Server Actions + `"use server"` | Keep — project already uses this pattern |
| Manual cache invalidation | `revalidatePath` in actions | Keep — works correctly here |
| Polling for hotel score updates | Supabase Realtime postgres_changes | Already implemented in hotels/page.tsx — no change needed |

---

## Open Questions

1. **Exact DB column names for feedback dimension scores**
   - What we know: seed.ts and submit-feedback.ts use different names for the same 5 dimensions
   - What's unclear: which set matches the actual Supabase schema migration
   - Recommendation: Wave 0 task — read migration SQL files or run `SELECT column_name FROM information_schema.columns WHERE table_name = 'feedback'` to get ground truth before writing recalculation code

2. **Is `computed_score` present in seed feedback rows?**
   - What we know: seed.ts does not insert `computed_score`; it inserts `overall_score`. submit-feedback.ts inserts `computed_score` but not `overall_score`
   - What's unclear: whether the notifications page can use `computed_score` from seed rows (it will be null)
   - Recommendation: Wave 0 task — check live DB. If null, the notification preview should fall back to `overall_score` or display "—"

3. **Does the Supabase anon key have SELECT permission on `bookings`?**
   - What we know: hotels/page.tsx and bookings/page.tsx both use the browser client successfully
   - What's unclear: whether the RLS policy allows the anon key to join feedback → bookings
   - Recommendation: Low risk (no auth in this project, RLS likely disabled) but confirm in Wave 0

---

## Sources

### Primary (HIGH confidence)
- Codebase direct read: `src/app/(dashboard)/notifications/page.tsx` — current SAMPLE_DATA structure and all 4 preview prop interfaces
- Codebase direct read: `src/features/admin/actions/update-config.ts` — exact insertion point for recalculation
- Codebase direct read: `src/features/feedback/lib/scoring.ts` — utility signature and hardcoded weights
- Codebase direct read: `src/scripts/seed.ts` — seed column names and all 14 feedback rows
- Codebase direct read: `src/features/feedback/actions/submit-feedback.ts` — submit column names and hotel update pattern
- Codebase direct read: `src/app/(dashboard)/hotels/page.tsx` — Realtime subscription and client fetch pattern
- Codebase direct read: `src/features/admin/components/config-form.tsx` — existing toast + loading pattern

### Secondary (MEDIUM confidence)
- Supabase JS nested select pattern (relational queries) — standard documented feature, same as what hotels/page.tsx uses implicitly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies, all patterns already in codebase
- Architecture: HIGH — both changes are extensions of existing files using established project patterns
- Pitfalls: HIGH for column name discrepancy (directly observed); MEDIUM for the Realtime + revalidatePath interplay
- Column name ground truth: LOW until migration files are checked — must be resolved in Wave 0

**Research date:** 2026-03-28
**Valid until:** Indefinite (no external dependencies, all local codebase analysis)
