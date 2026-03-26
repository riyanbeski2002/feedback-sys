# Architecture Research

**Domain:** B2B SaaS Feedback Intelligence — Next.js 16 App Router + Supabase
**Researched:** 2026-03-26
**Confidence:** HIGH (codebase read directly; patterns verified against official docs)

---

## System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                     Next.js App Router (v16)                    │
│  Route Group: (dashboard)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ /hotels  │ │/bookings │ │  /admin  │ │ /notifications   │   │
│  │ /feedback│ │/settings │ │          │ │                  │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘   │
│       │            │            │                │              │
│  ┌────┴────────────┴────────────┴────────────────┴──────────┐   │
│  │              Server Components (data fetching)            │   │
│  │         Server Actions (mutations, form submissions)      │   │
│  └────────────────────────────┬──────────────────────────────┘  │
└───────────────────────────────│────────────────────────────────┘
                                │ Supabase SSR Client
┌───────────────────────────────▼────────────────────────────────┐
│                         Supabase                                │
│  ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌───────────┐  │
│  │  hotels    │ │   bookings   │ │  feedback  │ │ feedback  │  │
│  │  table     │ │   table      │ │  table     │ │  _config  │  │
│  └────────────┘ └──────────────┘ └────────────┘ └───────────┘  │
│                                                                  │
│  Realtime subscriptions (hotel grid live updates)               │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Current State |
|-----------|----------------|---------------|
| `src/app/(dashboard)/*/page.tsx` | Route entry, async data fetch on server | EXISTS — needs modification for dynamic notifications |
| `src/features/{domain}/actions/*.ts` | Server Actions — all mutations | EXISTS — update-config needs upsert fix |
| `src/features/{domain}/components/*.tsx` | Feature-scoped UI components | EXISTS — notification previews need dynamic data |
| `src/lib/supabase/server.ts` | SSR Supabase client factory | EXISTS — correct, no changes needed |
| `src/scripts/seed.ts` | Dev data seeding | EXISTS — needs idempotency |
| `src/app/globals.css` | Design token definitions | EXISTS — needs `@theme inline` migration |

---

## Recommended Project Structure (v2 Additions)

The existing feature-domain structure is correct. v2 adds no new top-level folders — it modifies existing files.

```
src/
├── app/
│   ├── globals.css                  # MODIFY: migrate to @theme inline
│   └── (dashboard)/
│       ├── notifications/
│       │   └── page.tsx             # MODIFY: convert to async Server Component
│       └── settings/
│           └── page.tsx             # MODIFY: .maybeSingle() fix
├── features/
│   ├── admin/
│   │   └── actions/
│   │       └── update-config.ts     # MODIFY: upsert instead of .update()
│   └── notifications/
│       ├── components/              # KEEP: preview components stay as-is (pure props)
│       │   ├── email-preview.tsx
│       │   ├── whatsapp-preview.tsx
│       │   ├── slack-preview.tsx
│       │   └── teams-preview.tsx
│       └── lib/                     # NEW: data fetching helper
│           └── get-recent-feedback.ts
└── scripts/
    └── seed.ts                      # MODIFY: idempotent upsert pattern
```

### Structure Rationale

- **notifications/lib/get-recent-feedback.ts** — isolates the DB query for recent feedback from the page component, making it testable and reusable. The page stays clean.
- **No new API routes** — the notifications page uses Server Component data fetching directly. An API route would add an unnecessary network hop for data that only the server needs.
- **Preview components stay pure** — `EmailPreview`, `SlackPreview`, etc. accept props only. They do not fetch data. This keeps them usable as static demo components and dynamic-data components without duplicating markup.

---

## Architectural Patterns

### Pattern 1: Config Singleton — DB-Level Enforcement (Recommended)

**What:** Enforce that `feedback_config` can only ever have one row using a PostgreSQL CHECK constraint on a fixed `id` value, then use `.upsert()` in the application layer.

**When to use:** Any table intended to hold exactly one row (application config, feature flags, platform settings).

**Decision:** DB enforcement is preferred over application-level `.maybeSingle()` alone because the DB constraint is the authoritative truth — it cannot be bypassed by a second seed run, a migration, or a direct SQL insert. The application layer then uses `.maybeSingle()` for safe reads and `.upsert()` for safe writes.

**Migration required:**

```sql
-- Step 1: Remove duplicate rows (keep the first by created_at)
DELETE FROM feedback_config
WHERE id NOT IN (
  SELECT id FROM feedback_config ORDER BY created_at ASC LIMIT 1
);

-- Step 2: Add a surrogate fixed-value column to enforce the singleton
-- The existing UUID primary key prevents this via CHECK directly,
-- so use a dedicated UNIQUE constraint on a boolean sentinel column:
ALTER TABLE feedback_config
  ADD COLUMN singleton BOOLEAN NOT NULL DEFAULT TRUE,
  ADD CONSTRAINT feedback_config_singleton UNIQUE (singleton);
-- singleton = TRUE enforced at DB level; only one TRUE row can exist.
```

