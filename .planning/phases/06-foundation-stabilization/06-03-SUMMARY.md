---
phase: 06-foundation-stabilization
plan: "03"
subsystem: database
tags: [seed, supabase, typescript, ts-node, dotenv, idempotent, demo-data]

# Dependency graph
requires:
  - phase: 06-01
    provides: Tailwind v4.2.2 stable build environment — confirms project runs cleanly before DB changes

provides:
  - Idempotent seed script with hotel count guard (exits early on re-run)
  - 14 pre-submitted feedback rows covering all 4 sentiment scenarios (Positive, Neutral, Negative, multi-category)
  - 6 hotels across all 4 status tiers (top_rated, stable, needs_review, flagged)
  - Stable UUID constants for deterministic FK references
  - dotenv in devDependencies for clean-install compatibility
  - src/scripts/tsconfig.json CommonJS override for ts-node

affects:
  - Phase 07 (Pencil MCP mockup) — Hotels page now has real status-tier data to design against
  - Phase 09 (dynamic features) — feedback table populated with realistic scoring data
  - Any plan referencing seed script behavior

# Tech tracking
tech-stack:
  added: [dotenv ^17.3.1 (devDependency)]
  patterns:
    - Hotel count guard pattern — count > 0 exits early before any inserts
    - Stable UUID constant objects at top of seed for FK refs without DB lookups
    - upsert with explicit onConflict column for every table (id, singleton, booking_id)

key-files:
  created:
    - src/scripts/tsconfig.json
  modified:
    - src/scripts/seed.ts
    - package.json

key-decisions:
  - "Use hotel count guard (count > 0) rather than per-row duplicate detection — simpler and sufficient for seed idempotency"
  - "Stable UUID constants in HOTEL_IDS/BOOKING_IDS avoid DB round-trips and guarantee consistent FK refs across environments"
  - "feedback_config upsert uses onConflict: singleton (schema-level constraint) not id — matches existing DB schema"
  - "feedback upsert uses onConflict: booking_id per schema unique constraint, not id"
  - "dotenv installed with --legacy-peer-deps due to React 19 / next-themes peer dependency conflict in project"

patterns-established:
  - "Idempotent seed pattern: count guard at entry, upsert with explicit onConflict on every table"
  - "Demo data organisation: stable UUID objects at top, completed feedback bookings then open bookings, feedback rows grouped by sentiment"

requirements-completed: [FND-03, FND-04, DAT-04]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 6 Plan 03: Idempotent Seed with Demo Feedback Data Summary

**Fully idempotent seed script: hotel count guard, stable UUID constants, 14 Indian corporate travel feedback rows across all 4 sentiment/status scenarios, dotenv in devDependencies, and ts-node CommonJS override**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-26T12:45:00Z
- **Completed:** 2026-03-26T12:47:46Z
- **Tasks:** 2
- **Files modified:** 3 modified, 1 created

## Accomplishments

- Rewrote seed script to be fully idempotent — running twice creates no duplicate rows, prints friendly skip message on second run
- Added 14 realistic feedback rows using Indian corporate travel context (Priya Sharma, Arjun Mehta, Kavitha Nair, Rohan Verma, Sneha Iyer, Amit Patel) covering all four sentiment scenarios
- Added `dotenv` to `devDependencies` and created `src/scripts/tsconfig.json` with `"module": "commonjs"` to fix ts-node/ESM incompatibility on clean installs

## Task Commits

Each task was committed atomically:

1. **Task 1: Add dotenv to devDependencies and create scripts tsconfig** - `341a4d0` (chore)
2. **Task 2: Rewrite seed script — idempotent with demo feedback data** - `63300e0` (feat)

## Files Created/Modified

- `src/scripts/seed.ts` — Full rewrite: hotel count guard, HOTEL_IDS/BOOKING_IDS stable UUID constants, upsert on all tables, 14 feedback rows with Indian corporate travel content
- `src/scripts/tsconfig.json` — New file: CommonJS module override extending root tsconfig for ts-node compatibility
- `package.json` — Added `dotenv ^17.3.1` to devDependencies; updated seed script to use `--project src/scripts/tsconfig.json`

## Decisions Made

- Hotel count guard uses a `count > 0` query before all inserts — simpler than per-row idempotency checks and fully sufficient for seed purposes
- Stable UUID constants (`HOTEL_IDS`, `BOOKING_IDS`) defined at the top of the file eliminate any need for DB lookups when building FK references
- `feedback_config` upsert uses `onConflict: 'singleton'` matching the schema-level constraint on the table
- `feedback` upsert uses `onConflict: 'booking_id'` per the `booking_id uuid not null unique` constraint in the schema
- `dotenv` installed with `--legacy-peer-deps` because the project has a known React 19 / next-themes@0.3.0 peer dependency conflict that pre-existed this plan

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

`npm install --save-dev dotenv` failed on first attempt due to a pre-existing peer dependency conflict between React 19 and `next-themes@0.3.0`. Re-ran with `--legacy-peer-deps` (consistent with how the project was originally installed). No scope change.

## User Setup Required

None — no external service configuration required. To test the seed run `npm run seed` against a Supabase project with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in `.env.local`.

## Next Phase Readiness

- Hotels table will have 6 entries across all 4 status tiers after first seed — ready for Pencil MCP mockup design work in Phase 7
- Feedback table will have 14 rows with realistic scoring — Notifications page will show real data, hotel status badges reflect accurate score distribution
- Seed is safe to run on any environment without risk of duplicates

---
*Phase: 06-foundation-stabilization*
*Completed: 2026-03-26*
