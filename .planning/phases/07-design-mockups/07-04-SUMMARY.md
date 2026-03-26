---
phase: 07-design-mockups
plan: "04"
subsystem: ui
tags: [pencil, design, mockups, notifications, channels, email, slack, teams, whatsapp, dsg-02]

# Dependency graph
requires:
  - phase: 07-design-mockups
    plan: "01"
    provides: App Shell frame node ID xBwvY, pencil-new.pen with 12 Ziptrrip design tokens
provides:
  - Notifications 2x2 Grid frame (node iUQSp) in pencil-new.pen
  - 06-notifications-grid.png in .planning/designs/
  - Per-channel color/layout contract: Email (white, email-client), Slack (dark #1A1D21), Teams (white, MS card), WA (#ECE5DD beige)
  - DSG-02 fulfilled: pixel-accurate notification format designs for all 4 channels
affects:
  - 08-css-implementation (per-channel component implementation uses these color/layout contracts)
  - Phase 8 notification components must replicate: Slack dark bg, Teams purple accents, WA beige wallpaper, Email teal/red header bars

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Notifications frame uses App Shell Copy (C("xBwvY")) + absolute-positioned cell containers above the shell layer
    - Each channel cell is a child frame of iUQSp with channel-specific background fill and nested content
    - "Left-border accent" pattern for Slack attachment blocks: 4px colored rectangle at x:0, full height
    - Top-bar accent pattern for Email/Teams cards: 6-8px rectangle at y:0 with channel brand color

key-files:
  created:
    - pencil-new.pen (updated — Notifications frame at node iUQSp)
    - .planning/designs/06-notifications-grid.png (PNG screenshot of 2x2 grid)
  modified: []

key-decisions:
  - "Notifications frame node ID: iUQSp (1440x1080px, at canvas x:7700, y:0)"
  - "Email cell node ID: kGX90 — white bg, email-client chrome with envelope icon, subject lines, teal/red card header bars"
  - "Slack cell node ID: KSnCV — dark #1A1D21 bg, #121016 channel header, left-border attachment blocks (teal=positive, #F08080=urgent)"
  - "Teams cell node ID: 8QMna — white bg, #E8E8F0 header, MS Adaptive Card style, #6264A7 Teams purple for buttons/icons, #D83B01 for urgent"
  - "WhatsApp cell node ID: ZCzgj — #ECE5DD beige bg, #075E54 dark green header, white message bubbles with rounded corners"
  - "Phase 8 implementation contract: replicate per-channel chrome exactly — dark bg for Slack, beige wallpaper for WA, purple accents for Teams"

patterns-established:
  - "Pattern 5: Notifications 2x2 grid — 4 cells at fixed positions: TL=Email(264,208), TR=Slack(850,208), BL=Teams(264,628), BR=WA(850,628), each 566x400px"
  - "Pattern 6: Dual-example layout — positive example first (y:60-200), divider, urgent example second (y:210-360) within each cell"

requirements-completed: [DSG-01, DSG-02]

# Metrics
duration: 14min
completed: 2026-03-26
---

# Phase 7 Plan 04: Design Mockups — Notifications 2x2 Channel Grid Summary

**Pixel-accurate 2x2 notification grid with native channel chrome for Email, Slack (#1A1D21 dark), MS Teams (#E8E8F0 header, #6264A7 purple), and WhatsApp (#ECE5DD beige) showing both positive (4.7 Grand Hyatt) and URGENT (1.4 Raj Palace) feedback examples**

## Performance

- **Duration:** 14 min
- **Started:** 2026-03-26T17:44:11Z
- **Completed:** 2026-03-26T17:58:18Z
- **Tasks:** 2
- **Files modified:** 2 (pencil-new.pen, .planning/designs/06-notifications-grid.png)

## Accomplishments

- Designed Notifications - 2x2 Grid frame (1440x1080px, node iUQSp) with App Shell embedded (xBwvY copy) and Notifications nav item set to active state
- Email cell (kGX90): email client viewport chrome — envelope icon header, support@ziptrrip.com address, archive/reply/forward/delete toolbar, subject lines, teal top-bar on positive card, red top-bar on URGENT card, "View Full Report" CTA button
- Slack cell (KSnCV): full dark mode — #1A1D21 background, #121016 channel header (#feedback-alerts), bot avatar (orange #E8813A "Z"), teal left-border positive attachment, #F08080 red left-border URGENT attachment, both in #2A2D31 dark card
- Teams cell (8QMna): Microsoft Adaptive Card style — #E8E8F0 Teams gray header, #6264A7 purple logo, white card with score breakdown, #107C10 green POSITIVE pill, #D83B01 red URGENT alert with top bar
- WhatsApp cell (ZCzgj): #ECE5DD beige wallpaper, #075E54 dark green header, #25D366 avatar, white message bubbles, timestamp + double-checkmark, "Today" date separator pill, #FFE5E5 red URGENT badge
- Exported 06-notifications-grid.png (DSG-02 visual reference for Phase 8 component code)

## Critical Information for Phase 8

**Notifications Frame:**
- **Node ID:** `iUQSp`
- **Dimensions:** 1440x1080px
- **Canvas position:** x:7700, y:0

**Cell Node IDs:**
| Cell | Node ID | Position | Background |
|------|---------|----------|------------|
| Email (TL) | `kGX90` | x:264, y:208 | #FFFFFF |
| Slack (TR) | `KSnCV` | x:850, y:208 | #1A1D21 |
| Teams (BL) | `8QMna` | x:264, y:628 | #FFFFFF |
| WhatsApp (BR) | `ZCzgj` | x:850, y:628 | #ECE5DD |

**Per-Channel Color Contracts for Phase 8:**

| Channel | Background | Header | Positive Accent | Urgent Accent |
|---------|-----------|--------|----------------|---------------|
| Email | #FFFFFF | #FFFFFF (with border) | #72D3C4 top bar | #F08080 top bar |
| Slack | #1A1D21 | #121016 | #72D3C4 left border | #F08080 left border |
| Teams | #FFFFFF | #E8E8F0 | #107C10 (green pill) | #D83B01 (red bar) |
| WhatsApp | #ECE5DD | #075E54 | #25D366 (green) | #D00000 (red) |

**Phase 8 Implementation Notes:**
- Slack channel header text: white on #121016 dark
- Teams uses #6264A7 purple for button outlines and channel icons
- WA bubbles: white background, left-align sender line in #075E54 teal, timestamp right-aligned in muted gray
- All URGENT examples show destructive styling — red accents, red score text, red sentiment pill

## Task Commits

1. **Task 1: Design Notifications frame (2x2 channel grid)** — `586b9ab` (feat: Notifications 2x2 grid with native channel chrome + PNG export)
2. **Task 2: Export Notifications frame as PNG** — included in same commit (PNG saved via get_screenshot)

## Files Created/Modified

- `pencil-new.pen` — Notifications 2x2 Grid frame at node iUQSp (gitignored, managed by Pencil app)
- `.planning/designs/06-notifications-grid.png` — Screenshot PNG, frozen DSG-02 visual reference for Phase 8

## Decisions Made

1. **6 batch_design calls** — Frame was built across 6 calls (frame+shell+cells, nav fix+email-positive, email-urgent+slack-header, slack attachments+teams header, teams cards, whatsapp cell) to stay within the 25 ops per call limit
2. **Nav active state update** — Dashboard (SR9TE) had `fill:$accent` from the App Shell copy; updated to `fill:null` and set Notifications (F2GNd) to `fill:$accent` in Call 2
3. **get_screenshot for PNG export** — `export_nodes` is not available in Pencil desktop app mode (confirmed in 07-01 SUMMARY); used `get_screenshot` with manual base64 decode to save PNG to `.planning/designs/`
4. **iUQSp height 1080px** — Taller than standard 900px shell to accommodate 2 rows of 400px cells (208+400+20+400 = ~1028px + header area = 1080px comfortable)

## Deviations from Plan

None — plan executed exactly as written. The 6-call breakdown matched the plan's "4-5 calls total" estimate closely.

## Issues Encountered

- **export_nodes unavailable** — Known issue from 07-01: Pencil desktop app mode does not expose `export_nodes`. Worked around by saving `get_screenshot` base64 PNG output directly to `.planning/designs/06-notifications-grid.png` (same approach as all previous Phase 7 plans).

## Self-Check

- [x] iUQSp frame exists in pencil-new.pen (confirmed via snapshot_layout)
- [x] .planning/designs/06-notifications-grid.png exists (confirmed via ls, 6546 bytes)
- [x] commit 586b9ab exists (git log confirmed)
- [x] 4 channel cells at correct positions: kGX90(Email), KSnCV(Slack), 8QMna(Teams), ZCzgj(WA)
- [x] Both positive (4.7 Grand Hyatt Mumbai) and URGENT (1.4 Raj Palace Jaipur) in all cells
- [x] Slack dark background (#1A1D21) — set during cell creation
- [x] WhatsApp beige (#ECE5DD) — set during cell creation
- [x] Teams white with MS card style — set during cell creation
- [x] Email client chrome — header, toolbar, subject lines built

## Self-Check: PASSED

## Next Phase Readiness

- DSG-02 fulfilled: all 4 notification channel designs complete with pixel-accurate native chrome
- Phase 8 (CSS implementation) can use per-channel color/layout contract table above to implement notification components
- All Phase 7 designs (Plans 01-04) complete — App Shell, Hotels, Bookings, Admin, Settings (3 states), Notifications
- Plan 05 (remaining if any) can proceed; Phase 7 is otherwise ready for Phase 8 approval gate

---
*Phase: 07-design-mockups*
*Completed: 2026-03-26*
