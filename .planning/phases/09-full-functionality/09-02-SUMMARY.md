---
phase: 09-full-functionality
plan: 02
subsystem: api
tags: [supabase, score-recalculation, server-action, next-cache]

# Dependency graph
requires:
  - phase: 06-foundation-stabilization
    provides: feedback_config upsert pattern and hotels table with avg_score/status_bucket columns
  - phase: 08-design-implementation
    provides: Settings page UI with ConfigForm and loading/toast state already wired
provides:
  - Hotel avg_score and status_bucket bulk-recalculation triggered on every settings save
  - revalidatePath("/hotels") so Hotels page SSR consumers get fresh data immediately
affects: [09-full-functionality, hotels-page realtime subscription, admin dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Post-upsert server-side recalculation pattern in Next.js server action
    - Weighted score aggregation grouping feedback rows by hotel_id using a plain Record accumulator

key-files:
  created: []
  modified:
    - src/features/admin/actions/update-config.ts
    - src/features/admin/components/config-form.tsx

key-decisions:
  - "Score recalculation runs only after confirmed successful upsert — no hotel rows are touched if config save fails"
  - "null-safe ?? 0 on dimension columns handles legacy seed rows with null values without erroring out"
  - "revalidatePath('/hotels') added alongside existing /settings and /admin calls to trigger SSR cache invalidation"

patterns-established:
  - "Post-write side-effect pattern: fetch all related rows, compute aggregates in-process, bulk-update dependents before returning success"

requirements-completed: [FTR-02]

# Metrics
duration: 1min
completed: 2026-03-28
---

# Phase 9 Plan 02: Score Recalculation on Settings Save Summary

**Bulk hotel avg_score and status_bucket recalculation wired into update-config server action using new scoring weights applied across all feedback rows**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-28T00:23:01Z
- **Completed:** 2026-03-28T00:23:45Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- update-config.ts now fetches all feedback rows after a successful upsert and applies the new weights to each row's 5 dimensions
- Per-hotel avg_score is computed as a weighted sum average and written back to the hotels table
- status_bucket is recomputed from the newly saved thresholds on each hotel
- Success toast message updated to reflect score recalculation: "Configuration and hotel scores updated successfully."

## Task Commits

Each task was committed atomically:

1. **Task 1: Add score recalculation block to update-config.ts** - `84009f8` (feat)
2. **Task 2: Update config-form.tsx success toast to reflect score recalculation** - `029702a` (feat)

## Files Created/Modified
- `src/features/admin/actions/update-config.ts` - Appended score recalculation block after upsert success guard; added revalidatePath("/hotels")
- `src/features/admin/components/config-form.tsx` - Updated success toast description to mention hotel scores

## Decisions Made
- Score recalculation runs only after confirmed successful upsert — if config save fails, no hotel rows are touched
- null-safe `?? 0` on dimension columns handles legacy seed rows that may have null values, contributing 0 to the average without erroring out
- revalidatePath("/hotels") added alongside /settings and /admin to ensure Hotels page SSR cache is invalidated

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - TypeScript compiled cleanly on first attempt for both tasks.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- FTR-02 complete: hotel scores recalculate immediately on settings save
- Hotels page will reflect updated scores via existing Realtime subscription (postgres_changes on hotels table) without manual refresh
- Ready for next plan in Phase 9

---
*Phase: 09-full-functionality*
*Completed: 2026-03-28*
