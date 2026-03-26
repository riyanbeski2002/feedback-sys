# Technical Architecture

## 1. Stack
### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js route handlers
- Optional server actions

### Database
- Supabase PostgreSQL

### Hosting
- Vercel

## 2. Suggested App Structure
- `app/bookings`
- `app/notifications`
- `app/feedback/[bookingId]`
- `app/hotels`
- `app/admin`
- `components/feedback`
- `components/dashboard`
- `components/notifications`
- `lib/db`
- `lib/scoring`
- `lib/analysis`
- `lib/config`

## 3. Key Tables
- hotels
- bookings
- feedback
- feedback_config
- notification_log (optional for MVP)

## 4. Score Update Flow
1. Feedback submitted
2. Server validates booking eligibility
3. Weighted score calculated
4. Optional comment analysis performed
5. Feedback row inserted
6. Hotel aggregate recalculated
7. Hotel status bucket recalculated
8. Listing and admin views reflect update on next fetch or live revalidation

## 5. AI Analysis Strategy
Abstract behind a single function:
`analyzeFeedbackComment(comment: string): Promise<CommentAnalysis>`

Initial implementation can be rules-based. Future integrations can call:
- Gemini
- OpenAI
- Mistral
- Ollama
- Supabase Edge Functions

## 6. Hosting Notes
### Vercel
- Ideal for Next.js frontend and route handlers
- Use env vars for Supabase connection

### Supabase
- Free tier good enough for MVP
- Use SQL editor or migrations for schema

### Optional Alternatives
- Railway or Render only if a separate Node server becomes necessary, which should not be required for this MVP
