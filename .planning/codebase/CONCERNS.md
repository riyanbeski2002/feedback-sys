# Codebase Concerns

**Analysis Date:** 2026-03-28

## Tech Debt

**Type Safety with `any` Type:**
- Issue: Multiple server actions and components use `any` type instead of proper TypeScript interfaces, bypassing type safety.
- Files:
  - `src/features/feedback/actions/submit-feedback.ts` (line 8: `data: any`)
  - `src/features/admin/actions/update-config.ts` (line 6: `formData: any`)
  - `src/features/bookings/components/booking-table.tsx` (accepts `initialData: any[]`)
  - `src/app/(dashboard)/admin/page.tsx` (line casting `recentFeedbacks as any`)
- Impact: Runtime errors cannot be caught at compile time; refactoring becomes risky; IDE autocomplete fails for these parameters.
- Fix approach: Define explicit TypeScript interfaces for all action parameters and component props. Replace `any` with concrete types matching the expected data structure.

**Hardcoded TypeScript Configuration:**
- Issue: `tsconfig.json` has `"strict": false`, disabling TypeScript's strict mode which prevents null/undefined errors and strict type checking.
- Files: `src/tsconfig.json` (line 11)
- Impact: Null pointer exceptions and type errors slip through to runtime. No protection against undefined properties.
- Fix approach: Enable `"strict": true` and address any resulting type errors. This will catch entire classes of bugs at compile time.

**Sentiment Analysis Too Simplistic:**
- Issue: Comment analysis in `analyzeFeedback()` relies on basic keyword matching instead of any real NLP or AI model.
- Files: `src/features/feedback/lib/analysis.ts` (lines 19-37)
- Impact: Sentiment detection is inaccurate. Keywords like "dirty" in "not very dirty" would be misclassified. False positives/negatives in urgency flagging.
- Fix approach: Consider integration with a real sentiment analysis API or ML model (e.g., AWS Comprehend, Hugging Face, OpenAI). Document current limitations clearly for users.

**Hardcoded Constants in Feedback Analysis:**
- Issue: Scoring thresholds and Bayesian average constants are hardcoded in functions.
- Files:
  - `src/features/feedback/lib/scoring.ts` (lines 42-43: `m = 5`, `C = 3.0`)
  - `src/features/feedback/lib/analysis.ts` (lines 16-17: hardcoded score >= 4.0 and < 3.0)
- Impact: Changing these thresholds requires code changes and redeployment; no A/B testing capability; inconsistency between feedback scoring and urgency thresholds.
- Fix approach: Move all threshold values to the `feedback_config` table and fetch them dynamically. Update scoring functions to accept config as parameters.

## Known Bugs

**Race Condition in `submitFeedback`:**
- Symptoms: If two feedback submissions for the same hotel arrive concurrently, the `avg_score` calculation becomes incorrect due to lost updates.
- Files: `src/features/feedback/actions/submit-feedback.ts` (lines 50-84)
- Trigger:
  1. Submit feedback for Hotel A simultaneously from two users
  2. Both read the same `oldAvg` and `oldTotal`
  3. Both calculate independently and update, but only last write wins
  4. First submission's score is lost from average
- Workaround: None in current code; problem is silent and corrupts data.
- Fix approach: Use Supabase atomic increment for `total_feedbacks` and database-side calculation for `avg_score`. Alternatively, move calculation to a trigger function in Supabase (PostgreSQL PL/pgSQL).

**Hardcoded Feedback Link in Notifications:**
- Symptoms: All notification previews show the same fake link: `https://ziptrrip.com/f/bk-9283-xk`
- Files: `src/features/notifications/components/notifications-client.tsx` (line 46)
- Impact: Expiry time is also hardcoded (line 47: "25 Mar 2026, 11:59 PM"). Real notifications would display expired/incorrect links.
- Trigger: Any user viewing notification center sees static sample data instead of live data.
- Fix approach: Make notification center a server component that generates real expiring links and timestamps dynamically. Calculate actual expiry based on `trigger_delay_hours` config.

**Console Log in Production Code:**
- Symptoms: `console.log("Hotel Update received:", payload)` appears in `src/app/(dashboard)/hotels/page.tsx` during real-time subscription updates.
- Files: `src/app/(dashboard)/hotels/page.tsx` (hotel update subscription handler)
- Impact: May leak user data in browser console; indicates incomplete implementation; unprofessional debugging artifacts in shipped code.
- Trigger: Visit hotels page; any real-time update fires the log.
- Fix approach: Remove all console.log statements from component code. Use proper logging service or observability tool for debugging.

## Security Considerations

**Missing Input Validation on Server Actions:**
- Risk: `submitFeedback` and `updateConfig` accept `any` type with minimal validation. Malicious clients could send unexpected field names or types.
- Files:
  - `src/features/feedback/actions/submit-feedback.ts` (accepts user input without type validation)
  - `src/features/admin/actions/update-config.ts` (relies only on sum check for weights)
