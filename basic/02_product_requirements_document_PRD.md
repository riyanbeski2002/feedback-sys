# Product Requirements Document (PRD)
## Post-Stay Feedback Intelligence System

## 1. Product Summary
The Post-Stay Feedback Intelligence System is a feature layer for a corporate travel platform that captures verified hotel stay feedback after checkout and uses that data to improve future hotel visibility, ranking and decision quality.

This system is not limited to collecting survey responses. Its purpose is to create a closed feedback loop that continuously improves hotel recommendations and platform trust.

## 2. Problem
A travel platform may know booking volumes and prices, but without post-stay feedback it lacks a reliable view of real hotel quality. This results in weak recommendation logic, poor supplier accountability and repeated exposure of users to low-performing hotels.

## 3. Objective
Create a configurable post-stay feedback system that:
- Collects structured and optional qualitative feedback from verified completed stays
- Processes that feedback into a weighted quality score
- Immediately updates hotel ranking and visibility in future searches
- Gives operations teams tools to monitor and act on low-performing hotels

## 4. Primary Users
### Travellers
Employees who booked hotels through the platform and completed their stay.

### Travel Admin or Operations Team
Internal users who need visibility into hotel quality, thresholds and supplier issues.

### Product and Supplier Management Teams
Stakeholders who use quality insights to improve search logic, vendor decisions and long-term platform performance.

## 5. User Stories
### Traveller Stories
- As a traveller, I want to quickly rate my stay after checkout so the platform understands my experience.
- As a traveller, I want the form to be fast and easy on mobile.
- As a traveller, I want to add comments if I had an important issue not captured in fixed questions.

### Admin Stories
- As an admin, I want hotel scores to update automatically after new feedback so I can trust the latest hotel quality picture.
- As an admin, I want low-performing hotels to be flagged so I can review or blacklist them.
- As an admin, I want reminder and trigger rules to be configurable so the system fits our operational style.

### Platform Stories
- As the platform, I want feedback to influence future listing and ranking behavior so better hotels are surfaced more often.

## 6. Scope
### In Scope
- Triggering feedback after completed hotel stays
- Email, WhatsApp, Slack and Teams notification designs
- Detailed form-based feedback collection
- Optional WhatsApp quick score collection
- Weighted score calculation
- Immediate hotel aggregate updates
- Hotel ranking adjustments
- Admin dashboard and configuration surface
- Optional qualitative feedback analysis layer

### Out of Scope for MVP
- Real production message delivery integrations
- Authentication and permissioning
- Advanced fraud models beyond verified booking checks
- Full-scale analytics warehouse integration

## 7. Core Requirements
### Feedback Triggering
Feedback becomes eligible after checkout completion. Timing is configurable using a trigger delay measured in hours.

### Reminder Control
Admins can define whether reminders are enabled, how often they are sent, the maximum count and the cut-off window after which reminders stop.

### Feedback Collection
The recommended flow is a detailed linked form. WhatsApp quick score can exist as a lower-friction fallback, but should not be the primary collection path because it lacks enough depth.

### Structured Questions
The feedback form must include:
- Value for money
- Service quality
- Room cleanliness
- Amenities provided
- Likelihood of repeat stay
- Willingness to recommend to colleagues
- Optional free-text comment

### Weighted Score
The score should prioritize cleanliness and service because they represent the strongest baseline indicators of hotel quality. Value matters strongly but remains more subjective. Amenities and recommendation or repeat intent are useful but should carry lower weight.

### Real-Time Visibility Update
Once feedback is submitted, the hotel’s aggregate quality score should update and be reflected on listing and search surfaces without waiting for batch processing.

### Flexibility
Almost all operational settings should be configurable so the system can adapt to different policies and communication strategies.

## 8. Success Metrics
- Feedback response rate
- Feedback completion rate for detailed form
- Share of hotels with sufficient feedback volume
- Reduction in bookings for poor-performing hotels
- Improvement in average hotel booking score over time
- Admin action rate on flagged hotels

## 9. Risks and Mitigations
### Low response rates
Mitigation: use timely triggers, lightweight design and reminders.

### Feedback bias or incomplete sentiment context
Mitigation: combine structured scores with optional qualitative analysis.

### Over-penalizing hotels based on low sample size
Mitigation: expose feedback count and optionally use score thresholds only after a minimum number of submissions.

## 10. Future Extensions
- Personalized ranking based on user preference history
- Complaint clustering and issue trend analysis
- Supplier scorecards and procurement workflows
- Incentive experiments to improve feedback submission rates
