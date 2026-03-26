---
phase: 06-foundation-stabilization
plan: "01"
subsystem: ui
tags: [tailwindcss, css, tokens, design-system, postcss]

# Dependency graph
requires: []
provides:
  - Tailwind CSS stable v4.2.2 (both tailwindcss and @tailwindcss/postcss pinned)
  - Correct Tailwind v4 CSS token structure with @theme inline and hsl() wrappers
  - :root and .dark token blocks at top-level scope (outside @layer base)
affects: [07-design-mockups, 08-css-implementation, all UI phases]

# Tech tracking
tech-stack:
  added: [tailwindcss@4.2.2, "@tailwindcss/postcss@4.2.2"]
  patterns:
    - "@theme inline pattern: use @theme inline (not @theme) so var() references are preserved without OKLCH conversion"
    - "Token scope pattern: :root and .dark CSS custom properties must live outside @layer base in Tailwind v4"
    - "HSL wrapper pattern: all HSL values must be wrapped in hsl() — bare numbers are not valid CSS colors in v4"

key-files:
  created: []
  modified:
    - package.json
    - src/app/globals.css

key-decisions:
  - "Pin tailwindcss and @tailwindcss/postcss to exact version 4.2.2 (no caret) — version mismatch between these two packages causes PostCSS integration failures"
  - "Use --legacy-peer-deps for npm install — next-themes@0.3.0 metadata lists React 18 max but code is compatible with React 19; this is a metadata-only issue"
  - "@theme inline is required (not @theme) so var() CSS variable references in color mappings are preserved as-is; without inline, Tailwind v4 attempts OKLCH conversion and silently emits empty strings"

patterns-established:
  - "Tailwind v4 token pattern: @import tailwindcss → :root tokens → .dark tokens → @theme inline mappings → @layer base utilities"
  - "HSL values must always use hsl() wrapper in CSS custom properties for Tailwind v4 compatibility"

requirements-completed: [FND-01, FND-02]

# Metrics
duration: 1min
completed: 2026-03-26
---

# Phase 6 Plan 01: Tailwind v4 Stabilization Summary

**Upgraded tailwindcss from broken alpha 4.0.0-alpha.25 to stable 4.2.2 and rewrote globals.css with correct v4 token structure: @theme inline, hsl() wrappers on all 38 token values, and :root/.dark blocks moved outside @layer base**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-26T12:41:01Z
- **Completed:** 2026-03-26T12:42:40Z
- **Tasks:** 2
- **Files modified:** 3 (package.json, package-lock.json, src/app/globals.css)

## Accomplishments

- Replaced broken alpha build `tailwindcss@4.0.0-alpha.25` with stable `tailwindcss@4.2.2` (both packages pinned exactly)
- Rewrote globals.css: moved `:root` and `.dark` from inside `@layer base` to top-level scope
- Added `hsl()` wrappers to all 38 bare HSL token values across `:root` and `.dark` blocks
- Changed `@theme {}` to `@theme inline {}` so `var()` references are preserved without OKLCH conversion attempt
- `npm run build` passes cleanly with no CSS errors after migration

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade Tailwind to stable v4.2.2** - `1b30b35` (chore)
2. **Task 2: Migrate globals.css to correct Tailwind v4 token structure** - `215d51e` (feat)

## Files Created/Modified

- `package.json` - Upgraded tailwindcss and @tailwindcss/postcss from 4.0.0-alpha.25 to exact pin 4.2.2
- `package-lock.json` - Updated lockfile reflecting 4.2.2 install
- `src/app/globals.css` - Full structural migration: @theme inline, hsl() wrappers, :root/.dark at top level

## Decisions Made

- Pinned both packages to exact `4.2.2` (no caret) after npm default-installed `^4.2.2` — matching versions required for PostCSS integration stability
- Used `--legacy-peer-deps` during install because `next-themes@0.3.0` metadata caps React at v18 but is functionally compatible with React 19; no code changes needed
- `@theme inline` is the critical fix: without it, Tailwind v4 tries to convert `var(--primary)` to OKLCH and gets an empty string since the value is not a literal color

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed npm version pin — caret prefix installed despite exact version spec**
- **Found during:** Task 1 (Tailwind upgrade)
- **Issue:** `npm install tailwindcss@4.2.2` installed `^4.2.2` (with caret) into package.json; plan requires exact `4.2.2`
- **Fix:** Edited package.json to remove caret prefix from both `tailwindcss` and `@tailwindcss/postcss`
- **Files modified:** package.json
- **Verification:** `node -e` check confirmed both values equal `"4.2.2"` exactly
- **Committed in:** `1b30b35` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Minor — npm added caret prefix which the plan explicitly disallows. Fixed inline. No scope creep.

## Issues Encountered

- `npm install tailwindcss@4.2.2 @tailwindcss/postcss@4.2.2` initially failed with `ERESOLVE` due to `next-themes@0.3.0` not listing React 19 in its peer deps metadata. Resolved with `--legacy-peer-deps` — this is a metadata issue only, the code is compatible.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- CSS foundation is now stable: correct Tailwind v4.2.2, correct token structure, production build verified
- Phase 07 (design mockups via Pencil MCP) can proceed without CSS infrastructure risk
- Phase 08 (CSS implementation) has a clean, trusted token system to build on
- Color values themselves (the HSL numbers) are unchanged — Phase 8 owns color value work per plan

## Self-Check: PASSED

- package.json: FOUND, tailwindcss=4.2.2, @tailwindcss/postcss=4.2.2 (exact pins)
- src/app/globals.css: FOUND, @theme inline present, :root outside @layer base, 38 hsl() wrappers, no bare HSL values
- 06-01-SUMMARY.md: FOUND
- Task commits: 1b30b35 (chore), 215d51e (feat) — both verified in git log
- npm run build: passed cleanly

---
*Phase: 06-foundation-stabilization*
*Completed: 2026-03-26*
