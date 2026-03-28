# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Layered MVC with Next.js App Router and Server Components

**Key Characteristics:**
- Server-first data fetching using Next.js 15 App Router
- Feature-based folder structure with co-located components, actions, and utilities
- Supabase as primary database and auth layer
- Separation of client and server Supabase clients for secure operations
- Middleware layer for session management and authentication
- Client components for interactivity; Server components for data fetching

## Layers

**Presentation Layer (UI):**
- Purpose: Render user interfaces with React components
- Location: `src/components/` (shared UI), `src/features/*/components/` (feature-specific)
- Contains: UI primitives from shadcn/ui, layout components, form components
- Depends on: React, Tailwind CSS, lucide-react icons, react-hook-form
- Used by: Page routes in `src/app/`

**Feature Layer (Business Logic):**
- Purpose: Encapsulate domain logic for each feature (feedback, bookings, hotels, notifications, admin)
- Location: `src/features/{featureName}/`
- Contains: Feature-specific components, server actions, and utility functions
- Depends on: Supabase client, presentation layer components, shared utilities
- Used by: Page routes that compose features together

**Actions Layer (Server Operations):**
- Purpose: Perform server-side mutations and data operations
- Location: `src/features/*/actions/`
- Contains: "use server" functions for database writes, calculations, and side effects
- Depends on: Supabase server client
- Examples: `src/features/feedback/actions/submit-feedback.ts`, `src/features/admin/actions/update-config.ts`

**Utilities & Analysis Layer (Domain Logic):**
- Purpose: Pure functions for scoring, sentiment analysis, and business calculations
- Location: `src/features/*/lib/`
- Contains: Calculation engines, analysis algorithms
- Examples: `src/features/feedback/lib/scoring.ts` (weighted score calculation), `src/features/feedback/lib/analysis.ts` (sentiment and issue classification)
- Used by: Server actions and page routes

**Data Access Layer (Supabase):**
- Purpose: Abstract Supabase client initialization
- Location: `src/lib/supabase/`
- Contains: `client.ts` (browser client), `server.ts` (server client), `middleware.ts` (session refresh)
- Dependencies: @supabase/supabase-js, @supabase/ssr
- Used by: All features and page routes

**Infrastructure Layer (Layout & Routing):**
- Purpose: Define page structure, navigation, and request handling
- Location: `src/app/` (Next.js App Router)
- Contains: Layout components (`layout.tsx`), page routes (`page.tsx`)
- Depends on: Feature layer components, Supabase clients

## Data Flow

**Feedback Submission Flow:**

1. User navigates to `/feedback/[bookingId]` → Server component fetches booking + hotel details from Supabase
2. `FeedbackForm` client component renders with star ratings and comment field (uses `react-hook-form` + Zod validation)
3. User submits → `submitFeedback` server action triggered
4. Action calculates weighted score: `calculateWeightedScore()` (30% cleanliness, 30% service, 20% value, 10% amenities, 10% recommendation)
5. Action analyzes comment: `analyzeFeedback()` generates sentiment_label, sentiment_score, issue_category, urgency_flag
6. Action inserts feedback into `feedback` table with all computed fields
7. Action updates hotel stats: recalculates avg_score, total_feedbacks, determines status_bucket (top_rated/stable/needs_review/flagged)
8. Action updates booking: sets feedback_submitted = true
9. Action revalidates paths: `/bookings`, `/hotels`, `/admin`
10. Router redirects to `/feedback/success`

**Admin Dashboard Flow:**

1. User navigates to `/admin` → Server component fetches from Supabase
2. Aggregates metrics: totalFeedbacks, platformAvg, flaggedCount, totalHotels
3. Fetches flagged hotels (avg_score < 2.0)
4. Fetches recent 10 feedbacks with related hotel data
5. Components display: MetricCards, FlaggedHotelsTable, RecentFeedbackFeed

**Hotel Discovery Flow:**

1. User navigates to `/hotels` → Client component with useState
2. Component subscribes to Supabase realtime updates for hotels table
3. Filters hotels by status_bucket: top_rated, stable, needs_review, flagged
4. Realtime subscription updates UI when hotel scores change
5. HotelGrid displays filtered hotels with score badges

