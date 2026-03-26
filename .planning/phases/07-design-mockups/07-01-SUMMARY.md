---
phase: 07-design-mockups
plan: "01"
subsystem: ui
tags: [pencil, design, mockups, design-tokens, app-shell, ziptrrip]

# Dependency graph
requires:
  - phase: 06-foundation-stabilization
    provides: stable DB, CSS token values in globals.css
provides:
  - pencil-new.pen file with 12 Ziptrrip design tokens registered
  - App Shell frame (node ID xBwvY) ready for Copy embedding in Plans 02-04
  - 01-shell.png in .planning/designs/ as frozen visual reference
affects:
  - 07-02 (needs App Shell node ID for Copy operations)
  - 07-03 (needs App Shell node ID for Copy operations)
  - 07-04 (needs App Shell node ID for Copy operations)
  - 07-05 (needs App Shell node ID for Copy operations)

# Tech tracking
tech-stack:
  added: [Pencil MCP (desktop app, v1.1.26), mcp-server-darwin-arm64]
  patterns:
    - Pencil MCP invoked via subprocess stdio protocol against desktop app
    - Design tokens set with set_variables (replace: true) for full token ownership
    - App Shell built in 4 batch_design layers (frame, nav, footer+header, header-right+content)

key-files:
  created:
    - pencil-new.pen (gitignored design file - App Shell frame at node xBwvY)
    - .planning/designs/01-shell.png (PNG screenshot of completed App Shell)
  modified: []

key-decisions:
  - "App Shell node ID is xBwvY — all Wave 2 plans (07-02 through 07-05) must use C(\"xBwvY\", ...) to embed the shell"
  - "Pencil desktop app (--app desktop) used for MCP connection, not antigravity variant"
  - "All 12 Ziptrrip tokens set with replace:true, clearing all previous incorrect variables"
  - "Sidebar uses layout:none with absolute x,y positioning for nav items (240x900px fixed)"
  - "Content zone (D5DNG) at x:240 y:80, 1200x820px — placeholder for screen-specific content"

patterns-established:
  - "Pattern 1: Pencil subprocess protocol — send init + tool/call JSON to mcp-server-darwin-arm64 --app desktop"
  - "Pattern 2: Variable references use $variable-name syntax (e.g., $primary, $accent-foreground)"
  - "Pattern 3: Build frames in batches of ≤25 ops: frame+structure, nav items, footer+header, header-right+content"
  - "Pattern 4: After each layer, verify with snapshot_layout to catch clipping/positioning issues"

requirements-completed: [DSG-01]

# Metrics
duration: 37min
completed: 2026-03-26
---

# Phase 7 Plan 01: Design Mockups — App Shell Foundation Summary

**Pencil .pen file initialized with 12 Ziptrrip design tokens and a validated 1440x900 App Shell frame (sidebar + header) at node ID xBwvY ready for embedding in all screen mockups**

## Performance

- **Duration:** 37 min
- **Started:** 2026-03-26T15:58:28Z
- **Completed:** 2026-03-26T16:35:58Z
- **Tasks:** 2
- **Files modified:** 2 (pencil-new.pen, .planning/designs/01-shell.png)

## Accomplishments