**Read pattern (settings page):**

```typescript
// src/app/(dashboard)/settings/page.tsx
const { data: config, error } = await supabase
  .from("feedback_config")
  .select("*")
  .maybeSingle()   // returns null instead of error when no rows exist

if (!config) {
  // Redirect or show "run seed first" message — not a crash
}
```

**Write pattern (update-config action):**

```typescript
// src/features/admin/actions/update-config.ts
const { error } = await supabase
  .from("feedback_config")
  .upsert({ id: existingId, ...fields }, { onConflict: "id" })
```

**Trade-offs:**
- DB constraint = zero application code required to prevent duplicates
- `.maybeSingle()` never throws on empty table; safe for first-run scenarios
- Upsert is idempotent — seed script, admin save, and migration all safely converge

### Pattern 2: Dynamic Notification Previews — Server Component Data Fetch

**What:** The `/notifications` page is currently a `"use client"` component with hardcoded `SAMPLE_DATA`. Convert it to an async Server Component that fetches the most recent submitted feedback from the `feedback` table (joined with `bookings` and `hotels`), then passes that data as props to the existing preview components.

**When to use:** Any page that needs initial data for display-only purposes. There is no interactivity requirement for the data itself — channel switching is local UI state only.

**Decision:** Server Component for data fetch + Client Component wrapper for channel-switch tab state. Do not use a Server Action for reading data — Server Actions are for mutations. Do not create an API route — there is no external consumer.

**Architecture:**

```
/notifications/page.tsx (async Server Component)
    ↓ awaits get-recent-feedback.ts
    ↓ passes FeedbackContext object as props
NotificationsClientShell (Client Component — "use client")
    ↓ owns activeChannel state
    ↓ renders EmailPreview / SlackPreview / etc. with real props
```

**Data fetcher:**

```typescript
// src/features/notifications/lib/get-recent-feedback.ts
export async function getRecentFeedbackContext() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("feedback")
    .select(`
      created_at,
      bookings (
        traveller_name,
        traveller_email,
        checkin_date,
        checkout_date,
        hotels ( name )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ?? null  // caller falls back to placeholder text if null
}
```

**Page:**

```typescript
// src/app/(dashboard)/notifications/page.tsx
export default async function NotificationsPage() {
  const recentFeedback = await getRecentFeedbackContext()
  const context = recentFeedback
    ? mapToNotificationContext(recentFeedback)
    : DEFAULT_CONTEXT

  return <NotificationsClientShell initialContext={context} />
}
```

**Trade-offs:**
- Zero client JS for the data fetch — rendered on the server
- Preview components remain pure (props-only) — no internal fetch logic
- Graceful fallback to placeholder when no feedback exists (new installs)
- Channel tab switching stays fast (local state, no server round-trips)

### Pattern 3: Tailwind v4 Design Token Structure

**What:** The existing `globals.css` uses the correct HSL value pattern for CSS custom properties but uses `@theme {}` (standard) instead of `@theme inline {}`. shadcn/ui's documented v4 pattern requires `@theme inline` so that CSS variables resolve to the raw token value and Tailwind does not double-wrap them in `hsl()`.

**Current state:**
```css
@theme {
  --color-primary: var(--primary);  /* WRONG for v4 */
}
@layer base {
  :root { --primary: 171 53% 64%; }  /* No hsl() wrapper */
}
```

**Required v4 pattern:**
```css
:root {
  --primary: hsl(171 53% 64%);     /* hsl() goes HERE on the token */
}

@theme inline {
  --color-primary: var(--primary); /* @theme inline reads the var directly */
}
```

**Why this matters:** With `@theme {}` (without `inline`), Tailwind v4 treats the value as a raw color and applies its own OKLCH conversion, which breaks when the CSS variable contains space-separated HSL without `hsl()` wrapping. The `@theme inline` directive tells Tailwind to pass the variable through unchanged.

**Migration scope:** `src/app/globals.css` only — no component changes required. All `bg-primary`, `text-primary`, etc. utility classes continue to work because they reference `--color-primary` which maps to `--primary`.

**Confidence:** HIGH — verified against [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4).

### Pattern 4: Idempotent Seed Script

**What:** The current seed uses bare `.insert()` without conflict handling. Running it twice creates duplicate hotels, bookings, and a second `feedback_config` row (causing the `.single()` crash). The fix is `INSERT ... ON CONFLICT DO NOTHING` (via Supabase `.upsert({ ignoreDuplicates: true })`), not `TRUNCATE CASCADE`.

**Decision — upsert over TRUNCATE CASCADE:**

| Approach | Pros | Cons |
|----------|------|------|
| TRUNCATE CASCADE then INSERT | Always clean state | Destroys all FK-dependent rows (feedback, bookings referencing hotels) in dev — wipes real test data |
| INSERT ON CONFLICT DO NOTHING | Preserves existing rows | Won't update stale seed data if schema changes |
| INSERT ON CONFLICT DO UPDATE | Updates stale data | More complex, risky for UUID-keyed tables without stable natural keys |

For this project, **ON CONFLICT DO NOTHING** is correct. Hotels and bookings use UUID primary keys — there is no stable natural key to conflict on. The seed should skip insertion when a matching row exists (by name for hotels, by config singleton constraint).

**Config seed fix:**
```typescript
// Use upsert with the singleton constraint
await supabase
  .from('feedback_config')
  .upsert([{ singleton: true, trigger_delay_hours: 1, ...weights }],
          { onConflict: 'singleton', ignoreDuplicates: false })
