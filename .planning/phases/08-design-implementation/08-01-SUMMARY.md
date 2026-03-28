---
phase: 08-design-implementation
plan: "01"
status: complete
subsystem: hotels, design-tokens
tags: [design-tokens, framer-motion, audit, teal, flash-animation]
dependency_graph:
  requires: [07-05]
  provides: [DSG-03-verified, DSG-04-verified, DSG-05-verified, flash-teal-token]
  affects: [hotel-card, badge, metric-cards]
tech_stack:
  added: []
  patterns: [hsl-color-tokens-in-framer-motion]
key_files:
  created: []
  modified:
    - src/features/hotels/components/hotel-card.tsx
decisions:
  - "Framer Motion inline styles require literal hsl() color strings — CSS custom properties (var(--token)) are not interpolated by Framer Motion's animate engine at runtime"
  - "DSG-03/04/05 confirmed fully complete from Phase 6 implementation — no regressions found"
metrics:
  duration: 38s
  completed: 2026-03-28
  tasks_completed: 2
  files_modified: 1
---

# Phase 08 Plan 01: Design Token Audit + Flash Animation Fix Summary

Verified DSG-03, DSG-04, DSG-05 token compliance across all UI components; fixed one confirmed residual — Framer Motion flash animation in hotel-card.tsx used hardcoded blue `rgba(59, 130, 246, 0.5)` instead of teal design token.

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Audit DSG-03/04/05 completion | Complete | — |
| 2 | Fix hotel-card flash animation teal token | Complete | see below |

## Audit Findings

### DSG-03: Status Badge Colors

**Files checked:**
- `src/features/hotels/components/hotel-card.tsx` — `getStatusColor()` returns `bg-[var(--status-top-rated-bg)]`, `bg-[var(--status-stable-bg)]`, `bg-[var(--status-needs-review-bg)]`, `bg-[var(--status-flagged-bg)]` — all four use CSS custom property tokens.
- `src/components/ui/badge.tsx` — `rounded-full` confirmed present for pill shape.

**Audit grep (Tailwind color classes outside preview components):** Zero results. No `bg-green-*`, `bg-red-*`, `bg-yellow-*`, `bg-blue-*`, `text-green-*`, or `text-red-*` classes found anywhere outside the preview components.

**Result: DSG-03 COMPLETE.**

### DSG-04: Admin Metric Cards

**Files checked:**
- `src/features/admin/components/metric-cards.tsx` — grep for `rgba`, raw hex `#`, `yellow`, or `blue` returned zero results. All colors use design token references.

**Result: DSG-04 COMPLETE.**

### DSG-05: General Token Compliance

No hardcoded Tailwind semantic colors (green/red/yellow/blue/orange/slate) found anywhere in the application source outside the intentional preview simulation components (slack-preview, whatsapp-preview, teams-preview, email-preview).

**Result: DSG-05 COMPLETE.**

### Confirmed Residual: hotel-card.tsx Flash Animation

Grep for `rgba(59` in hotel-card.tsx returned:

```
61: boxShadow: isFlashing ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
62: borderColor: isFlashing ? "rgba(59, 130, 246, 0.5)" : "inherit"
```

These are Framer Motion `animate` prop values — they live in inline JS object literals, not Tailwind classes, which is why DSG-03/05 grep passes did not catch them. Fix applied in Task 2.

## Fix Applied

**File:** `src/features/hotels/components/hotel-card.tsx` lines 61-62

**Before:**
```tsx
boxShadow: isFlashing ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
borderColor: isFlashing ? "rgba(59, 130, 246, 0.5)" : "inherit"
```

**After:**
```tsx
boxShadow: isFlashing ? "0 0 20px hsl(171 53% 64% / 0.5)" : "none",
borderColor: isFlashing ? "hsl(171 53% 64% / 0.5)" : "inherit"
```

`hsl(171 53% 64%)` is the literal value of `--color-primary` (#72D3C4 teal). The `/0.5` alpha channel makes the flash glow at 50% opacity, matching the teal brand color established in Phase 7 mockups.

Note: Framer Motion's `animate` prop interpolates CSS values as strings at runtime and does not resolve `var()` CSS custom properties — therefore the literal HSL value is the correct approach here, not `var(--color-primary)`.

## Verification

```
grep -n "rgba(59" hotel-card.tsx  → 0 results (PASS)
npm run build                     → exit 0, 10/10 pages generated (PASS)
```

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `src/features/hotels/components/hotel-card.tsx` — exists and contains `hsl(171 53% 64% / 0.5)`
- Build: exit 0 confirmed
