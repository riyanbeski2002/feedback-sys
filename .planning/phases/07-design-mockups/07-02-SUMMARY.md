---
phase: 07-design-mockups
plan: "02"
subsystem: ui
tags: [pencil, design, mockups, hotels, bookings, status-badges, teal-palette]

# Dependency graph
requires:
  - phase: 07-01
    provides: App Shell frame node ID xBwvY
provides:
  - Hotels Happy Path frame (node ID 3zHc0) with 8 hotel cards, teal-derived status badges
  - Hotels Empty State frame (node ID hD10W) with centered empty-state content
  - Bookings Happy Path frame (node ID lC1cg) with 6-row table and action buttons
  - Bookings Empty State frame (node ID hzMqD) with centered empty-state content
  - 02-hotels-happy.png in .planning/designs/
  - 02-hotels-empty.png in .planning/designs/
  - 03-bookings-happy.png in .planning/designs/
  - 03-bookings-empty.png in .planning/designs/
affects:
  - 07-03 (needs App Shell node ID for Copy operations)
  - 07-04 (needs App Shell node ID for Copy operations)
  - 07-05 (needs App Shell node ID for Copy operations)
  - Phase 8 (DSG-03 status badge palette established here as visual reference)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Same Pencil MCP subprocess stdio protocol as 07-01 (--app desktop)
    - Shell copied into each frame with C("xBwvY", targetFrameId, {x:0, y:0})
    - Nav active state updated by: U(dashboardNodeId, {fill:null}) + U(targetNavId, {fill:"$accent"})
    - Hotel cards built in hotel-grid frame (layout horizontal + wrap:true) with 352px wide cards
    - Booking table uses nested frames: table-container (vertical layout) > table-header + row frames (horizontal layout)

key-files:
  created:
    - pencil-new.pen (updated - 4 new frames added; gitignored)
    - .planning/designs/02-hotels-happy.png
    - .planning/designs/02-hotels-empty.png
    - .planning/designs/03-bookings-happy.png
    - .planning/designs/03-bookings-empty.png
  modified: []

key-decisions:
  - "Status badge palette uses 4 teal-derived semantic colors: Top Rated (#E8F9F7/#267268), Reliable (#E8F8F0/#2D7260), Needs Review (#FEF3E8/#8B5E28), Flagged (#FDE8E8/#B03030) — establishes Phase 8 DSG-03 reference"
  - "Booking status pill colors: Completed (teal accent, same as Top Rated), Feedback Submitted (muted #F2F4F4), Confirmed (blue-muted #E8F0FF/#3D5AB0)"
  - "Hotel card dimensions: 352x160px, padding 20px, layout:none with absolute inner positioning"
  - "Submit Feedback CTA: teal outline pill button (stroke #72D3C4, text #267268, cornerRadius:999)"
  - "Screenshots saved via get_screenshot() base64 decode (export_nodes unavailable in desktop app mode)"

requirements-completed: [DSG-01]

# Metrics
duration: 30min
completed: 2026-03-26
---

# Phase 7 Plan 02: Design Mockups — Hotels and Bookings Screens Summary

**4 screen frames (Hotels + Bookings, happy path + empty state) designed with teal-derived status badge palette and realistic Indian corporate travel data, all exported as PNG references for Phase 8 DSG-03 implementation**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-03-26T16:43:52Z
- **Completed:** 2026-03-26T16:58:00Z
- **Tasks:** 2
- **Files modified:** 4 (PNG exports in .planning/designs/)

## Accomplishments

- Designed Hotels Happy Path (frame `3zHc0`): 8 hotel cards in 3-column wrap grid with teal-derived status badges and realistic Indian hotel names/scores
- Designed Hotels Empty State (frame `hD10W`): centered building icon placeholder, "No Hotels Yet" heading, subtext, `npm run seed` code pill
- Designed Bookings Happy Path (frame `lC1cg`): 6-row table with booking IDs, hotel names, Indian traveller names, dates, status pills, and "Submit Feedback" CTA buttons
- Designed Bookings Empty State (frame `hzMqD`): centered calendar icon placeholder, "No Bookings Yet" heading, subtext
- Screenshot-validated all 4 frames; exported as PNGs to `.planning/designs/`

## Frame Node IDs (critical for Phase 8 reference)

| Frame | Node ID | PNG Export |
|-------|---------|------------|
| Hotels - Happy Path | `3zHc0` | 02-hotels-happy.png |
| Hotels - Empty State | `hD10W` | 02-hotels-empty.png |
| Bookings - Happy Path | `lC1cg` | 03-bookings-happy.png |
| Bookings - Empty State | `hzMqD` | 03-bookings-empty.png |

