---
phase: 07-design-mockups
plan: "03"
subsystem: ui
tags: [pencil, design, mockups, admin, settings, metric-cards, empty-states, error-states]

# Dependency graph
requires:
  - phase: 07-01
    provides: App Shell frame node ID xBwvY
  - phase: 07-02
    provides: Status badge palette (DSG-03 reference)
provides:
  - Admin Happy Path frame (node ID eeopV) with 4 metric cards, flagged hotels table, live activity feed
  - Settings Happy Path frame (node ID hFbn8) with config form (30/30/20/20 weights)
  - Settings No Config frame (node ID Jew2P) with centered empty state + seed command
  - Settings Save Error frame (node ID AbHaP) with destructive toast banner + error-bordered field
  - 04-admin-happy.png in .planning/designs/
  - 05-settings-happy.png in .planning/designs/
  - 05-settings-no-config.png in .planning/designs/
  - 05-settings-save-error.png in .planning/designs/
affects:
  - Phase 8 DSG-04 (metric card color contract: teal left-border for positive, destructive left-border for flagged)
  - Phase 8 Settings component sizing (form card 800px wide, input height 44px, grid gap 16px)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Same Pencil MCP subprocess stdio protocol as 07-01/02 (--app desktop)
    - Shell copied with C("xBwvY", frameId, {x:0, y:0}), then nav active state toggled per frame
    - Metric cards use asymmetric stroke thickness {left:3, top:1, right:1, bottom:1} for accent border effect
    - Settings form uses vertical layout card with nested horizontal grids for 2x2 field layout
    - Error toast uses horizontal layout frame with destructive fill (#FDE8E8) and border (#F08080)

key-files:
  created:
    - pencil-new.pen (updated - 4 new frames added; gitignored)
    - .planning/designs/04-admin-happy.png
    - .planning/designs/05-settings-happy.png
    - .planning/designs/05-settings-no-config.png
    - .planning/designs/05-settings-save-error.png
  modified: []

key-decisions:
  - "Metric card accent uses asymmetric stroke (left:3px teal or red, others 1px) — not a separate rectangle overlay — for Phase 8 DSG-04 implementation reference"
  - "Error state shows BOTH the destructive toast AND form with destructive-bordered Cleanliness input — two visual error signals as Phase 8 implementation contract"
  - "Settings form card width: 800px; input height: 44px; field grid gap: 16px; padding: 32px — Phase 8 component sizing reference"
  - "monospace font unavailable in Pencil desktop app — code hint pill uses Inter fontWeight:500 with muted background as visual substitute"

requirements-completed: [DSG-01]

# Metrics
duration: 12min
completed: 2026-03-26
---

# Phase 7 Plan 03: Design Mockups — Admin Dashboard and Settings Screens Summary

**4 frames designed (Admin happy path + 3 Settings states) with teal/destructive design system tokens, realistic Indian travel seed data, and settings form showing exact 30/30/20/20 weight config — establishing the Phase 8 DSG-04 metric card color contract and settings component sizing reference**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-26T17:28:20Z
- **Completed:** 2026-03-26T17:40:00Z
- **Tasks:** 2
- **Files modified:** 4 (PNG exports in .planning/designs/)

## Accomplishments

- Designed Admin Happy Path (frame `eeopV`): 4 metric cards (Total Feedbacks 14, Avg Score 3.6, Flagged Hotels 1, Total Hotels 6) with teal left-border accents on positive cards and destructive red left-border on flagged card; Flagged Hotels table showing Hotel Raj Palace Jaipur at 1.4/5.0 in a #FDE8E8 highlighted row with Review button; Live Activity feed with Priya Sharma/Arjun Mehta/Kavitha Nair/Rohan Verma entries and POSITIVE/URGENT/STABLE sentiment badges
- Designed Settings Happy Path (frame `hFbn8`): full config form with Scoring Weights (Cleanliness 30%, Service 30%, Value 20%, Amenities 20%), Trigger Settings (delay 24h, reminder 48h), Thresholds (flag below 2.0), Save Changes (teal pill) and Reset to Defaults (outline) action buttons
- Designed Settings No Config (frame `Jew2P`): centered wrench icon + "No Configuration Found" heading + subtext + `npm run seed` code pill
- Designed Settings Save Error (frame `AbHaP`): destructive red toast banner at top of content area + form visible below with Cleanliness input highlighted in destructive border
- Screenshot-validated all 4 frames; exported as PNGs to `.planning/designs/`

## Frame Node IDs (critical for Phase 8 reference)

| Frame | Node ID | PNG Export |
|-------|---------|------------|
| Admin - Happy Path | `eeopV` | 04-admin-happy.png |
| Settings - Happy Path | `hFbn8` | 05-settings-happy.png |
| Settings - No Config | `Jew2P` | 05-settings-no-config.png |
| Settings - Save Error | `AbHaP` | 05-settings-save-error.png |

## Admin Metric Card Color Reference (DSG-04 — Phase 8 Implementation Contract)

| Card | Accent Color | Token | Left Border Width |
|------|-------------|-------|-------------------|
| Total Feedbacks | Teal | `$primary` (#72D3C4) | 3px |
| Platform Avg Score | Teal | `$primary` (#72D3C4) | 3px |
| Flagged Hotels | Destructive Red | `$destructive` (#F08080) | 3px |
| Total Hotels | Teal | `$primary` (#72D3C4) | 3px |

**Implementation note:** Asymmetric stroke object — `{align:"inside", thickness:{left:3, top:1, right:1, bottom:1}, fill:"$primary"}` — creates the left-accent effect without an extra overlay element.

## Settings Form Field Dimensions (Phase 8 Component Sizing Reference)

| Property | Value |
|----------|-------|
| Form card width | 800px |
| Form card padding | 32px |
| Input height | 44px |
| Input corner radius | 8px |
| Field grid gap | 16px |
| Field width (2-column) | 352px each |
| Action button height | 44px |
| Action button corner radius | 999 (pill) |

## Settings State Visual Distinctions

| State | Key Visual Signal | Background |
|-------|-----------------|------------|
| Happy Path (config loaded) | Form with values, teal Save button | $card white |
| No Config (empty state) | Centered wrench icon, seed command pill | $background #F8FAFA |
| Save Error | Destructive red toast banner + field error border | $background with #FDE8E8 toast |

## Live Activity Feed Data (Admin)

| Time | Traveller | Hotel | Badge |
|------|-----------|-------|-------|
| 2h ago | Priya Sharma | Grand Hyatt Mumbai | POSITIVE (#E8F9F7 / #267268) |
| 4h ago | Arjun Mehta | Hotel Raj Palace Jaipur | URGENT (#FDE8E8 / #B03030) |
| 6h ago | Kavitha Nair | The Leela Delhi | POSITIVE (#E8F9F7 / #267268) |
| 8h ago | Rohan Verma | ITC Maurya New Delhi | STABLE (#F2F4F4 / #717373) |

## Task Commits

1. **Task 1: Admin dashboard happy path** — `9cf93c1`
2. **Task 2: Settings frames (3 states) + all exports** — `6ccbcad`

## Issues Encountered

- `export_nodes` unavailable in Pencil desktop app mode — worked around via `get_screenshot()` base64 decode to PNG (same as Plans 01-02)
- Font family 'monospace' and 'Courier New' both invalid in Pencil desktop app — used Inter font with muted background for code hint pill (visual effect preserved)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed monospace font fallback for code hint pill**
- **Found during:** Task 2 (Settings No Config frame)
- **Issue:** `fontFamily: "monospace"` and `"Courier New"` both reported as invalid by Pencil MCP
- **Fix:** Used `fontFamily: "Inter"` with `fontWeight: 500` on a muted background pill — preserves code-hint visual intent
- **Files modified:** pencil-new.pen (in-memory, gitignored)

## Self-Check: PASSED

- [x] `04-admin-happy.png` — EXISTS (13,821 bytes)
- [x] `05-settings-happy.png` — EXISTS (8,651 bytes)
- [x] `05-settings-no-config.png` — EXISTS (6,891 bytes)
- [x] `05-settings-save-error.png` — EXISTS (7,597 bytes)
- [x] Commit `9cf93c1` — Task 1: Admin dashboard happy path frame
- [x] Commit `6ccbcad` — Task 2: Settings frames (3 states) and all 4 plan exports
- [x] 9 total PNGs in .planning/designs/ (01-shell + 4 from plan 02 + 4 from this plan)

---
*Phase: 07-design-mockups*
*Completed: 2026-03-26*
