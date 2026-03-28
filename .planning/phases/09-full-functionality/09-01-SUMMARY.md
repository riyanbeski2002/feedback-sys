---
phase: 09-full-functionality
plan: 01
subsystem: notifications
tags: [supabase, live-data, select, notifications, previews]
dependency_graph:
  requires: [src/lib/supabase/client.ts, feedback table, bookings table, hotels table]
  provides: [live notifications page with submission selector]
  affects: [src/app/(dashboard)/notifications/page.tsx]
tech_stack:
  added: ["@radix-ui/react-select", "src/components/ui/select.tsx"]
  patterns: ["useEffect fetch on mount", "derived state from selected row", "null fallback display"]
key_files:
  created: [src/components/ui/select.tsx]
  modified: [src/app/(dashboard)/notifications/page.tsx, package.json]
decisions:
  - "Cast Supabase query result through unknown before FeedbackRow[] to avoid TS2352 error — Supabase infers joined relations as arrays but runtime returns single objects per row"
  - "feedbackLink and expiryTime kept static per CONTEXT.md — these are UI prototype values, not DB-driven"
  - "Score displayed as computed_score.toString() or \"—\" — no overall_score column exists in schema"
metrics:
  duration: "~20 min"
  completed: "2026-03-28"
  tasks: 2
  files: 3
---

# Phase 9 Plan 1: Live Notifications Page — Summary

Live Supabase-backed notifications page with submission selector; replaces hardcoded SAMPLE_DATA with real feedback rows joined from bookings and hotels tables.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Verify live DB feedback column state | (analysis, no commit) | schema confirmed: computed_score NOT NULL, no overall_score column |
| 2 | Replace SAMPLE_DATA with live Supabase fetch | 0804d88 | src/app/(dashboard)/notifications/page.tsx |

## What Was Built

The notifications page (`src/app/(dashboard)/notifications/page.tsx`) was fully rewritten:

- Removed the `SAMPLE_DATA` constant
- Added `FeedbackRow` type definition with bookings/hotels join shape
- `useEffect` on mount fetches from `feedback` table joined with `bookings` and `hotels`, ordered most recent first
- `selectedId` state drives which row's data flows into all four channel previews
- shadcn/ui `Select` dropdown (new component) renders the submission list above channel buttons
- Most recent submission auto-selected on load
- All four previews (Email, WhatsApp, Slack, Teams) now receive derived props from selected row
- Context Variables card extended with Score and Comment fields
- `computed_score` null handled: displays "—" without crashing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing @radix-ui/react-select package and Select component**
- **Found during:** Task 2 — plan calls for shadcn/ui Select but neither the npm package nor the component file existed
- **Issue:** `src/components/ui/select.tsx` not present; `@radix-ui/react-select` not in package.json
- **Fix:** Installed `@radix-ui/react-select --legacy-peer-deps`; created full shadcn/ui-compatible Select component at `src/components/ui/select.tsx`
- **Files modified:** `package.json`, `package-lock.json`, `src/components/ui/select.tsx`
- **Commit:** c0d1539

**2. [Rule 1 - Bug] TypeScript TS2352 cast error on Supabase query result**
- **Found during:** Task 2 — tsc reported incompatible types on the Supabase joined query result
- **Issue:** Supabase infers joined fields as arrays but at runtime they are single objects; direct `as FeedbackRow[]` cast fails type check
- **Fix:** Changed cast to `as unknown as FeedbackRow[]`
- **Files modified:** `src/app/(dashboard)/notifications/page.tsx`
- **Commit:** included in 0804d88

## Verification

- `npx tsc --noEmit` exits with 0 errors
- SAMPLE_DATA const removed; no hardcoded traveller/hotel strings remain
- All four channel preview components receive props from selected row state
- computed_score null displays "—" via conditional toString check

## Self-Check: PASSED

- FOUND: src/app/(dashboard)/notifications/page.tsx
- FOUND: src/components/ui/select.tsx
- FOUND: commit c0d1539 (select component)
- FOUND: commit 0804d88 (page rewrite)
