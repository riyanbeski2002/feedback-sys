# Business Analyst + Program Management Assignment
## Post-Stay Feedback Intelligence System

## 1. Problem Statement
Corporate travel platforms currently lack a structured and reliable mechanism to capture post-stay feedback at scale. This results in limited visibility into actual hotel service quality, inconsistent user experience across bookings, weak data-driven ranking decisions and reduced accountability for hotel partners.

Without a feedback-driven system, the platform cannot continuously improve based on real traveller experience.

## 2. Objective
To design and implement a configurable, scalable post-stay feedback system that captures structured and qualitative feedback from verified stays, converts that feedback into actionable performance signals and immediately influences hotel visibility, ranking and recommendation quality.

## 3. Proposed Solution Overview
The proposed solution is a Feedback Intelligence System made up of four core layers:
1. Feedback Trigger Engine
2. Feedback Collection System
3. Scoring and Processing Engine
4. Ranking and Decision Engine

Together, these create a closed-loop system where real traveller experience influences future booking outcomes.

## 4. System Architecture
### 4.1 Feedback Trigger Engine
Feedback is triggered once a booking is completed.
- Booking status = completed
- Checkout time = T
- Feedback request is sent at T + X hours

X is configurable, typically from 1 to 24 hours.

### Configurable Parameters
The system should be operationally flexible and configurable through an admin control surface.

Key parameters include:
- Trigger delay
- Reminder frequency
- Maximum reminder count
- Reminder cut-off window
- Channel enablement for email, WhatsApp, Slack and Teams
- Form expiry window
- Score weights and threshold values

This ensures the system can adapt to different communication styles, traveller behavior patterns and business policies.

### 4.2 Feedback Collection System
The system supports two collection modes.

#### Option A: Quick Feedback for WhatsApp
A single-question quick response flow where the user replies with a rating from 1 to 10. This is useful for low-friction response collection but is not recommended as the primary feedback path because it lacks enough depth for supplier quality analysis.

#### Option B: Detailed Feedback Form (Recommended)
A linked form accessible through email, WhatsApp, Slack or Teams.

The form captures:
- Value for money
- Service quality
- Room cleanliness
- Amenities provided
- Likelihood of repeat stay
- Willingness to recommend to colleagues
- Optional text comment

Structured ratings ensure consistency while the optional comment allows users to provide nuance and context.

### 4.3 Feedback Data Model
The system stores both structured and unstructured feedback.

Structured data includes the rating values for each key question. Unstructured data includes the optional free-text comment.

Rules:
- Feedback only for verified bookings
- One feedback submission per booking

These controls protect feedback authenticity and reduce manipulation risk.

### 4.4 Scoring and Processing Engine
A weighted scoring model is used to prioritize the most important indicators of hotel quality.

Recommended weighting:
- Cleanliness = 30%
- Service quality = 30%
- Value for money = 20%
- Amenities = 10%
- Recommendation and repeat intent combined = 10%

#### Justification
Cleanliness and service are the strongest baseline indicators of actual hotel performance and directly affect traveller experience. Value for money matters significantly but is somewhat more subjective. Amenities and repeat or recommendation intent provide useful directional signals but should carry lower weight because not all travellers are repeat travellers and not all amenities are equally relevant to every stay.

### Enhanced Analysis Layer
When users leave a text comment, it is sent to an AI analysis layer that extracts sentiment and issue-level signals. This should enrich the feedback model rather than replace the structured score.

This helps identify concerns such as hygiene, service delays or comfort issues that may not be fully captured in numeric ratings.

### 4.5 Ranking and Decision Engine
After each feedback submission, the platform recalculates the hotel’s aggregate score and immediately updates its visibility.

Suggested logic:
- Score above 4.5: boost visibility
- Score from 3.0 to 4.5: maintain neutral visibility
- Score below 3.0: deprioritize
- Score below 2.0: flag for review or blacklist consideration

This ensures that the ranking system remains responsive to real traveller experience.

### 4.6 Admin Control Panel
An admin control panel enables full operational flexibility.

Admins can configure:
- Trigger timing
- Reminder rules
- Channel selection
- Score weights
- Thresholds for visibility and flags

Admins can also monitor hotel performance, review low-performing hotels and take supplier actions where needed.

## 5. Platform Changes
### 5.1 User-Side Changes
- Feedback notifications through enabled channels
- Detailed feedback form interface
- Rating display on hotel listing pages
- Search result indicators based on feedback-derived hotel quality

These changes ensure that traveller feedback becomes visible inside the booking journey.

### 5.2 Admin-Side Changes
- Hotel feedback dashboard
- Flagged hotel views
- Recent feedback stream
- Configurable rules panel

These changes allow internal teams to operate the system effectively and act on poor hotel performance.

## 6. Communication Strategy
### User Communication
Users receive a feedback request after checkout, followed by reminders if configured. The messaging should be short, trustworthy and action-oriented.

### Internal Communication
Internal users should receive dashboard-based alerts and performance reports for low-performing hotels or repeated issue patterns.

## 7. Workflow Summary
1. Traveller completes hotel stay
2. Booking becomes feedback-eligible after configured delay
3. System triggers notification via selected channels
4. Traveller submits detailed feedback or quick score
5. Feedback is stored and processed
6. Hotel score is recalculated
7. Listing and ranking views are updated
8. Admin dashboard reflects the latest state

## 8. Edge Cases and Considerations
- If the traveller does not respond, reminders are sent only within the configured window
- Partial form completion can be accepted only if business rules allow it, though full structured ratings are recommended for consistency
- Duplicate submissions are blocked through one-feedback-per-booking validation
- Delayed responses are allowed only within the active feedback window

## 9. Future Enhancements
### Personalized Hotel Recommendations
The system can evolve beyond general ranking and support user-specific recommendation logic. For example, if a user consistently rates cleanliness more critically, future searches can prioritize hotels with stronger cleanliness performance. Similarly, a cost-sensitive traveller can be shown better value-for-money options first.

### Complaint Clustering
Text feedback can be grouped into repeated issue patterns such as hygiene problems or poor service. This enables faster supplier review and proactive action.

### Incentive-Based Collection
The platform can experiment with low-friction incentives or nudges to increase response rates while preserving data quality.

### Trend Analysis
Hotel performance can be tracked over time to identify improving or deteriorating properties and improve supplier decision-making.

## 10. Metrics for Success
- Feedback response rate
- Detailed form completion rate
- Share of hotels with meaningful feedback coverage
- Reduction in bookings for low-rated hotels
- Improvement in platform-wide hotel quality over time
- Operational action rate on flagged hotels

## 11. Conclusion
This solution is designed not just to collect feedback, but to establish a continuous feedback intelligence loop that directly improves user experience, hotel quality visibility and booking decisions.

By integrating traveller feedback into ranking, recommendations and admin operations, the platform becomes a self-improving system that increases trust, quality and decision accuracy over time.
