# Tech Story Breakdown
## Small, Incremental, Time-Boxed Work Packages

Each work package is designed to be independently testable and sized to fit within a maximum of 5 working days.

## WP1: Booking Eligibility and Checkout Simulation
### Scope
Create booking records, statuses and a manual checkout simulation flow that changes a booking to completed and marks it feedback-eligible.

### Why it matters
This establishes the event source for the entire feedback system.

### Test
- Booking status changes correctly
- Feedback eligibility flag updates

## WP2: Notification Preview and Trigger State
### Scope
Build notification preview surfaces for email, WhatsApp, Slack and Teams. Add UI and backend state to mark feedback as triggered.

### Why it matters
This shows how users are invited into the feedback flow and makes the process concrete for business review.

### Test
- Trigger action works
- Notification preview data maps to booking and hotel correctly

## WP3: Detailed Feedback Form UI
### Scope
Build the form with all required fields, validation and success state.

### Why it matters
This is the primary input surface and the most visible user touchpoint.

### Test
- Required fields validate
- Submission works for eligible bookings only

## WP4: Score Calculation Utility
### Scope
Implement weighted score calculation using the approved weight model, including combined intent score logic.

### Why it matters
This is the core decision engine for ranking quality.

### Test
- Same input always returns same weighted score
- Threshold mapping is correct

## WP5: Feedback Persistence and Hotel Aggregate Update
### Scope
Store feedback, block duplicates and recalculate hotel average score and feedback count after each submission.

### Why it matters
This makes the system stateful and usable beyond a static demo.

### Test
- Duplicate feedback blocked
- Hotel summary fields update accurately

## WP6: Hotel Listing Ranking Integration
### Scope
Display hotels sorted by score with status buckets and counts.

### Why it matters
This demonstrates the visible business impact of submitted feedback.

### Test
- Hotel order changes after feedback submission where expected

## WP7: Admin Dashboard and Flagging View
### Scope
Create dashboard summary cards, hotel table and flagged hotels section.

### Why it matters
This is the operations and oversight layer.

### Test
- Flagged hotels display correctly based on thresholds
- Counts match underlying data

## WP8: Optional Comment Analysis Layer
### Scope
Implement comment analysis abstraction with mock sentiment and issue detection.

### Why it matters
This adds richness and shows how qualitative feedback can inform operational decisions.

### Test
- Comment analysis returns structured output
- Dashboard surfaces the result correctly

## WP9: Configuration Panel
### Scope
Build editable settings for trigger delay, reminders, channel enablement, score weights and thresholds.

### Why it matters
This highlights system flexibility and operational maturity.

### Test
- Values save and are reflected in UI logic or displayed config states
