# Master Build Prompt for Gemini CLI

You are a senior full-stack product engineer, solution architect and UI engineer.

Build a working MVP for a **Post-Stay Feedback Intelligence System** for a corporate travel platform. The target company is Ziptrrip, so the product should feel like a corporate travel management dashboard and align with modern B2B SaaS patterns. The user will later provide screenshots of the existing Ziptrrip dashboard. When those are available, you must match the same visual language as closely as possible, including spacing rhythm, card structure, table density, font style, component radius, icon style and color hierarchy.

## Goal
Create a working end-to-end demo that shows how hotel feedback is triggered after checkout, collected through a form, scored, processed and immediately reflected in hotel listing and ranking views.

## Deliverables
Build a complete MVP with:

1. Booking simulation page
2. Feedback trigger simulation after checkout
3. Multi-channel notification mockups and trigger surfaces
4. Feedback form page
5. Hotel listing page with real-time score update
6. Admin dashboard with hotel performance and flagged hotels
7. Ranking logic that updates hotel ordering based on the latest score
8. Optional qualitative feedback analysis layer
9. Clean GitHub-ready repository structure
10. Vercel-ready deployment setup

## Recommended Tech Stack

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui for form, card, dialog, sheet, badge, table and toast components
- lucide-react icons

### Backend
- Next.js route handlers
- Server actions where useful

### Database
- Supabase Postgres

### Hosting
- Vercel

### Optional AI layer
- A mocked sentiment analysis helper by default
- Keep real LLM integration abstracted behind a single function so it can later be swapped with Gemini, OpenAI, Mistral, Ollama or a Supabase Edge Function

## Core Business Context
This is a corporate travel platform. Hotel feedback is collected only for verified completed stays booked through the platform. The goal is not just feedback collection. The goal is to build a **feedback intelligence loop** that improves future hotel visibility and recommendation quality.

## System Requirements

### 1. Feedback Triggering
- Booking has check-in and check-out dates
- Once checkout is complete, feedback becomes eligible
- MVP can use a manual `Simulate Checkout` button
- Also show where a background scheduler or event trigger would plug in later

### 2. Configurable Trigger and Reminder Logic
The system must support these configurable values in the admin configuration panel, even if some are mocked in MVP:
- Trigger delay in hours after checkout
- Reminder enabled on or off
- Reminder frequency
- Maximum reminder count
- Reminder cut-off window
- Channel enablement for email, WhatsApp, Slack and Teams
- Form expiry window
- Quick feedback enabled on or off
- Weighted scoring configuration
- Thresholds for neutral, deprioritized and flagged hotels

### 3. Feedback Collection Modes
#### Mode A: Quick feedback for WhatsApp only
- Single question: “How was your stay?”
- User replies with a score from 1 to 10
- This is intentionally lightweight but not the recommended primary mode
- It should be visually shown in the designs and represented in code as a possible path

#### Mode B: Detailed feedback form
This is the primary and recommended collection mode.
The form must collect:
- Value for money
- Service quality
- Room cleanliness
- Amenities provided
- Likelihood of repeat stay
- Willingness to recommend to colleagues
- Optional open text comment

Each rating should be 1 to 5 in the main form.

### 4. Scoring Logic
Use a weighted average with this priority:
- Cleanliness = 30%
- Service quality = 30%
- Value for money = 20%
- Amenities = 10%
- Recommendation or repeat intent = 10%

Justification:
- Cleanliness and service are the strongest baseline indicators of actual hotel performance
- Value for money matters significantly but is slightly more subjective
- Amenities matter, but not every traveller uses them equally
- Recommendation and repeat stay are helpful directional signals but should carry lower weight because some trips are one-time travel events

Implementation detail:
- The form collects both repeat stay and recommendation
- For the weighted score, you may either average those two first into one combined intent score or explicitly document the simplified weighting model in code comments