```

**Hotels/bookings seed fix:** Add a `slug` or `name` unique constraint on hotels, then upsert by `name`. Alternatively, gate the seed with a row count check — only insert if `hotels` table is empty.

---

## Data Flow

### Settings Page Load (Fixed)

```
Browser → GET /settings
    ↓
SettingsPage (Server Component)
    ↓ await supabase.from("feedback_config").select("*").maybeSingle()
    ↓ null? → render "Run seed first" message
    ↓ config? → render ConfigForm(initialConfig={config})
ConfigForm (Client Component — owns form state)
    ↓ user submits
Server Action: updateConfig()
    ↓ supabase.upsert({ id: config.id, ...fields })
    ↓ revalidatePath("/settings"), revalidatePath("/admin")
Browser → Page re-renders with updated config
```

### Notifications Page Load (Dynamic)

```
Browser → GET /notifications
    ↓
NotificationsPage (Server Component)
    ↓ await getRecentFeedbackContext()
    ↓ null? → use DEFAULT_CONTEXT (placeholder names)
    ↓ data? → map to NotificationContext shape
NotificationsClientShell (Client Component)
    ↓ useState(activeChannel = "email")
    ↓ renders EmailPreview / WhatsAppPreview / etc. with real data
User clicks channel tab → local state change, no server round-trip
```

### Feedback Submission (Unchanged)

```
FeedbackForm → submitFeedback() Server Action
    ↓ INSERT feedback
    ↓ UPDATE hotels (avg_score recalculation)
    ↓ UPDATE bookings (feedback_submitted = true)
    ↓ revalidatePath("/bookings"), revalidatePath("/hotels"), revalidatePath("/admin")
