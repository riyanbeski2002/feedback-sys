# Figma MCP Design Prompt

Design a complete UI flow for a **Post-Stay Feedback Intelligence System** inside a corporate travel platform similar to Ziptrrip.

## Design Goal
Create a modern B2B SaaS interface that fits naturally into a corporate travel dashboard. The final design must be coherent, clean, high-trust and enterprise-friendly.

## Brand Alignment Rules
The user will attach screenshots of the existing Ziptrrip dashboard. Once those are available, you must:
- match font family or nearest close equivalent
- mirror primary color usage and neutral palette balance
- match card radius and input styling
- match spacing density and table style
- align icon usage and navigation treatment
- preserve the same visual hierarchy across dashboards, lists and forms

Until screenshots are attached, use a neutral enterprise SaaS style with restrained accents.

## Screens to Design

### 1. Booking Simulation Page
Purpose: simulate completed hotel stays and trigger feedback.

Must include:
- page title
- filters or tabs for booking status
- bookings table or cards
- columns for traveller, hotel, location, check-in, checkout, status
- `Simulate Checkout` button
- `Trigger Feedback` button
- visual state for feedback already submitted

### 2. Notification Center / Preview Page
Purpose: show how feedback requests look across channels.

Must include separate preview cards for:
- Email notification
- WhatsApp quick feedback
- WhatsApp detailed feedback with CTA link
- Slack message preview
- Teams message card preview

Each preview should show:
- hotel name
- stay dates
- short copy
- CTA label or reply instructions
- small label indicating channel type and interaction mode

### 3. Feedback Form Page
Purpose: collect detailed feedback.

Must include:
- hotel header card with hotel name, city, stay dates
- 6 rating questions
- rating UI that is clean and obvious
- optional comment text area
- helper text explaining how feedback is used
- submit button
- success state screen
- validation state examples

### 4. Hotel Listing Page
Purpose: show hotels with updated scores.

Must include:
- search bar or filter row
- cards or rows for hotels
- hotel name and location
- average rating
- total feedback count
- status badge such as Top Rated, Stable, Needs Review or Flagged
- sorted list behavior or indicator
- optional hotel detail drawer or side panel

### 5. Admin Dashboard
Purpose: monitor feedback performance and manage configuration.

Must include:
- summary metric cards
- flagged hotels widget
- hotel performance table
- recent feedback stream
- qualitative insight section if comment analysis exists
- configuration drawer or dedicated section with settings for:
  - trigger delay
  - reminder enabled
  - reminder frequency
  - max reminders
  - cut-off window
  - enabled channels
  - score weights
  - threshold buckets

### 6. Config Modal or Panel
Design a panel for feedback system configuration.
It should feel operational, not consumer-facing.

## Notification Design Specs

### Email Notification
Include:
- subject line preview
- preheader text
- short email body
- CTA button text: `Rate Your Stay`
- note about expiry or feedback window if relevant

### WhatsApp Quick Feedback
Include:
- message bubble style
- question: `How was your stay? Reply with a number from 1 to 10.`
- simple business tone

### WhatsApp Detailed Feedback
Include:
- message bubble
- short summary
- CTA-style linked text or button pattern

### Slack Preview
Include:
- message block style
- hotel and stay info
- compact action button or link

### Teams Preview
Include:
- card container
- compact metadata
- CTA button

## Design System Notes
- desktop-first for dashboard pages
- mobile-first for feedback form
- use a consistent 8-point or 4-point spacing grid
- enterprise-safe contrast levels
- no flashy gradients unless the reference brand strongly uses them
- keep text compact and high signal
- use charts sparingly; prioritize clarity over decoration

## Output Needed
Return:
- all frame names clearly labeled
- component inventory
- page-level flows
- mobile and desktop variants where relevant
- prototype links between key steps if possible
