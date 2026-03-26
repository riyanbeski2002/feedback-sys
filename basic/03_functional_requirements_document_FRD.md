# Functional Requirements Document (FRD)
## Post-Stay Feedback Intelligence System

## 1. Functional Modules
1. Booking status and feedback eligibility
2. Notification trigger and preview
3. Feedback form submission
4. Score calculation
5. Hotel aggregate update
6. Ranking update
7. Admin monitoring and configuration
8. Optional qualitative analysis

## 2. Booking Eligibility Rules
- A booking becomes feedback-eligible when booking status is `completed`
- A booking must have a valid hotel reference
- A booking can accept only one feedback record
- If a booking already has feedback, the trigger flow must disable re-submission

## 3. Trigger Logic
### Inputs
- checkout_timestamp
- trigger_delay_hours
- reminder_enabled
- reminder_frequency_hours
- max_reminders
- reminder_cutoff_hours
- enabled_channels

### Behavior
- Determine if the booking is eligible for feedback based on checkout completion
- If eligible and no feedback exists, allow trigger event
- For MVP, trigger can be manual from the UI
- UI should still show how automatic scheduling would behave using the stored settings

## 4. Notification Behavior
### Email
- Linked format only
- Includes subject, summary, CTA button and expiry note if applicable

### WhatsApp
- Variant A: quick rating from 1 to 10
- Variant B: linked detailed feedback form

### Slack
- Linked message preview only

### Teams
- Linked card preview only

## 5. Feedback Form Requirements
### Required Inputs
- booking_id
- hotel_id
- value_for_money (1 to 5)
- service_quality (1 to 5)
- room_cleanliness (1 to 5)
- amenities_provided (1 to 5)
- repeat_stay_likelihood (1 to 5)
- recommend_to_colleagues (1 to 5)

### Optional Input
- comment

### Validation
- All structured ratings required for detailed form
- Ratings must remain within range
- Comment length can be capped to a reasonable limit such as 1000 characters

## 6. Score Calculation Logic
### Weighted Scoring
- room_cleanliness = 30%
- service_quality = 30%
- value_for_money = 20%
- amenities_provided = 10%
- intent_score = 10%

### intent_score
`intent_score = average(repeat_stay_likelihood, recommend_to_colleagues)`

### Formula
`computed_score = cleanliness*0.30 + service*0.30 + value*0.20 + amenities*0.10 + intent_score*0.10`

## 7. Qualitative Analysis Logic
### Function
`analyzeFeedbackComment(comment: string)`

### Expected Output
- sentiment_label
- sentiment_score
- issue_category
- urgency_flag
- summary_text

### Notes
- MVP can use rules-based logic
- The qualitative layer must enrich the dashboard and not replace the weighted rating model

## 8. Hotel Aggregate Update
After new feedback submission:
- recalculate `avg_score`
- recalculate `total_feedbacks`
- update `last_feedback_at`
- set `status_bucket` using configured thresholds

## 9. Ranking Logic
Hotels should be sorted by `avg_score` descending.
Where relevant, a secondary sort can consider feedback count to avoid unstable ranking for very low-sample hotels.

## 10. Status Buckets
Suggested buckets:
- `top_rated` when avg_score > 4.5
- `stable` when avg_score >= 3.0 and <= 4.5
- `needs_review` when avg_score < 3.0
- `flagged` when avg_score < 2.0

## 11. Admin Dashboard Functionalities
- Show hotel summary cards
- Show hotel performance table
- Show flagged hotel count
- Show recent feedback stream
- Show settings/configuration panel
- Show comment insight cards if comment analysis exists

## 12. Audit and Data Integrity
- Store created timestamps
- Prevent duplicate feedback per booking
- Keep hotel updates transaction-safe where practical
- Ensure seeded and newly created feedback use the same calculation logic