- Current mitigation: Zod schema in client-side form validation; server re-validates weights but not all fields.
- Recommendations:
  1. Define strict Zod schemas in server actions matching exactly what fields are expected
  2. Use `parse()` not `safeParse()` to fail fast on invalid input
  3. Add server-side bounds checking (e.g., rating must be 1-5, not 100)
  4. Log failed validation attempts for security monitoring

**Unprotected Admin Routes:**
- Risk: `/settings` and `/admin` pages have no authentication or authorization checks visible in code.
- Files:
  - `src/app/(dashboard)/settings/page.tsx`
  - `src/app/(dashboard)/admin/page.tsx`
- Current mitigation: None detected in codebase (may exist in middleware, but not visible in route handlers).
- Recommendations: Implement middleware-level role checking. Verify user is authenticated and has admin role before serving these pages. Add explicit auth guards.

**Supabase Credentials in Environment:**
- Risk: `process.env.NEXT_PUBLIC_SUPABASE_URL!` and anon key are public (by design), but connection logic has no retry/timeout limits.
- Files: `src/lib/supabase/server.ts` (lines 8-9)
- Current mitigation: Non-encrypted cookies only; anon key has Supabase RLS policies.
- Recommendations: Ensure RLS policies are strict and tested. Never use service role key in client code. Monitor for abusive queries via Supabase dashboard.

## Performance Bottlenecks

**Unbounded Hotel Score Recalculation:**
- Problem: When config weights change, `updateConfig()` fetches ALL feedback rows and recalculates scores for ALL hotels synchronously.
- Files: `src/features/admin/actions/update-config.ts` (lines 51-102)
- Cause: No pagination, no background job, no early exit for small datasets. If 100k feedback rows exist, this locks the database and user for 30+ seconds.
- Current capacity: Tested with ~100 bookings and ~20 feedback rows (seed data).
- Limit: Likely breaks above 10k feedback rows or 1k hotels.
- Improvement path:
  1. Move recalculation to a background job (e.g., Supabase edge function or scheduled task)
  2. Implement batch processing with smaller chunks (100 records at a time)
  3. Show progress UI: "Recalculating hotel scores..." with a background job ID
  4. Store timestamp of last config change to avoid redundant recalculations

**N+1 Query in Hotels Page:**
- Problem: `src/app/(dashboard)/hotels/page.tsx` likely fetches hotels list, then for each hotel subscribes individually to updates. No batch subscription.
- Impact: With 100 hotels, opens 100 individual WebSocket subscriptions (or rapid consecutive queries).
- Fix approach: Use a single subscription to the hotels table's channel and update all at once.

**Analysis Function Called Synchronously on Every Submission:**
- Problem: `analyzeFeedback()` performs string processing and category matching on every feedback submission in the request handler, blocking the response.
- Files: `src/features/feedback/actions/submit-feedback.ts` (line 21)
- Impact: Slows down feedback submission API. If sentiment analysis becomes ML-based, this becomes critical bottleneck.
- Fix approach: Offload sentiment/category analysis to a queued background job. Return immediately and update feedback record asynchronously.

## Fragile Areas

**Feedback Form with Unvalidated Enums:**
- Files: `src/features/feedback/components/feedback-form.tsx`
- Why fragile: If database schema changes the meaning of `issue_category` or `sentiment_label` values, form still sends old categories and data integrity breaks.
- Safe modification: Always define category enums in shared constants file. Use TypeScript `as const` patterns. Never hardcode string category values in business logic.
- Test coverage: No unit tests for feedback form submission. No integration tests for validation failures.

**Config Form State Synchronization:**
- Files: `src/features/admin/components/config-form.tsx`
- Why fragile: `useState(initialConfig)` means form state can drift from server state if page is open during background updates. No invalidation/refetch on external change.
- Safe modification: Use form library's built-in reset on data fetch. Implement optimistic updates with rollback. Consider server-driven form state.
- Test coverage: No tests for concurrent config updates; weight validation only happens client-side before submission.

**Hardcoded Status Bucket Logic in Multiple Places:**
- Files:
  - `src/features/feedback/actions/submit-feedback.ts` (lines 66-70)
  - `src/features/admin/actions/update-config.ts` (lines 88-91)
- Why fragile: Same logic duplicated; if threshold changes in one place, must update both. Threshold values differ from config defaults.
- Safe modification: Extract logic to `calculateStatusBucket(score, config)` utility function. Call from both places. Add unit tests.

**No Error Recovery in Database Operations:**
- Files: All server actions in `src/features/*/actions/`
- Why fragile: If hotel update fails after feedback insert, partial data persists. No transaction boundaries.
- Safe modification: Wrap all multi-step operations in a Supabase transaction or implement explicit rollback on error. Return descriptive error codes, not generic messages.

## Scaling Limits

**Single Feedback Config Row:**
- Current capacity: System designed for exactly 1 row in `feedback_config` table (singleton pattern).
- Limit: Cannot support per-hotel or per-region config variations. All hotels use identical weights and thresholds.
- Scaling path: Add `scope` column to config (e.g., "global", "region_asia", "hotel_id_123"). Migrate singleton pattern to query scoped config at request time.

