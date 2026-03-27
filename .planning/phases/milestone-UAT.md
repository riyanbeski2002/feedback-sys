---
status: testing
phase: milestone-all
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 03-01-SUMMARY.md, 04-01-SUMMARY.md, 05-01-SUMMARY.md
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
---

## Current Test

number: 1
name: Dashboard Layout & Sidebar Navigation
expected: |
  Opening the app shows a dashboard shell with a collapsible sidebar on the left.
  The sidebar contains navigation links (e.g., Bookings, Hotels, Admin, Settings, Notifications).
  Clicking the sidebar toggle collapses/expands it. The header is visible at the top.
awaiting: user response

## Tests

### 1. Dashboard Layout & Sidebar Navigation
expected: Opening the app shows a dashboard shell with a collapsible sidebar on the left. Sidebar contains navigation links. Clicking the sidebar toggle collapses/expands it.
result: [pending]

### 2. Theme Toggle (Light/Dark Mode)
expected: A theme toggle button is visible in the header. Clicking it switches between light and dark mode. The preference persists if you reload the page.
result: [pending]

### 3. Bookings Page — List View
expected: Navigating to Bookings shows a table of traveller bookings with hotel names, stay dates, and status badges (e.g., "Pending", "Checked Out", "Submitted").
result: [pending]

### 4. Simulate Checkout
expected: A booking in "Pending" status has a "Simulate Checkout" button. Clicking it opens a confirmation dialog. Confirming updates the booking status to "Checked Out" / feedback eligible. A toast notification confirms the action.
result: [pending]

### 5. Feedback Form — Star Ratings
expected: Clicking "Leave Feedback" on an eligible booking opens a feedback form with 1–5 star rating inputs for multiple categories (e.g., Cleanliness, Staff, Comfort). All fields are required. Submitting saves the feedback.
result: [pending]

### 6. Success Page & Auto-Redirect
expected: After submitting feedback, a "Thank You" success page appears with a countdown timer. After the countdown, the user is automatically redirected back to the Bookings page.
result: [pending]

### 7. Duplicate Submission Prevention
expected: Trying to access the feedback form for a booking that already has feedback submitted shows a warning/error state rather than the empty form. The user cannot submit twice.
result: [pending]

### 8. Hotels Discovery Page — Grid & Status Badges
expected: The Hotels page shows a grid of hotel cards. Each card displays the hotel name, aggregate score, and a color-coded status badge (e.g., "Top Rated" in green, "Flagged" in red). Hotels are sorted by ranking score.
result: [pending]

### 9. Real-time Score Update After Feedback
expected: After submitting feedback for a hotel, the Hotels page reflects the updated score without a manual page refresh. The updated hotel card briefly flashes/highlights to indicate the change, and the ranking order may shift.
result: [pending]

### 10. Admin Dashboard — Metrics & Flagged Hotels
expected: The Admin page shows platform-wide metrics (total feedbacks, average score, flagged hotel count). A table below lists hotels scoring below 2.0 as "flagged" for proactive management. A live activity feed shows the latest feedback submissions.
result: [pending]

### 11. Settings — Scoring Weights & Validation
expected: The Settings page shows adjustable scoring weights for each feedback category. Saving weights that don't sum to 1.0 shows a validation error. Valid weights save successfully and a confirmation appears.
result: [pending]

### 12. Notification Previews Center
expected: The Notifications page displays high-fidelity previews for Email, WhatsApp, Slack, and Teams notification formats showing how feedback alerts would look in each channel.
result: [pending]

### 13. AI Sentiment Tags in Admin Feed
expected: In the Admin activity feed, feedback submissions display AI-generated tags such as sentiment (Positive/Negative/Neutral) and category labels. Urgent issues (e.g., critical cleanliness) show an "URGENT" flag.
result: [pending]

## Summary

total: 13
passed: 0
issues: 0
pending: 13
skipped: 0

## Gaps

[none yet]
