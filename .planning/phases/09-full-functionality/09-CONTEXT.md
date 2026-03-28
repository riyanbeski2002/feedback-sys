# Phase 9: Full Functionality - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up two data flows that are currently static: (1) the Notifications page reading real feedback from Supabase instead of hardcoded sample data, and (2) hotel avg_scores recalculating in Supabase when admin saves new scoring weights in Settings. No new features — purely closing two end-to-end capability gaps.

</domain>

<decisions>
## Implementation Decisions

### Notification data source
- The Notifications page should fetch all feedback submissions from Supabase, ordered by most recent first
- A submission selector (e.g. dropdown or list) lets user pick which submission drives all four channel previews
- Default selection: most recent submission
- Empty state: the existing seed data (6 hotels, 14 feedback rows) will always be present — no empty state needed for now
- All four channel previews (Email, WhatsApp, Slack, Teams) reflect the same selected submission simultaneously
- No redirect or prompt from the feedback success screen — user navigates to Notifications manually

### Notification preview content
- Each preview shows: traveller name, hotel name, score (computed_score), and comment
- Traveller name: use a generated/realistic fake name from the seed data (no name field on the feedback form)
- Seed data already uses realistic Indian names (Priya, Arjun, Kavitha, etc.) — keep this pattern
- The `feedbackLink` and `expiryTime` fields in the preview can remain plausible static values (they don't come from a real booking link system yet)

### Score recalculation
- Recalculation triggers immediately when admin clicks Save in Settings (after weights are saved to `feedback_config`)
- Server-side: after saving weights, fetch all feedback rows from Supabase, recompute each hotel's `avg_score` using the new weights applied to per-dimension scores (cleanliness, service, value, amenities, intent), then update the `hotels` table
- The Hotels page re-renders with updated avg_scores and re-sorted rankings (no manual refresh needed)
- Visual feedback: brief loading/spinner state on the Save button during recalculation, then a toast "Scores updated" on success
- If save fails, show existing error handling — no partial recalculation

### Persistence
- Supabase is fully live — data persists by default across refreshes and sessions
- Seed data stays as-is: 6 hotels, 14 feedback rows — no expansion needed for this phase
- Scoring weights persist to `feedback_config` table (already implemented in updateConfig action)
- Recalculated avg_scores persist to `hotels` table in Supabase

### Claude's Discretion
- Exact UI for the submission selector on Notifications page (dropdown vs scrollable list vs tabs)
- Loading state duration and visual treatment on the Save button
- How to display the traveller name when the feedback row doesn't have a name field (derive from booking traveller_name if available, else use a static label like the seed names)

</decisions>

<specifics>
## Specific Ideas

- The SAMPLE_DATA const in notifications/page.tsx currently hardcodes "Riyan Khan" as traveller name — replace this with real data from the most recently selected feedback row
- The `update-config` action (`src/features/admin/actions/update-config.ts`) is where score recalculation logic should be added, after the upsert succeeds
- The recalculation formula is already implemented in `submit-feedback.ts` as `calculateWeightedScore` — reuse this utility for bulk recalculation
- Dimension score columns: `cleanliness_score`, `service_quality`, `room_cleanliness` (check exact column names in seed.ts — use `service_quality`, `value_score`, `amenities_score`, `intent_score` or equivalent)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-full-functionality*
*Context gathered: 2026-03-28*
