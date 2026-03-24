# Phase 1: Foundation - Context

**Gathered:** Tuesday, 24 March 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

The core infrastructure and project scaffold. This includes initializing the Next.js app with Ziptrrip-aligned UI patterns, setting up the Supabase client, and refining the database schema for the Feedback Intelligence System.

</domain>

<decisions>
## Implementation Decisions

### App Scaffold
- **Navigation**: Sidebar Navigation (collapsible, dashboard style).
- **Theme**: System/Theme Toggle (Light/Dark mode support).
- **Structure**: Modular structure (domain-driven, e.g., `features/`).
- **Components**: Full shadcn/ui set including Drawer, Skeleton, Tooltip, and Command (Search).

### DB Schema Refinement
- **Booking Status**: Comprehensive enums ('booked', 'checked_in', 'completed', 'cancelled').
- **Hotel Status Bucket**: Comprehensive enums ('stable', 'flagged', 'needs_review', 'top_rated').
- **Feedback Configuration**: Stored in a separate `feedback_config` table for flexibility.
- **User System**: Full `users` and `profiles` tables for a complete travel management context.

### Seed Data Strategy
- **Volume**: At least 5-10 hotels across multiple cities (Bangalore, Mumbai, Delhi).
- **Status Mix**: A mix of booking statuses ('booked', 'checked_in', 'completed') to demonstrate the simulation flow.

### Infrastructure Setup
- **Supabase**: Remote Supabase project (standard remote connection).
- **DB Client**: Standard Supabase typed client (no ORM like Prisma/Drizzle).

### Claude's Discretion
- **Layout Spacing**: Claude can decide on the exact pixel values to match Ziptrrip density (until screenshots are provided).
- **Default Theme Accent**: Claude can choose the initial brand accent colors.

</decisions>

<specifics>
## Specific Ideas

- **Modular Folder Structure**: The project should follow a pattern like `src/app/`, `src/components/`, `src/features/feedback/`, `src/features/hotels/`, `src/lib/supabase/`, etc.
- **Ziptrrip Brand Alignment**: The UI should feel like a B2B SaaS dashboard (enterprise-friendly, clean tables, professional typography).

</specifics>

<deferred>
## Deferred Ideas

- **Real Messaging API**: Real integrations with SendGrid or Twilio (belongs in Phase 5 or later).
- **Advanced Fraud Detection**: ML models (out of scope for MVP).

</deferred>

---

*Phase: 01-foundation*
*Context gathered: Tuesday, 24 March 2026*
