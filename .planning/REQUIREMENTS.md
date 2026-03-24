# Requirements

## v1 Requirements

### Trigger & Notifications (TRG)
- [ ] **TRG-01**: User can simulate a completed checkout for a booking.
- [ ] **TRG-02**: System identifies feedback eligibility once checkout is complete.
- [ ] **TRG-03**: User can preview multi-channel notifications (Email, WhatsApp, Slack, Teams).
- [ ] **TRG-04**: System respects trigger delay and reminder frequency (mocked or real).

### Feedback Collection (COL)
- [ ] **COL-01**: User can submit a detailed feedback form (Value, Service, Cleanliness, Amenities, Intent).
- [ ] **COL-02**: User can add an optional text comment to the feedback.
- [ ] **COL-03**: User can submit a quick 1-10 score via a WhatsApp-style mockup.
- [ ] **COL-04**: System validates feedback eligibility to prevent duplicate submissions.

### Scoring & Intelligence (SCI)
- [ ] **SCI-01**: System calculates weighted feedback score (Cleanliness 30%, Service 30%, Value 20%, etc.).
- [ ] **SCI-02**: System performs basic sentiment/category analysis on comments (abstracted AI layer).
- [ ] **SCI-03**: System updates hotel average score and feedback count in real-time.
- [ ] **SCI-04**: System flags hotels below critical threshold (e.g., < 2.0).

### Dashboard & Listings (DSB)
- [ ] **DSB-01**: User can view a hotel listing page that reflects real-time scores and ranking.
- [ ] **DSB-02**: Admin can monitor overall feedback health and flagged hotels via a dashboard.
- [ ] **DSB-03**: Admin can configure trigger delays, weights, and thresholds in a config panel.

## v2 Requirements (Deferred)
- **AUTH-01**: Full production-grade user authentication.
- **NOT-01**: Real-world integration with messaging APIs (Twilio, SendGrid, etc.).
- **ANL-01**: Advanced time-series analytics and trend reports.
- **FRD-01**: ML-based feedback fraud detection models.

## Out of Scope
- Integration with external legacy booking systems (manual simulation only).
- Multi-currency support for value-for-money calculations.
- Live customer support chat integration.

## Traceability
| REQ-ID | Phase | Status |
|--------|-------|--------|
| TRG-01 | | Pending |
| TRG-02 | | Pending |
| TRG-03 | | Pending |
| TRG-04 | | Pending |
| COL-01 | | Pending |
| COL-02 | | Pending |
| COL-03 | | Pending |
| COL-04 | | Pending |
| SCI-01 | | Pending |
| SCI-02 | | Pending |
| SCI-03 | | Pending |
| SCI-04 | | Pending |
| DSB-01 | | Pending |
| DSB-02 | | Pending |
| DSB-03 | | Pending |