**Monolithic Scoring Weights:**
- Current capacity: 5 scoring dimensions hardcoded.
- Limit: Adding new dimensions (e.g., location quality, noise level) requires database schema migration and code changes.
- Scaling path: Move to semi-structured config: `scoring_dimensions: { cleanliness: 0.3, service: 0.3, ... }` stored as JSONB in Supabase. Dynamically calculate score based on keys.

**No Pagination in Data Fetches:**
- Current capacity: Hotels page, admin feed, notifications list all fetch ALL rows.
- Limit: Breaking point around 1000 rows per table.
- Scaling path: Implement cursor-based pagination in React components. Add `limit` and `offset` to all Supabase queries.

## Dependencies at Risk

**Tailwind CSS v4 (New Major Version):**
- Risk: Project recently migrated to Tailwind v4 with new CSS bundling and JIT compilation. Custom properties handling changed.
- Impact: PostCSS config (`postcss.config.mjs`) uses new pipeline. If Tailwind releases breaking changes or drops Node.js version support, build fails.
- Migration plan: Keep `tailwindcss@4.2.2` pinned. Monitor major release notes. Test builds after any update. Maintain fallback to v3 installation if critical bugs appear.

**Next.js v15 with Server Components:**
- Risk: Codebase heavily relies on `"use server"` and `"use client"` directives. Breaking changes in Next.js 15 could affect server action signatures.
- Impact: Any Next.js v16+ update may require refactoring all server actions.
- Migration plan: Run full test suite before upgrading. Pin Next.js version to v15 until v16 is released and stable. Review release notes for Action API changes.

**Supabase SSR Package:**
- Risk: `@supabase/ssr` is a relatively new package. Version pinned to `^0.5.1` allows minor updates that could introduce bugs.
- Impact: Breaking changes in auth flow could lock users out.
- Migration plan: Test auth flows on every dependency update. Monitor Supabase release notes. Consider pinning exact version (`0.5.1`) instead of range.

## Missing Critical Features

**No Audit Logging:**
- Problem: Admin changes (config updates, manual score adjustments) are not logged. Cannot trace who changed what and when.
- Blocks: Compliance audits; debugging data discrepancies; accountability.
- Priority: Medium (needed before production for B2B SaaS).

**No Feedback Deduplication Logic:**
- Problem: System checks if feedback already submitted (duplicate error page), but does not prevent submitting identical feedback from different sessions on the same booking.
- Blocks: Data integrity; statistical analysis becomes unreliable.
- Priority: High (affects core feedback intelligence).

**No Scheduled Tasks or Reminders:**
- Problem: Requirements mention reminder frequency and trigger delays, but no background job system exists to send reminders.
- Blocks: Automated outreach feature (core value of system).
- Priority: High (required for Phase 10 when real notifications are implemented).

**No Real-time Notifications to Staff:**
- Problem: Flagged hotels can sit unaddressed indefinitely. No alert system notifies managers of low-score feedback.
- Blocks: Operational action; hotels stay low-rated without intervention.
- Priority: Medium (business requirement not yet implemented).

## Test Coverage Gaps

**No Unit Tests for Scoring Logic:**
- What's not tested: `calculateWeightedScore()`, `calculateWeightedRanking()`, `analyzeFeedback()`, status bucket determination.
- Files:
  - `src/features/feedback/lib/scoring.ts`
  - `src/features/feedback/lib/analysis.ts`
- Risk: Incorrect score calculation silently corrupts hotel rankings. Edge cases (missing ratings, zero feedbacks) not validated. Changes to scoring break silently.
- Priority: High (core business logic).

**No Integration Tests for Feedback Submission:**
- What's not tested: Full feedback submission flow (form → validation → database insert → hotel update → notification).
- Files: `src/features/feedback/actions/submit-feedback.ts`
- Risk: Race conditions, partial failures, and state corruption undetected. Concurrent submissions not tested.
- Priority: High (critical user journey).

**No E2E Tests:**
- What's not tested: Any full user flow (login → view hotels → submit feedback → see success → verify hotel score updated).
- Risk: Entire application can be broken and tests won't catch it. UI regressions go undetected.
- Priority: High (required for confident deployments).

**No Tests for Config Updates:**
- What's not tested: Saving new weights → all hotel scores recalculated → status buckets updated correctly.
- Files: `src/features/admin/actions/update-config.ts`, `src/features/admin/components/config-form.tsx`
- Risk: Config changes corrupt data silently. Weight validation only happens client-side; server-side update can fail.
- Priority: Medium (affects admin functionality).

**No Error Boundary Tests:**
- What's not tested: App behavior when database queries fail, Supabase is down, or middleware throws.
- Risk: Error states render blank screens or cryptic messages. Users have no recovery path.
- Priority: Medium (user experience).

---

*Concerns audit: 2026-03-28*