## Status Badge Color Reference (DSG-03 — Phase 8 Implementation Contract)

| Status | Background | Text Color | Dot Accent |
|--------|-----------|------------|------------|
| Top Rated | `#E8F9F7` | `#267268` | `#72D3C4` |
| Reliable | `#E8F8F0` | `#2D7260` | `#52C4A0` |
| Needs Review | `#FEF3E8` | `#8B5E28` | `#F59E42` |
| Flagged | `#FDE8E8` | `#B03030` | `#F08080` |

**Booking status pills (additional):**

| Status | Background | Text Color |
|--------|-----------|------------|
| Completed | `#E8F9F7` | `#267268` |
| Feedback Submitted | `#F2F4F4` | `#717373` |
| Confirmed | `#E8F0FF` | `#3D5AB0` |

All hotel status badges use pill shape (cornerRadius: 999), NOT hardcoded green/orange/red.

## Visual Decisions Made

- **Hotel card spacing**: 24px gap between cards, 3-column grid starting at x:264 (right of sidebar), y:188
- **Card dimensions**: 352×160px, white background, 12px border radius, 1px border `#E9ECEC`
- **Badge legend**: placed at y:148 showing all 4 status types as visual key for users
- **Table column widths**: Booking ID (120px), Hotel (220px), Traveller (160px), Dates (200px), Status (variable pill), Action (160px)
- **Table header**: `#F2F4F4` background, 44px height, uppercase 12px semibold text
- **Alternating row colors**: white / `#F8FAFA` for visual separation
- **Action buttons**: teal outline pill (cornerRadius:999) for "Submit Feedback", muted ghost for "View Feedback", dash for Confirmed rows

## Hotel Data Used (Hotels Happy Path)

| Hotel | Location | Score | Status |
|-------|----------|-------|--------|
| Grand Hyatt Mumbai | Mumbai | 4.8 | Top Rated |
| The Leela Delhi | New Delhi | 4.2 | Reliable |
| ITC Maurya New Delhi | New Delhi | 3.9 | Reliable |
| Taj Lands End Mumbai | Mumbai | 3.5 | Needs Review |
| Taj Bangalore | Bangalore | 3.1 | Needs Review |
| JW Marriott Pune | Pune | 2.8 | Needs Review |
| Hotel Raj Palace Jaipur | Jaipur | 1.4 | Flagged |
| Trident Chennai | Chennai | 4.1 | Reliable |

## Booking Data Used (Bookings Happy Path)

| ID | Hotel | Traveller | Dates | Status | Action |
|----|-------|-----------|-------|--------|--------|
| BK-001 | Grand Hyatt Mumbai | Priya Sharma | 15–18 Mar 2026 | Completed | Submit Feedback |
| BK-002 | The Leela Delhi | Arjun Mehta | 10–12 Mar 2026 | Feedback Submitted | View Feedback |
| BK-003 | ITC Maurya New Delhi | Kavitha Nair | 20–22 Mar 2026 | Confirmed | — |
| BK-004 | Taj Lands End Mumbai | Rohan Verma | 25–28 Mar 2026 | Completed | Submit Feedback |
| BK-005 | Hotel Raj Palace Jaipur | Vikram Singh | 5–7 Mar 2026 | Feedback Submitted | View Feedback |
| BK-006 | JW Marriott Pune | Ananya Iyer | 28–30 Mar 2026 | Confirmed | — |

## Task Commits

1. **Task 1: Hotels Happy Path + Empty State** — `d6e32ee`
2. **Task 2: Bookings Happy Path + Empty State + exports** — `8238905`

## Issues Encountered

- Same as 07-01: `export_nodes` unavailable in Pencil desktop app mode — worked around via `get_screenshot()` base64 decode to PNG
- `open_document` argument is `filePathOrTemplate` (not `filePathOrNew` as some docs suggest)
- Nav active state requires two operations per frame: remove `$accent` fill from Dashboard copy node, set `$accent` fill on target nav copy node

## Deviations from Plan

None — plan executed exactly as written. All 4 frames designed and exported successfully.

## Self-Check: PASSED

- [x] `02-hotels-happy.png` — EXISTS (6,545 bytes)
- [x] `02-hotels-empty.png` — EXISTS (6,905 bytes)
- [x] `03-bookings-happy.png` — EXISTS (14,126 bytes)
- [x] `03-bookings-empty.png` — EXISTS (6,667 bytes)
- [x] Commit `d6e32ee` — EXISTS
- [x] Commit `8238905` — EXISTS

---
*Phase: 07-design-mockups*
*Completed: 2026-03-26*
