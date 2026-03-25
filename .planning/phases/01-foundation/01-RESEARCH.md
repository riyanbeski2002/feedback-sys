# Phase 1: Foundation - Research

**Researched:** Tuesday, 24 March 2026
**Domain:** Next.js 16 Foundation, Supabase SSR, shadcn/ui v4
**Confidence:** HIGH

## Summary

Phase 1 establishes the core infrastructure for the Feedback Intelligence System. In 2026, Next.js 16 and React 19 provide a highly optimized foundation using Turbopack and the React Compiler. We will use a modular directory structure to support a clean separation between features (hotels, feedback, admin) and core infrastructure.

**Primary recommendation:** Use `create-next-app@latest` with Turbopack and `@supabase/ssr` for the most robust and performant 2026 stack.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Navigation**: Sidebar Navigation (collapsible, dashboard style).
- **Theme**: System/Theme Toggle (Light/Dark mode support).
- **Structure**: Modular structure (domain-driven, e.g., `features/`).
- **Components**: Full shadcn/ui set including Drawer, Skeleton, Tooltip, and Command (Search).
- **Booking Status**: Comprehensive enums ('booked', 'checked_in', 'completed', 'cancelled').
- **Hotel Status Bucket**: Comprehensive enums ('stable', 'flagged', 'needs_review', 'top_rated').
- **Feedback Configuration**: Stored in a separate `feedback_config` table.
- **User System**: Full `users` and `profiles` tables.
- **Supabase**: Remote Supabase project.
- **DB Client**: Standard Supabase typed client.

### Claude's Discretion
- **Layout Spacing**: Match Ziptrrip density (enterprise B2B).
- **Default Theme Accent**: Professional blue/slate (typical for travel SaaS).

### Deferred Ideas (OUT OF SCOPE)
- **Real Messaging API**: SendGrid/Twilio integrations.
- **Advanced Fraud Detection**: ML models.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCI-03 (part) | Real-time score updates | Supabase Realtime and PostgreSQL triggers are the standard approach for immediate aggregate updates. |
| TRG-01 (prep) | Simulation foundation | Need robust Booking status enums in schema. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.x | App Framework | Turbopack stability, Async Request APIs, React 19 integration. |
| React | 19.2.x | UI Library | React Compiler removes need for useMemo/useCallback. |
| Tailwind CSS | 4.x | Styling | Improved performance and modern CSS features. |
| @supabase/ssr | Latest | Auth/DB Client | Unified client/server auth handling for App Router. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| shadcn/ui | 2026 ed. | Component Library | Fast UI building with source ownership. |
| Zod | Latest | Validation | End-to-end type safety for server actions. |
| Lucide React | Latest | Icons | Clean, consistent enterprise icon set. |

**Installation:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --turbo
npx shadcn@latest init
npm install @supabase/ssr @supabase/supabase-js zod
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/               # Routes and layouts
├── components/        # UI primitives (shadcn)
├── features/          # Domain logic
│   ├── hotels/        # Components, hooks, actions for hotels
│   ├── feedback/      # Components, hooks, actions for feedback
│   └── admin/         # Admin-specific logic
├── lib/               # Shared utilities
│   ├── supabase/      # Client/server Supabase factory functions
│   └── utils/         # Helper functions (cn, etc.)
└── types/             # Generated DB types and shared schemas
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication | Custom session logic | Supabase Auth | Security, edge handling, SSR integration. |
| Form Validation | Manual state checks | React Hook Form + Zod | Error handling, type safety, accessible inputs. |
| Real-time | WebSocket server | Supabase Realtime | Zero-config sync with Postgres changes. |

## Common Pitfalls

### Pitfall 1: Syncing Cookies in Next.js 16
**What goes wrong:** Auth sessions failing between client and server components.
**How to avoid:** Use `@supabase/ssr` middleware to refresh the session on every request.
**Warning signs:** `null` user on server when client appears logged in.

### Pitfall 2: Async Params and Cookies
**What goes wrong:** Runtime errors in Next.js 16 when accessing `params` or `cookies()` without `await`.
**How to avoid:** Always `await` these APIs in Server Components.

## Code Examples

### Supabase Server Client (2026 Pattern)
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

## Sources

### Primary (HIGH confidence)
- Next.js Official Docs (v16) - Caching and Async APIs
- Supabase SSR Guide - Session management
- shadcn/ui - Tailwind 4 integration

## Metadata

**Research date:** Tuesday, 24 March 2026
**Valid until:** April 2026
