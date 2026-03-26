---
phase: 06-foundation-stabilization
plan: "02"
subsystem: database
tags: [supabase, postgres, upsert, singleton-constraint, settings]

# Dependency graph
requires:
  - phase: 06-01
    provides: Stable Tailwind v4.2.2 build environment
provides:
  - Idempotent feedback_config singleton migration (basic/10_singleton_constraint.sql)
  - Settings page that loads on fresh DB and multi-seeded DB without PGRST116 error
  - Upsert-based settings save that never creates duplicate feedback_config rows
affects: [07-design-mockups, 08-ui-implementation, 09-dynamic-features]

# Tech tracking
tech-stack:
  added: []
  patterns: [supabase-maybeSingle-for-optional-rows, supabase-upsert-with-onConflict-singleton]

key-files:
  created:
    - basic/10_singleton_constraint.sql
  modified:
    - src/app/(dashboard)/settings/page.tsx
    - src/features/admin/actions/update-config.ts

key-decisions:
  - "Use .maybeSingle() instead of .single() for optional singleton rows — avoids PGRST116 on empty DB"
  - "Upsert keyed on singleton=true column, not row id — makes save idempotent regardless of prior state"
  - "DB-level UNIQUE INDEX on boolean sentinel column enforces max-one-row invariant at the database"

patterns-established:
  - "Singleton table pattern: boolean sentinel column + UNIQUE INDEX + upsert onConflict for safe idempotent writes"
  - "Null-safe config read: .maybeSingle() with separate null-state UI vs error-state UI"

requirements-completed: [DAT-01, DAT-02, DAT-03]

# Metrics
duration: 1min
completed: 2026-03-26
---

# Phase 6 Plan 02: Settings Page Singleton Fix Summary

**DB-level singleton constraint on feedback_config with .maybeSingle() read and upsert save — eliminates PGRST116 crash on fresh and multi-seeded databases**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-26T12:45:02Z
- **Completed:** 2026-03-26T12:46:15Z
- **Tasks:** 3 (Task 1 auto, Task 2 checkpoint auto-approved, Task 3 auto)
- **Files modified:** 3

## Accomplishments
- Created idempotent SQL migration that deduplicates rows, adds singleton sentinel column, and enforces uniqueness via UNIQUE INDEX
- Replaced `.single()` with `.maybeSingle()` on Settings page config read — no more PGRST116 on empty or multi-row DB
- Split null config state (friendly empty state prompting `npm run seed`) from DB error state (error message shown)
- Replaced `.update().eq("id", formData.id)` with `.upsert({ onConflict: 'singleton' })` — saves are now fully idempotent

## Task Commits

Each task was committed atomically:

1. **Task 1: Create singleton constraint migration SQL** - `e478368` (chore)
2. **Task 2: Apply singleton migration to Supabase** - auto-approved checkpoint (no commit)
3. **Task 3: Fix Settings page read and save** - `c1330fe` (fix)

**Plan metadata:** _(docs commit pending)_

## Files Created/Modified
- `basic/10_singleton_constraint.sql` - Idempotent 3-step migration: DELETE duplicates, ADD COLUMN singleton, CREATE UNIQUE INDEX feedback_config_singleton_idx
- `src/app/(dashboard)/settings/page.tsx` - Switched to .maybeSingle(), separate null-state vs error-state render paths
- `src/features/admin/actions/update-config.ts` - Switched from .update().eq("id") to .upsert({ singleton: true }, { onConflict: 'singleton' })

## Decisions Made
- `.maybeSingle()` preferred over `.single()` for all optional singleton reads in Supabase — returns null instead of throwing PGRST116 when 0 rows match
- Upsert keyed on `singleton: true` sentinel (not row id) — works correctly even before the row exists, making settings save safe on fresh databases
- DB-level UNIQUE INDEX on `singleton` boolean column is the enforcement layer — application code alone cannot prevent duplicate inserts from concurrent requests or external tooling

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**Manual DB step required.** The migration SQL in `basic/10_singleton_constraint.sql` must be applied manually via the Supabase SQL Editor before the upsert in `update-config.ts` will resolve conflicts correctly.

Steps:
1. Open Supabase dashboard > SQL Editor
2. Paste and run the contents of `basic/10_singleton_constraint.sql`
3. Verify `feedback_config` table has a `singleton` column and at most 1 row

## Next Phase Readiness
- Settings page is now stable on any DB state — safe foundation for Phase 7 UI mockup work
- feedback_config singleton pattern established — other config tables should follow the same pattern if added
- No blockers for Phase 7 (design mockups) or Phase 8 (UI implementation)

---
*Phase: 06-foundation-stabilization*
*Completed: 2026-03-26*

## Self-Check: PASSED

- basic/10_singleton_constraint.sql: FOUND
- src/app/(dashboard)/settings/page.tsx: FOUND
- src/features/admin/actions/update-config.ts: FOUND
- .planning/phases/06-foundation-stabilization/06-02-SUMMARY.md: FOUND
- Commit e478368: FOUND
- Commit c1330fe: FOUND
