# Requirements: Post-Stay Feedback Intelligence System

**Defined:** 2026-03-26
**Core Value:** Create a reliable, automated feedback intelligence loop that improves hotel recommendation quality based on verified guest experiences.

## v1 Requirements (Validated — shipped in v1.0)

### Trigger & Notifications (TRG)
- [x] **TRG-01**: User can simulate a completed checkout for a booking.
- [x] **TRG-02**: System identifies feedback eligibility once checkout is complete.
- [x] **TRG-03**: User can preview multi-channel notifications (Email, WhatsApp, Slack, Teams).
- [x] **TRG-04**: System respects trigger delay and reminder frequency (mocked or real).

### Feedback Collection (COL)
- [x] **COL-01**: User can submit a detailed feedback form (Value, Service, Cleanliness, Amenities, Intent).
- [x] **COL-02**: User can add an optional text comment to the feedback.
- [x] **COL-03**: User can submit a quick 1-10 score via a WhatsApp-style mockup.
- [x] **COL-04**: System validates feedback eligibility to prevent duplicate submissions.

### Scoring & Intelligence (SCI)
- [x] **SCI-01**: System calculates weighted feedback score (Cleanliness 30%, Service 30%, Value 20%, etc.).
- [x] **SCI-02**: System performs basic sentiment/category analysis on comments (abstracted AI layer).
- [x] **SCI-03**: System updates hotel average score and feedback count in real-time.
- [x] **SCI-04**: System flags hotels below critical threshold (e.g., < 2.0).

### Dashboard & Listings (DSB)
- [x] **DSB-01**: User can view a hotel listing page that reflects real-time scores and ranking.
- [x] **DSB-02**: Admin can monitor overall feedback health and flagged hotels via a dashboard.
- [x] **DSB-03**: Admin can configure trigger delays, weights, and thresholds in a config panel.

## v2 Requirements (Milestone v2.0 — Active)

### Foundation (FND)
- [x] **FND-01**: App runs on Tailwind CSS stable v4 in both dev and production builds
- [x] **FND-02**: All CSS custom properties use `hsl()` wrappers and `@theme inline` so teal tokens apply correctly across light and dark mode
- [x] **FND-03**: Seed script can be run multiple times without creating duplicate hotels, bookings, or config rows
- [x] **FND-04**: `dotenv` is listed in devDependencies so seed script loads env vars reliably

### Design (DSG)
- [x] **DSG-01**: All app screens have Pencil MCP-approved mockups before any UI code is written
- [x] **DSG-02**: Pencil MCP mockups include pixel-accurate notification format designs for Email, Slack, Teams, and WhatsApp showing how feedback alerts appear in each channel
- [ ] **DSG-03**: Hotel status badges use teal-based color palette (not hardcoded green/slate/orange/red)
- [ ] **DSG-04**: Admin metric cards use design system colors (no hardcoded yellow or blue)
- [ ] **DSG-05**: All badge/chip elements use `rounded-full` pill style matching Ziptrrip
- [ ] **DSG-06**: Sidebar and header match Ziptrrip B2B density, spacing, and navigation layout

### Data & Bugs (DAT)
- [x] **DAT-01**: Settings page loads without error regardless of how many rows exist in `feedback_config`
- [x] **DAT-02**: Saving settings uses upsert so no duplicate config rows are ever created
- [x] **DAT-03**: `feedback_config` has a DB-level uniqueness constraint preventing multiple rows
- [x] **DAT-04**: Database contains 12–15 pre-submitted feedback rows with real names, scores, and comments

### Features (FTR)
- [x] **FTR-01**: Notification previews for all 4 channels show data from the most recent real feedback submission (not static sample data)
- [x] **FTR-02**: When admin saves new scoring weights, hotel aggregate scores are recalculated across all existing feedback

## v3 Requirements (Deferred)
- **AUTH-01**: Full production-grade user authentication.
- **NOT-01**: Real-world integration with messaging APIs (Twilio, SendGrid, Slack API, Teams webhooks).
- **ANL-01**: Advanced time-series analytics and trend reports.
- **FRD-01**: ML-based feedback fraud detection models.
- **RACE-01**: `submitFeedback` race condition fix on `avg_score` for concurrent writes.

## Out of Scope
- Integration with external legacy booking systems (manual simulation only).
- Multi-currency support for value-for-money calculations.
- Live customer support chat integration.

## Traceability

### v1 Requirements
| REQ-ID | Phase | Status |
|--------|-------|--------|
| TRG-01 | Phase 2 | Complete |
| TRG-02 | Phase 2 | Complete |
| TRG-03 | Phase 5 | Complete |
| TRG-04 | Phase 4 | Complete |
| COL-01 | Phase 2 | Complete |
| COL-02 | Phase 2 | Complete |
| COL-03 | Phase 5 | Complete |
| COL-04 | Phase 2 | Complete |
| SCI-01 | Phase 3 | Complete |
| SCI-02 | Phase 5 | Complete |
| SCI-03 | Phase 3 | Complete |
| SCI-04 | Phase 4 | Complete |
| DSB-01 | Phase 3 | Complete |
| DSB-02 | Phase 4 | Complete |
| DSB-03 | Phase 4 | Complete |

### v2 Requirements
| REQ-ID | Phase | Status |
|--------|-------|--------|
| FND-01 | Phase 6 | Complete |
| FND-02 | Phase 6 | Complete |
| FND-03 | Phase 6 | Complete |
| FND-04 | Phase 6 | Complete |
| DSG-01 | Phase 7 | Complete |
| DSG-02 | Phase 7 | Complete |
| DSG-03 | Phase 8 | Pending |
| DSG-04 | Phase 8 | Pending |
| DSG-05 | Phase 8 | Pending |
| DSG-06 | Phase 8 | Pending |
| DAT-01 | Phase 6 | Complete |
| DAT-02 | Phase 6 | Complete |
| DAT-03 | Phase 6 | Complete |
| DAT-04 | Phase 6 | Complete |
| FTR-01 | Phase 9 | Complete |
| FTR-02 | Phase 9 | Complete |

**Coverage:**
- v2 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after v2.0 milestone definition*