**State Management:**
- Server state: Managed via Next.js App Router page.tsx with direct Supabase queries
- Client state: Local React useState for filters, loading states, realtime subscriptions
- Auth state: Managed by Supabase middleware and session cookies
- Form state: Managed by react-hook-form with Zod schema validation

## Key Abstractions

**Weighted Scoring Engine:**
- Purpose: Calculate composite hotel quality score from five dimension ratings
- Location: `src/features/feedback/lib/scoring.ts`
- Pattern: Pure function with hardcoded weights matching PRD specifications
- Exports: `calculateWeightedScore()` (primary), `calculateWeightedRanking()` (Bayesian average variant)

**Feedback Analysis Engine:**
- Purpose: Extract sentiment, issue category, and urgency from text comments
- Location: `src/features/feedback/lib/analysis.ts`
- Pattern: Keyword matching + score-based heuristics
- Outputs: sentiment_label, sentiment_score, issue_category (Cleanliness/Service/Value/Amenities/Intent/Other), urgency_flag (for critical negative feedback)

**Supabase Client Factory:**
- Purpose: Initialize correct Supabase client for context (browser vs server)
- Location: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Pattern: Separate factories to enforce client/server separation
- Safety: Server client uses cookie-based auth; browser client uses public anon key

**Form Schema with Zod:**
- Purpose: Define feedback form structure with validation
- Location: `src/features/feedback/components/feedback-form.tsx`
- Pattern: `feedbackSchema` object with type inference for FeedbackFormValues

## Entry Points

**Root Page:**
- Location: `src/app/page.tsx`
- Triggers: Direct navigation to "/"
- Responsibilities: Redirects to `/admin` (default entry point)

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: Every request (except static assets)
- Responsibilities: Refreshes Supabase session via `updateSession()` from `src/lib/supabase/middleware.ts`

**Dashboard Layout:**
- Location: `src/app/(dashboard)/layout.tsx`
- Triggers: All routes under `/(dashboard)/*`
- Responsibilities: Renders AppSidebar, SiteHeader, and inset layout for all dashboard pages

**Admin Dashboard:**
- Location: `src/app/(dashboard)/admin/page.tsx`
- Triggers: GET `/admin`
- Responsibilities: Fetches aggregated metrics and recent data; renders MetricCards, FlaggedHotelsTable, RecentFeedbackFeed

**Feedback Form Page:**
- Location: `src/app/(dashboard)/feedback/[bookingId]/page.tsx`
- Triggers: GET `/feedback/{bookingId}`
- Responsibilities: Validates booking exists and is completed; checks for duplicate submissions; renders FeedbackForm

**Bookings Page:**
- Location: `src/app/(dashboard)/bookings/page.tsx`
- Triggers: GET `/bookings`
- Responsibilities: Fetches bookings with hotel data; renders BookingTable

**Hotels Page:**
- Location: `src/app/(dashboard)/hotels/page.tsx`
- Triggers: GET `/hotels`
- Responsibilities: Fetches all hotels; manages client-side filter state; subscribes to realtime updates; renders HotelGrid

## Error Handling

**Strategy:** Combination of error boundaries, validation, and user feedback via toast notifications

**Patterns:**
- Zod schema validation in forms (`react-hook-form` with `@hookform/resolvers/zod`)
- Server action returns `{ success: boolean, error?: string }` objects
- Client components catch action errors and display via `sonner` toast notifications
- `notFound()` for missing resources (e.g., invalid booking ID)
- `redirect()` for unauthorized or invalid states (e.g., feedback already submitted)
- Supabase error responses checked and returned to caller

## Cross-Cutting Concerns

**Logging:** Console.log used in components (e.g., hotel updates in `src/app/(dashboard)/hotels/page.tsx`). No centralized logging framework detected.

**Validation:**
- Client-side: Zod schemas with react-hook-form
- Server-side: Zod schemas in server actions, Supabase RLS (Row Level Security) not visible in code

**Authentication:**
- Handled by Supabase session cookies
- Middleware refreshes session on every request
- Client factory uses NEXT_PUBLIC_SUPABASE_ANON_KEY for browser; server uses cookie-based auth

**Caching & Revalidation:**
- Next.js `revalidatePath()` used after mutations to refresh ISR cache
- Supabase realtime channels for client-side subscription updates

---

*Architecture analysis: 2026-03-28*
