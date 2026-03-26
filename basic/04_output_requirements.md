# Output Requirements for Gemini CLI / Build Agent

When generating the codebase, produce the following outputs clearly:

## 1. Repository Structure
A clean tree showing:
- app routes
- components
- lib utilities
- data layer or db helpers
- API routes
- styles
- seed scripts

## 2. Full Code
Return all major files or provide file-by-file content for:
- `app/page.tsx`
- `app/bookings/page.tsx`
- `app/notifications/page.tsx`
- `app/feedback/[bookingId]/page.tsx`
- `app/hotels/page.tsx`
- `app/admin/page.tsx`
- route handlers for hotels, feedback, admin, booking simulation and config
- database client setup
- score calculation utilities
- qualitative analysis helper
- seed script

## 3. Setup Instructions
Provide:
- install commands
- Supabase setup steps
- environment variable instructions
- how to run locally
- how to seed demo data

## 4. Deployment Instructions
Provide:
- Vercel deployment steps
- required env vars
- database migration and seed flow

## 5. Explanation Notes
Document:
- how score updates work
- how ranking updates work
- how notification previews are modeled
- where to plug in real email, WhatsApp, Slack and Teams providers
- where to plug in real AI model calls later

## 6. Demo Readiness
The final system must be demo-ready with:
- realistic seed data
- visible state changes
- a smooth happy path
- clear error states if feedback already exists
