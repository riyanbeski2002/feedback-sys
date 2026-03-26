# Phase 6: Foundation Stabilization - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Eliminate three compounding infrastructure bugs (Tailwind alpha, CSS variable layer misplacement, non-idempotent seed) and fix the database-layer issues that make the app unreliable on fresh environments. Also populate realistic demo data. No UI design changes in this phase — that's Phase 8.

</domain>

<decisions>
## Implementation Decisions

### Seed Script Behavior on Re-run
- **Strategy:** Skip if data exists. Check hotel row count first — if hotels are already present, exit early.
- **Output on skip:** Print a summary message (`6 hotels already exist — skipping seed`) so the developer knows why nothing happened. No silent failure.
- **Command:** `npm run seed` — single command, no flags needed.
- **Feedback rows:** Do NOT wipe submitted feedback on re-seed. Feedback is user-generated and must survive a reseed. Only hotels, bookings, and feedback_config are managed by the seed.

### Demo Data Content
- **Hotel distribution:** 6 hotels total — 2 top-rated (score ≥ 4.5), 2 stable (score 3.0–4.4), 1 needs-review (score 2.0–2.9), 1 flagged (score < 2.0). Shows the full intelligence spectrum.
- **Context:** Indian corporate travel context matching Ziptrrip's market. Use realistic names: travellers like "Priya Sharma", "Arjun Mehta", "Kavitha Nair"; hotels in Mumbai, Delhi, Bangalore, Chennai.
- **Feedback comment scenarios (12–15 rows total):** Cover all four scenarios:
  - Positive: glowing comments triggering `Positive` sentiment + `Top Rated` status (e.g., "Spotless rooms, exceptional staff throughout")
  - Negative/critical: comments triggering `Negative` sentiment + `URGENT` flag (e.g., "Dirty bathroom, unresponsive front desk — will not return")
  - Neutral/mixed: ambiguous comments showing the `Neutral` category (e.g., "Room was okay, nothing exceptional")
  - Multi-category: comments hitting cleanliness, service, value, and amenities to demonstrate tagging breadth
- **Score distribution:** Feedback scores must be consistent with hotel `avg_score` — top-rated hotels get high-score feedback, flagged hotel gets low-score feedback.

### Duplicate Config Rows Cleanup
- **Migration strategy:** Delete all but the newest row — `DELETE FROM feedback_config WHERE id NOT IN (SELECT id FROM feedback_config ORDER BY created_at DESC LIMIT 1)`.
- **Migration location:** SQL migration file checked into the repo alongside existing schema files (e.g., `basic/10_singleton_constraint.sql`). Visible, repeatable, version-controlled.
- **Settings page resilience:** Use `.maybeSingle()` for all reads. If multiple rows somehow exist, use the first returned row — no error thrown. Graceful fallback on unmigrated DBs.
- **Upsert on save:** Settings save action uses upsert (not insert) keyed on the singleton constraint so repeated saves never create new rows.

### Tailwind Upgrade Breakage Policy
- **Component visual breakage:** Note regressions but do NOT fix them in Phase 6. Phase 8 (Design Implementation) will overhaul all component colors anyway — carrying forward minor visual regressions is acceptable.
- **Dark mode regressions from `@layer base` fix:** Accept dark mode visual changes until Phase 8. The goal of Phase 6 is a stable build, not a perfect visual output.
- **CSS fix scope:** Apply `@theme inline`, add `hsl()` wrappers, move `:root`/`.dark` outside `@layer base` — but stop there. No color value changes in this phase.
- **dotenv:** Add to `devDependencies` only. Seed script is a dev tool; it never runs in production.

### Claude's Discretion
- Exact SQL constraint syntax for the singleton (UNIQUE INDEX vs CHECK vs trigger)
- Whether to use stable UUIDs in seed for deterministic FK references
- Order of TRUNCATE/upsert operations to avoid FK violations
- Exact Tailwind version to pin (latest stable v4.x)

</decisions>

<specifics>
## Specific Ideas

- Indian corporate travel context: traveller names and hotel cities should feel authentic to Ziptrrip's market (Mumbai, Delhi, Bangalore, Chennai, Hyderabad)
- The flagged hotel's feedback comments should be genuinely alarming enough to make the URGENT flag feel earned
- The `npm run seed` skip message should be friendly and informative, not a terse status code

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-foundation-stabilization*
*Context gathered: 2026-03-26*