Supabase Realtime → HotelGrid client subscription fires → live re-render
```

---

## Integration Points

### New vs Modified Components

| File | Status | What Changes |
|------|--------|--------------|
| `src/app/globals.css` | MODIFY | `@theme` → `@theme inline`; wrap all HSL values in `hsl()` |
| `src/app/(dashboard)/settings/page.tsx` | MODIFY | `.single()` → `.maybeSingle()` with null guard |
| `src/app/(dashboard)/notifications/page.tsx` | MODIFY | Remove `"use client"`, make async, fetch recent feedback |
| `src/features/admin/actions/update-config.ts` | MODIFY | `.update().eq()` → `.upsert()` |
| `src/features/notifications/lib/get-recent-feedback.ts` | NEW | DB query helper returning most recent feedback context |
| `src/features/notifications/components/notifications-client-shell.tsx` | NEW | Client wrapper for channel-switch state (extracts the `useState` from the old page) |
| `src/scripts/seed.ts` | MODIFY | Insert with conflict handling; `feedback_config` via upsert on singleton constraint |
| `basic/09_database_schema.sql` | MODIFY | Add `singleton` column + unique constraint to `feedback_config` |

### Build Order (Dependency-Aware)

1. **DB schema migration first** — add `singleton` column + constraint to `feedback_config`. Everything else depends on a correct DB state.
2. **Seed script fix** — make seed idempotent before running any app tests. Prevents the multi-row config bug from recurring.
3. **globals.css token migration** — isolated CSS change, no component dependencies. Fix before visual testing.
4. **Settings page fix** — `.maybeSingle()` + settings upsert action. Depends on DB schema (step 1).
5. **Dynamic notifications** — depends on `get-recent-feedback.ts` helper and seeded feedback data (from step 2). Build `get-recent-feedback.ts` first, then extract `NotificationsClientShell`, then convert the page.
6. **Visual design pass** — verify Ziptrrip teal tokens render correctly after step 3.

### External Service Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Next.js Server ↔ Supabase | `@supabase/ssr` createServerClient with cookie store | Async cookie access required (Next.js 15+ breaking change already handled) |
| Next.js Client ↔ Supabase Realtime | `@supabase/supabase-js` createBrowserClient | Hotel grid only; notifications page does not use Realtime |
| Seed script ↔ Supabase | `@supabase/supabase-js` with `SUPABASE_SERVICE_ROLE_KEY` | Service role bypasses RLS — correct for seed context |

---

## Anti-Patterns

### Anti-Pattern 1: Using `.single()` on a Table Without a Guaranteed Row Count

**What people do:** `supabase.from("feedback_config").select("*").single()` — copied from docs examples.

**Why it's wrong:** `.single()` throws a PostgREST error if the result set has 0 rows OR more than 1 row. When the seed has been run twice (the current bug), there are 2 rows — `.single()` throws `"PGRST116"` and crashes the settings page.

**Do this instead:** `.maybeSingle()` returns `null` for 0 rows and throws only on >1 rows. Combine with the DB `singleton` constraint to prevent the >1 case entirely.

### Anti-Pattern 2: Server Action for Data Fetching

**What people do:** Create a Server Action to fetch notification data, call it from a `useEffect` in a Client Component.

**Why it's wrong:** Server Actions are POST handlers — they have extra overhead (CSRF protection, action ID hashing). Using them for reads defeats their purpose and adds unnecessary round-trips. The Next.js docs are explicit: Server Actions are for mutations.

**Do this instead:** Fetch in an async Server Component, pass data as props to the Client Component that owns interactive state.

### Anti-Pattern 3: TRUNCATE CASCADE in a Development Seed

**What people do:** `TRUNCATE hotels, bookings, feedback, feedback_config CASCADE` at the top of the seed to guarantee a clean slate.

**Why it's wrong:** TRUNCATE CASCADE deletes all dependent rows including any feedback submitted during development testing. It makes the seed destructive — running it twice destroys real dev data. It also prevents incremental seeding strategies.

**Do this instead:** Use `INSERT ... ON CONFLICT DO NOTHING` (upsert with `ignoreDuplicates: true`). Guard against the config specifically with the `singleton` constraint. For hotels, add a `UNIQUE (name)` constraint and upsert by name.

### Anti-Pattern 4: Hardcoding HSL Channels in @theme Without `inline`

**What people do:** `@theme { --color-primary: var(--primary); }` where `--primary: 171 53% 64%` (no `hsl()` wrapper).

**Why it's wrong:** Tailwind v4's `@theme` block treats values as raw CSS and applies its own OKLCH conversion. A bare `171 53% 64%` string is not a valid CSS color — Tailwind cannot parse it and the utility class produces no color output, or an incorrect one.

**Do this instead:** Use `@theme inline` and wrap all token definitions in `hsl()`. `@theme inline` passes CSS variables through verbatim without Tailwind's conversion layer.

---

## Scaling Considerations

This is an internal B2B tool for a corporate travel platform. Scale is bounded by the number of corporate travellers and hotel inventory — not internet-scale.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k bookings/month | Current architecture is sufficient. No changes needed beyond v2 fixes. |
| 1k-100k bookings/month | Move hotel score recalculation from inline Server Action to a Supabase Database Function (pg function + trigger) to prevent race conditions in avg_score rolling average. |
| 100k+ bookings/month | Add a materialized view for hotel rankings. Move notification queue to a dedicated job table polled by a Supabase Edge Function cron. |

**First bottleneck:** The `submitFeedback` Server Action performs a read-modify-write on `hotels.avg_score` without a transaction. Under concurrent submissions for the same hotel, the rolling average can be silently wrong. This is acceptable for v2 (low concurrency) but should be addressed with a DB-level trigger before production load.

---

## Sources

- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — `@theme inline` vs `@theme`, HSL wrapping requirement — HIGH confidence
- [Supabase upsert reference](https://supabase.com/docs/reference/javascript/upsert) — `onConflict`, `ignoreDuplicates` behavior — HIGH confidence
- [Next.js Server Actions docs](https://nextjs.org/docs/13/app/building-your-application/data-fetching/server-actions-and-mutations) — mutations only, not data fetching — HIGH confidence
- [PostgreSQL singleton row pattern](https://www.w3tutorials.net/blog/how-to-allow-only-one-row-for-a-table/) — CHECK constraint + unique boolean sentinel approach — MEDIUM confidence (verified against PG docs)
- Direct codebase read: `src/app/globals.css`, `src/scripts/seed.ts`, `src/app/(dashboard)/settings/page.tsx`, `src/app/(dashboard)/notifications/page.tsx`, `src/features/admin/actions/update-config.ts`, `basic/09_database_schema.sql` — HIGH confidence

---

*Architecture research for: Feedback Intelligence System v2 — Ziptrrip Design Fidelity & Full Functionality*
*Researched: 2026-03-26*
