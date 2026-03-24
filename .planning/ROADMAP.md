# Roadmap

## Proposed Roadmap

**5 phases** | **15 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation | Core DB schema and project scaffold. | SCI-03 | 1, 2 |
| 2 | Feedback Loop | Simulation, triggering, and collection flow. | TRG-01, TRG-02, COL-01, COL-02, COL-04 | 3, 4, 5 |
| 3 | Scoring & Ranking | Score calculations and real-time UI ranking update. | SCI-01, SCI-03, DSB-01 | 6, 7 |
| 4 | Admin & Config | Configuration panel and management dashboard. | SCI-04, DSB-02, DSB-03, TRG-04 | 8, 9 |
| 5 | Multi-channel & AI | Notification previews and sentiment analysis. | TRG-03, COL-03, SCI-02 | 10, 11 |

### Phase Details

**Phase 1: Foundation**
Goal: Set up the project scaffold, database (Supabase), and seed data.
Requirements: SCI-03 (partial)
Success criteria:
1. Next.js app running with shadcn/ui.
2. Supabase tables (hotels, bookings) seeded with demo data.

**Phase 2: Feedback Loop**
Goal: Build the end-to-end feedback submission path from booking simulation.
Requirements: TRG-01, TRG-02, COL-01, COL-02, COL-04
Success criteria:
3. User can click "Simulate Checkout" for a booking.
4. Booking becomes "eligible" for feedback.
5. User can fill and submit the detailed feedback form.

**Phase 3: Scoring & Ranking**
Goal: Calculate weighted scores and immediately reflect them on the hotel listing.
Requirements: SCI-01, SCI-03, DSB-01
Success criteria:
6. Hotel aggregate score updates immediately after submission.
7. Hotel listing page updates ranking (sorting) based on the new score.

**Phase 4: Admin & Config**
Goal: Provide tools for management and system configuration.
Requirements: SCI-04, DSB-02, DSB-03, TRG-04
Success criteria:
8. Admin dashboard shows flagged hotels (< 2.0).
9. Config panel updates scoring weights and thresholds in DB.

**Phase 5: Multi-channel & AI**
Goal: Add notification previews and qualitative analysis.
Requirements: TRG-03, COL-03, SCI-02
Success criteria:
10. Notification preview center shows mocks for Email/WhatsApp/Slack/Teams.
11. Comments are tagged with sentiment/category after submission.

---
*Last updated: Tuesday, 24 March 2026 after roadmap creation*
