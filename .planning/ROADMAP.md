# Roadmap: Post-Stay Feedback Intelligence System

## Milestones

- ✅ **v1.0 MVP** - Phases 1-5 (shipped 2026-03-26)
- 🚧 **v2.0 Ziptrrip Design Fidelity & Full Functionality** - Phases 6-9 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-5) - SHIPPED 2026-03-26</summary>

### Phase 1: Foundation
**Goal**: Set up the project scaffold, database (Supabase), and seed data.
**Requirements**: SCI-03
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Initialize Next.js and build dashboard layout. (2026-03-25)
- [x] 01-02-PLAN.md — Setup Supabase SSR and seed initial data. (2026-03-25)
- [x] 01-03-PLAN.md — Verify infrastructure and UI. (2026-03-25)

Success criteria:
1. Next.js app running with shadcn/ui.
2. Supabase tables (hotels, bookings) seeded with demo data.

### Phase 2: Feedback Loop
**Goal**: Build the end-to-end feedback submission path from booking simulation.
**Requirements**: TRG-01, TRG-02, COL-01, COL-02, COL-04, SCI-01
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Booking simulation and checkout action. (2026-03-25)
- [x] 02-02-PLAN.md — Detailed feedback form and scoring logic. (2026-03-25)
- [x] 02-03-PLAN.md — Success page and duplicate prevention. (2026-03-25)

Success criteria:
3. User can click "Simulate Checkout" for a booking.
4. Booking becomes "eligible" for feedback.
5. User can fill and submit the detailed feedback form.

### Phase 3: Scoring & Ranking
**Goal**: Calculate weighted scores and immediately reflect them on the hotel listing.
**Requirements**: SCI-01, SCI-03, DSB-01
**Plans**: TBD

Success criteria:
6. Hotel aggregate score updates immediately after submission.
7. Hotel listing page updates ranking (sorting) based on the new score.

### Phase 4: Admin & Config
**Goal**: Provide tools for management and system configuration.
**Requirements**: SCI-04, DSB-02, DSB-03, TRG-04
**Plans**: TBD

Success criteria:
8. Admin dashboard shows flagged hotels (< 2.0).
9. Config panel updates scoring weights and thresholds in DB.

### Phase 5: Multi-channel & AI
**Goal**: Add notification previews and qualitative analysis.
**Requirements**: TRG-03, COL-03, SCI-02
**Plans**: TBD

Success criteria:
10. Notification preview center shows mocks for Email/WhatsApp/Slack/Teams.
11. Comments are tagged with sentiment/category after submission.

</details>

---

### 🚧 v2.0 Ziptrrip Design Fidelity & Full Functionality (In Progress)

**Milestone Goal:** Redesign the app to pixel-match Ziptrrip's visual identity, fix all known bugs, and make every feature fully functional end-to-end.

## Phase Details

