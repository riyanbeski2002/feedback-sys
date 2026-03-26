# Post-Stay Feedback Intelligence System

A working MVP for a corporate travel platform feature that collects verified post-stay hotel feedback, computes quality scores and updates hotel ranking and visibility in real time.

## What this demo shows
- Booking checkout simulation
- Feedback trigger flow
- Notification previews across channels
- Detailed feedback collection
- Weighted hotel score calculation
- Hotel ranking updates
- Admin monitoring dashboard

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Vercel

## Local Setup
1. Install dependencies
2. Create `.env.local`
3. Add Supabase variables
4. Run schema SQL in Supabase
5. Seed mock data
6. Start development server

## Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Demo Flow
1. Open bookings page
2. Simulate checkout
3. Trigger feedback
4. Submit detailed feedback
5. See hotel listing and admin dashboard update

## Future Extensions
- Real notifications
- Real AI comment analysis
- Personalized ranking based on traveller preference history
