# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** Create a reliable, automated feedback intelligence loop that improves hotel recommendation quality based on verified guest experiences.
**Current focus:** Milestone v2.0 — Phase 6: Foundation Stabilization

## Current Position

Phase: 6 of 9 (Foundation Stabilization)
Plan: 3 of 3 in current phase (COMPLETE)
Status: Phase 6 Complete
Last activity: 2026-03-26 — 06-03 complete: idempotent seed script with 14 demo feedback rows

Progress: [█████░░░░░] ~50% (v1.0 complete, v2.0 starting)

## Performance Metrics

**Velocity:**
- Total plans completed: 9 (v1.0 phases 1-5)
- Average duration: ~45 min
- Total execution time: ~6.75 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3 | ~2h | ~40 min |
| 2. Feedback Loop | 3 | ~2h | ~40 min |
| 3-5. Remaining v1.0 | 3+ | ~2.75h | ~55 min |

*Updated after each plan completion*
| Phase 06-foundation-stabilization P01 | 1 | 2 tasks | 3 files |
| Phase 06-foundation-stabilization P02 | 1 | 3 tasks | 3 files |
| Phase 06-foundation-stabilization P03 | 1 | 2 tasks | 4 files |

## Accumulated Context

### Decisions

- v2.0 phase order is dependency-critical: DB fixes (Phase 6) → mockup approval gate (Phase 7) → CSS implementation (Phase 8) → dynamic features (Phase 9)
- Pencil MCP mockup approval is a hard gate before any UI code changes (DSG-01 requirement)
- Teal #72D3C4 fails WCAG AA for body text — use only for accents (icons, focus rings, borders), keep dark foreground text
- Phase 6 groups all infrastructure/DB fixes together so Phases 7-9 build on a stable, trusted foundation
- [Phase 06-foundation-stabilization]: Pin tailwindcss and @tailwindcss/postcss to exact 4.2.2 (no caret) — version mismatch between these packages causes PostCSS integration failures
- [Phase 06-foundation-stabilization]: @theme inline required (not @theme) so var() CSS variable references are preserved without OKLCH conversion attempt in Tailwind v4
- [Phase 06-foundation-stabilization]: Use .maybeSingle() for optional singleton rows in Supabase — .single() throws PGRST116 on 0 rows
- [Phase 06-foundation-stabilization]: feedback_config singleton pattern — boolean sentinel column + UNIQUE INDEX + upsert onConflict enables idempotent settings saves
- [Phase 06-foundation-stabilization]: Seed idempotency via hotel count guard (count > 0 exits early) + stable UUID constants + upsert with explicit onConflict on every table
- [Phase 06-foundation-stabilization]: feedback upsert uses onConflict: booking_id (unique constraint in schema); feedback_config upsert uses onConflict: singleton
- [Phase 06-foundation-stabilization]: dotenv must be installed with --legacy-peer-deps due to React 19 / next-themes@0.3.0 peer conflict in this project

### Pending Todos

None.

### Blockers/Concerns

- [Phase 6] feedback_config singleton migration RESOLVED in 06-02 — migration SQL created, constraint enforced at DB level
- [Phase 7] Pencil MCP code generation is known to miss shadcn component substitutions and responsive breakpoints — treat generated code as reference only, manual review gate required before commit

## Session Continuity

Last session: 2026-03-26
Stopped at: Completed 06-03-PLAN.md — idempotent seed script with 14 demo feedback rows and dotenv devDep
Resume file: None