### Phase 6: Foundation Stabilization
**Goal**: Eliminate the three compounding bugs (Tailwind alpha, CSS variable layer misplacement, non-idempotent seed) and fix the database-layer issues that make the app unreliable on fresh environments.
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: FND-01, FND-02, FND-03, FND-04, DAT-01, DAT-02, DAT-03, DAT-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` and `npm run dev` produce identical styles — no prod/dev divergence visible on any page.
  2. Running `npm run seed` twice consecutively creates exactly 6 hotels and 1 feedback_config row, not duplicates.
  3. The Settings page loads without error on a fresh database and on a database that has been seeded multiple times.
  4. Saving settings from the Settings page completes without a PGRST116 error regardless of how many prior saves have occurred.
**Plans**: 3 plans

Plans:
- [ ] 06-01-PLAN.md — Upgrade Tailwind to stable v4.2.2 and migrate globals.css to correct v4 token structure
- [ ] 06-02-PLAN.md — Add DB singleton constraint to feedback_config and fix Settings page read/save
- [ ] 06-03-PLAN.md — Rewrite seed script as idempotent with 14 demo feedback rows (Indian corporate context)

### Phase 7: Design Mockups
**Goal**: Produce Pencil MCP-approved mockups for every screen and all four notification channel formats before any UI code is written or changed.
**Depends on**: Phase 6
**Requirements**: DSG-01, DSG-02
**Success Criteria** (what must be TRUE):
  1. Every app screen (Hotels, Bookings, Feedback Form, Success, Admin, Settings, Notifications) has an approved Pencil MCP mockup showing the Ziptrrip teal palette, Inter typography, and rounded-full pill elements.
  2. Notification mockups show pixel-accurate designs for Email, Slack, Teams, and WhatsApp formats — including traveller name, hotel name, score, and feedback excerpt populated from a realistic example submission.
  3. No UI implementation code is committed until mockup approval is confirmed.
**Plans**: 5 plans

Plans:
- [x] 07-01-PLAN.md — Create .pen file, register Ziptrrip design tokens, design App Shell frame
- [x] 07-02-PLAN.md — Design Hotels (happy + empty) and Bookings (happy + empty) screens
- [x] 07-03-PLAN.md — Design Admin dashboard and Settings screens (3 states)
- [ ] 07-04-PLAN.md — Design Notifications 2x2 channel grid (Email/Slack/Teams/WhatsApp)
- [ ] 07-05-PLAN.md — Design Feedback Form (desktop + validation + mobile 375px) and Success screen; human approval gate

### ✅ Phase 8: Design Implementation — COMPLETE (2026-03-28)
**Goal**: Apply the approved Ziptrrip visual identity across all components — teal color tokens, semantic badge colors, pill elements, and B2B sidebar/header density — replacing all hardcoded colors.
**Depends on**: Phase 7
**Requirements**: DSG-03, DSG-04, DSG-05, DSG-06
**Success Criteria** (what must be TRUE):
  1. Hotel status badges (top_rated, stable, needs_review, flagged) display using teal-derived semantic CSS variables — no hardcoded green, slate, orange, or red anywhere in badge components.
  2. Admin metric cards use design system color tokens — no hardcoded yellow or blue inline styles visible in the DOM.
  3. Every badge and chip element in the UI renders with `rounded-full` pill shape matching the Ziptrrip design reference.
  4. The sidebar and header match the Ziptrrip B2B density: navigation items are compact, spacing follows the 4px grid, and the layout matches the approved mockup from Phase 7.
**Plans**: 2 plans

Plans:
- [x] 08-01-PLAN.md — Audit and fix DSG-03/04/05 residuals (teal flash animation in hotel-card.tsx)
- [x] 08-02-PLAN.md — DSG-06 sidebar/header B2B density implementation (site-header.tsx + app-sidebar.tsx)

### Phase 9: Full Functionality
**Goal**: Complete the two remaining end-to-end capability gaps — dynamic notification previews that read from real feedback data, and live score recalculation when admin changes scoring weights.
**Depends on**: Phase 8
**Requirements**: FTR-01, FTR-02
**Success Criteria** (what must be TRUE):
  1. After a user submits a new feedback form, visiting the Notifications page shows that submission's hotel name, traveller name, score, and comment in all four channel preview formats — not static sample text.
  2. When an admin changes scoring weights in the Settings panel and saves, every hotel's aggregate score immediately recalculates across all existing feedback rows and the Hotels page reflects the updated rankings without a manual page refresh.
**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md — Dynamic notifications page: replace SAMPLE_DATA with Supabase fetch + submission selector driving all 4 channel previews
- [ ] 09-02-PLAN.md — Score recalculation: extend update-config.ts to bulk-recalculate hotel avg_scores after settings save

---

## Progress

**Execution Order:**
Phases execute in numeric order: 6 → 7 → 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-03-25 |
| 2. Feedback Loop | v1.0 | 3/3 | Complete | 2026-03-25 |
| 3. Scoring & Ranking | v1.0 | - | Complete | 2026-03-25 |
| 4. Admin & Config | v1.0 | - | Complete | 2026-03-25 |
| 5. Multi-channel & AI | v1.0 | - | Complete | 2026-03-26 |
| 6. Foundation Stabilization | v2.0 | 3/3 | Complete | 2026-03-26 |
| 7. Design Mockups | v2.0 | 4/5 | Complete | 2026-03-27 |
| 8. Design Implementation | v2.0 | 2/2 | Complete ✅ | 2026-03-28 |
| 9. Full Functionality | 2/2 | Complete    | 2026-03-28 | - |

---
*Last updated: 2026-03-28 after Phase 9 plans created*
