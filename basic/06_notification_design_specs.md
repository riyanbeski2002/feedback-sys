# Notification Design Specs and Copy

## 1. Notification Strategy Overview
Feedback notifications should be short, trustworthy and action-oriented. The system supports four delivery surfaces for design purposes: email, WhatsApp, Slack and Teams.

The recommended collection path is the linked detailed feedback form. WhatsApp quick score exists as a lightweight fallback.

## 2. Email Notification
### Subject Options
- How was your stay at {{hotel_name}}?
- Share feedback on your recent stay at {{hotel_name}}
- Rate your hotel stay and help improve future recommendations

### Preheader
Your feedback helps improve hotel quality and future booking recommendations.

### Email Body Example
Hi {{traveller_name}},

We hope your stay at **{{hotel_name}}** from **{{checkin_date}} to {{checkout_date}}** went well.

Please take a minute to rate your experience. Your feedback helps us improve future hotel recommendations and maintain quality standards across the platform.

[Rate Your Stay]

This feedback link will remain active until {{expiry_time}}.

### UX Notes
- Linked flow only
- CTA button should be prominent
- Keep the email under 120 words for scannability

## 3. WhatsApp Quick Feedback
### Message Copy
Hi {{traveller_name}}, how was your stay at {{hotel_name}}?
Reply with a number from **1 to 10**, where 10 is excellent.

### UX Notes
- Minimal friction
- Useful when response rate matters more than detail
- Not recommended as the primary feedback path

## 4. WhatsApp Detailed Feedback
### Message Copy
Hi {{traveller_name}}, we hope your stay at {{hotel_name}} went well.
Please take a minute to rate your experience here: {{feedback_link}}

Your feedback helps improve future hotel recommendations.

### UX Notes
- Linked flow only
- Use this as the preferred WhatsApp path when richer insight is needed

## 5. Slack Message Preview
### Copy Example
**Hotel stay feedback requested**
Stay: {{hotel_name}}
Dates: {{checkin_date}} – {{checkout_date}}
Please share your feedback here: {{feedback_link}}

### UX Notes
- Compact block-style message
- Link opens detailed form

## 6. Teams Message Preview
### Copy Example
**Rate your recent hotel stay**
Hotel: {{hotel_name}}
Dates: {{checkin_date}} – {{checkout_date}}
Action: [Open feedback form]

### UX Notes
- Card style message
- Linked flow only

## 7. Reminder Copy
### Email / Chat Reminder
Reminder: please rate your recent stay at {{hotel_name}}. Your feedback helps improve future travel recommendations.

## 8. Configuration Fields Relevant to Notifications
- trigger_delay_hours
- reminder_enabled
- reminder_frequency_hours
- max_reminders
- reminder_cutoff_hours
- enabled_channels
- form_expiry_hours