- Registered all 12 Ziptrrip design tokens (primary #72D3C4, accent #E8F9F7, etc.) as named variables in pencil-new.pen, replacing previous incomplete/incorrect variable set
- Designed the App Shell frame (1440x900px) with correct 240px sidebar (ziptrrip logo, FEEDBACK INTEL subtext, 5 nav items with Dashboard active in teal, "Verified Stays Only" footer card)
- Designed 80px header with SidebarTrigger, "PROJECT / Feedback Intelligence" breadcrumb, Business/Personal pill toggle, and theme button
- Screenshot-validated the frame — sidebar, header, active nav state, and content placeholder all visually confirmed correct
- Documented App Shell node ID `xBwvY` for Wave 2 plans to use in Copy operations

## Critical Information for Wave 2 Plans

**App Shell Frame:**
- **Node ID:** `xBwvY`
- **Dimensions:** 1440 × 900px
- **File:** `/Users/User/Documents/feedback-sys/pencil-new.pen`

**Sub-node IDs (for targeted updates):**
- Sidebar: `1XUj4` (240×900, x:0, y:0)
- Header: `RCdfd` (1200×80, x:240, y:0)
- Content zone: `D5DNG` (1200×820, x:240, y:80)
- Logo area: `ndwWQ`
- Nav Dashboard (active): `0X1yx`
- Nav Bookings: `plDn7`
- Nav Hotels: `tfBfZ`
- Nav Notifications: `6M6xl`
- Nav Settings: `2fF4I`
- Footer card: `qBOIV`

**Copy operation syntax for Wave 2:**
```javascript
shellCopy=C("xBwvY", "targetFrameId", {x: 0, y: 0})
```

## Design Tokens Registered

All 12 Ziptrrip tokens confirmed via `get_variables()`:

| Token | Value |
|-------|-------|
| primary | #72D3C4 |
| primary-foreground | #FFFFFF |
| background | #F8FAFA |
| foreground | #181A1A |
| card | #FFFFFF |
| muted | #F2F4F4 |
| muted-foreground | #717373 |
| accent | #E8F9F7 |
| accent-foreground | #267268 |
| destructive | #F08080 |
| border | #E9ECEC |
| radius | 12 |

## Task Commits

Each task was committed atomically:

1. **Task 1: Register design tokens** — No code commit (design tokens stored in Pencil app in-memory; .pen file is gitignored)
2. **Task 2: Design App Shell frame** — `e2d2a45` (feat: App Shell frame + PNG export)

**Note:** The `pencil-new.pen` file is in `.gitignore` (*.pen pattern). Design artifacts are tracked via the PNG exports in `.planning/designs/`.

## Files Created/Modified

- `pencil-new.pen` — Ziptrrip design tokens + App Shell frame with node ID xBwvY (gitignored, managed by Pencil app)
- `.planning/designs/01-shell.png` — Screenshot of App Shell, frozen visual reference for Phase 8

## Decisions Made

1. **Pencil desktop app mode** — Used `--app desktop` subprocess connection (not antigravity), which connects to the running Pencil.app at `/Users/User/Applications/Pencil.app`
2. **Token replacement strategy** — Used `replace: true` in `set_variables` to clear all previous incorrect/incomplete variables and establish clean Ziptrrip token ownership
3. **Sidebar layout: none** — Sidebar uses absolute positioning (not flexbox) for nav items to match the spec's exact y-coordinate placement requirements
4. **App Shell as flat frame** — Built as a single top-level frame with absolutely-positioned children (sidebar, header, content zone) rather than flexbox layout, matching the Pencil MCP's absolute positioning model

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Deleted duplicate App Shell frame**
- **Found during:** Task 2 (after running layer batch calls in separate subprocess invocations)
- **Issue:** Each subprocess call re-creates the document state from the running Pencil app; the first two batch calls created two App Shell frames (xBwvY and YIeH6)
- **Fix:** Deleted duplicate frame YIeH6 immediately in the next call
- **Verification:** `batch_get` patterns search confirmed only xBwvY remains

**2. [Rule 1 - Bug] Fixed nav item widths from fill_container to explicit 208px**
- **Found during:** Task 2 layout verification
- **Issue:** Nav items used fill_container sizing but sidebar has layout:none, causing 0-width renders
- **Fix:** Updated all 5 nav items with explicit width:208, x:16
- **Verification:** snapshot_layout confirmed correct dimensions

**3. [Rule 1 - Bug] Fixed content zone x position from 1440 to 240**
- **Found during:** Task 2 snapshot_layout check — content zone was fully clipped (at x:1440)
- **Issue:** App Shell frame default layout placed the 3rd child beyond the frame boundary
- **Fix:** Set layout:none on App Shell, explicit x:240, y:80 on content zone
- **Verification:** snapshot_layout shows D5DNG at x:240, y:80, height:820 — correct

---

**Total deviations:** 3 auto-fixed (Rule 1 bugs — all layout/positioning corrections)
**Impact on plan:** All auto-fixes required for visual correctness. No scope changes.

## Issues Encountered

- **Pencil MCP tool availability:** The `export_nodes` tool is not available in the Pencil desktop app version (only in the antigravity variant). Worked around by saving `get_screenshot` PNG output directly to `.planning/designs/`.
- **Subprocess state isolation:** Each MCP subprocess call initializes a fresh connection to the Pencil desktop app. Node IDs from previous calls remain valid (app persists state) but binding variables from one call cannot be used in the next — required tracking node IDs manually between calls.

## Next Phase Readiness

- App Shell node ID `xBwvY` documented and ready for Copy operations in Plans 02-04
- All 12 design tokens available via `$token-name` variable references in any future `batch_design` call
- `.planning/designs/` directory exists and ready for subsequent PNG exports
- Pencil desktop app (`--app desktop`) confirmed working connection for all remaining Phase 7 plans

---
*Phase: 07-design-mockups*
*Completed: 2026-03-26*
