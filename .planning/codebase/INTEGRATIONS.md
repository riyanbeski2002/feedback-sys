# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Notification & Communication (Configured but not fully integrated):**
- Email - Enabled/disabled via config (`email_enabled` in `feedback_config`)
  - SDK/Client: Not detected in dependencies
  - Configuration stored: Database `feedback_config` table
  - Status: Preview UI only (`src/features/notifications/components/email-preview.tsx`)

- WhatsApp - Enabled/disabled via config (`whatsapp_enabled` in `feedback_config`)
  - SDK/Client: Not detected in dependencies
  - Configuration stored: Database `feedback_config` table
  - Status: Preview UI only (`src/features/notifications/components/whatsapp-preview.tsx`)

- Slack - Enabled/disabled via config (`slack_enabled` in `feedback_config`)
  - SDK/Client: Not detected in dependencies
  - Configuration stored: Database `feedback_config` table
  - Status: Preview UI only (`src/features/notifications/components/slack-preview.tsx`)

- Microsoft Teams - Enabled/disabled via config (`teams_enabled` in `feedback_config`)
  - SDK/Client: Not detected in dependencies
  - Configuration stored: Database `feedback_config` table
  - Status: Preview UI only (`src/features/notifications/components/teams-preview.tsx`)

## Data Storage

**Primary Database:**
- Supabase (PostgreSQL-based)
  - Service: Supabase (https://supabase.co)
  - Client SDK: @supabase/supabase-js 2.45.4
  - Server Client: @supabase/ssr 0.5.1 (for SSR with cookie management)
  - URL: Environment variable `NEXT_PUBLIC_SUPABASE_URL`
  - Public Key: Environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Service Role: Environment variable `SUPABASE_SERVICE_ROLE_KEY` (server-only)

**Client Implementation Patterns:**
- Server Client: `src/lib/supabase/server.ts` - Used in server components and actions
- Browser Client: `src/lib/supabase/client.ts` - Used in "use client" components
- Middleware: `src/lib/supabase/middleware.ts` - Session management in Next.js middleware

**Database Tables (from code references):**
- `hotels` - Hotel data with aggregated scores and status
- `bookings` - Guest bookings with traveller info
- `feedback` - Guest feedback submissions with ratings
- `feedback_config` - System configuration (weights, thresholds, channel settings)

**File Storage:**
- Not detected - No cloud storage SDKs found

**Caching:**
- None detected - No Redis or caching library found

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (built into Supabase)
  - Implementation: Session-based with cookies
  - User retrieval: `supabase.auth.getUser()` in middleware (`src/lib/supabase/middleware.ts`)
  - Session handling: Automatic cookie management via @supabase/ssr

**Session Management:**
- Cookie-based sessions refreshed in middleware
- `src/middleware.ts` - Entry point
- `src/lib/supabase/middleware.ts` - Session update logic

**Protected Routes:**
- Dashboard routes under `src/app/(dashboard)` - Protected by middleware auth check

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- console logging in seed script (`src/scripts/seed.ts`)
- No centralized logging service

## CI/CD & Deployment

**Hosting:**
- Not configured - Can run on Vercel (Next.js native), self-hosted Node.js, or Docker

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or similar

## Environment Configuration

**Required env vars (public):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

**Required env vars (server-only):**
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for seeding/admin operations)

**Secrets location:**
- `.env.local` - Local development (contains secrets, not committed to git)
- Production: Environment variables set in hosting platform (Vercel, Docker, etc.)

## Webhooks & Callbacks

**Incoming:**
- No webhook handlers detected

**Outgoing:**
- No outgoing webhooks detected
- Notification channels (Slack, Teams, Email, WhatsApp) are configured but not wired to send actual notifications
- Preview components suggest UI for future webhook/notification implementation

## API Architecture

**Server Actions:**
- `src/features/feedback/actions/submit-feedback.ts` - Submit feedback
- `src/features/bookings/actions/simulate-checkout.ts` - Simulate booking completion
- `src/features/admin/actions/update-config.ts` - Update system configuration

All server actions use Supabase server client for database operations.

**API Routes:**
- None detected - App uses Next.js server actions instead of traditional API routes

## Data Seeding

**Seeding Script:**
- Location: `src/scripts/seed.ts`
- Execution: `npm run seed`
- Uses: Supabase service role client for direct table inserts
- Data includes: 6 hotels, 14 completed bookings with feedback, 12 open bookings

---

*Integration audit: 2026-03-28*