### 5. Qualitative Analysis Layer
If a comment is provided:
- Run it through an abstraction called `analyzeFeedbackComment()`
- Return structured outputs such as:
  - sentiment label
  - sentiment score
  - top issue category
  - urgency flag
- This should enrich the dashboard, not override the structured score
- Default implementation can be mock rules-based logic

### 6. Ranking and Visibility Logic
After every feedback submission:
- Recalculate the hotel’s rolling average score
- Update hotel summary table
- Reorder hotels on hotel listing page by score
- Display badge states such as Top Rated, Stable, Needs Review, Flagged

Suggested thresholds:
- > 4.5 boost visibility
- 3.0 to 4.5 neutral visibility
- < 3.0 deprioritize
- < 2.0 flagged for review or potential blacklist

### 7. Pages Required
#### A. Booking Simulation Page
- List mock bookings
- Show booking status, hotel, traveller, dates and checkout eligibility
- Provide `Simulate Checkout` button
- Provide `Trigger Feedback` button where needed

#### B. Notification Preview / Delivery Page
- Show notification cards or drawers for:
  - Email
  - WhatsApp
  - Slack
  - Teams
- Include copy previews and CTA behavior
- Indicate which channels use direct inline input vs external link

#### C. Feedback Form Page
- Mobile-first layout
- Ratings UI
- Optional comment text area
- Submit button
- Validation and success state

#### D. Hotel Listing Page
- Hotel cards or table rows
- Show average rating
- Feedback count
- Category badges
- Search or sort controls if time permits

#### E. Admin Dashboard
- Summary cards
- Hotel performance table
- Flagged hotels section
- Configuration panel drawer or page
- Feedback insights section showing comment categories or recent feedback

### 8. Notification Design Requirements
Design and build how notifications look.

#### Email
- Subject line
- Preheader
- Compact email body
- CTA button leading to full feedback form
- Designed as linked format only

#### WhatsApp
- Quick feedback version with 1–10 response instruction
- Detailed feedback version with CTA link to form
- Both variants must be visually designed

#### Slack
- Message block style preview
- Hotel name, dates and CTA link to form
- No inline detailed form, linked flow only

#### Teams
- Card-style message preview
- Hotel name, travel dates, CTA link
- Linked flow only

### 9. Data Integrity Rules
- Only verified bookings can submit feedback
- One feedback per booking
- Ratings required for the detailed form
- Store timestamps
- Keep hotel aggregates updated atomically where possible

### 10. Seed Data
Include 6 to 10 sample hotels with varied scores and statuses.
Include 6 to 10 sample bookings linked to those hotels.
Include some seeded feedback so the listing page is not empty on first load.

### 11. UX Requirements
- Professional SaaS interface
- Clean enterprise dashboard style
- Strong hierarchy
- Responsive layout
- Mobile-friendly form
- Desktop-first dashboards
- Avoid over-styling or consumer-app visuals

### 12. Code Quality Expectations
- Clean folder structure
- Reusable components
- Clear types and interfaces
- Minimal but useful comments
- No auth required for MVP
- Mock configuration can be stored in DB or as a simple settings object
- Environment variables clearly documented

### 13. Output Needed From You
Return:
1. Full project tree
2. All code files
3. Setup instructions
4. SQL schema
5. Seed data strategy
6. Environment variables
7. Deployment steps for Vercel + Supabase
8. Notes on where to swap in real notification providers later
9. Notes on where to connect a real AI model later

### 14. Non-Goals
- No production authentication
- No real WhatsApp or Slack message sending required for MVP
- No complex background job infrastructure required
- No perfect enterprise permissions model

### 15. Final Success Condition
A reviewer should be able to:
1. Open the app
2. See sample hotels and bookings
3. Simulate a checkout
4. Open a feedback request flow
5. Submit detailed feedback
6. Watch the hotel score update
7. See hotel ranking change on listing page
8. See admin dashboard reflect the same update

Build this as if it will be shown live in an interview assignment review.
