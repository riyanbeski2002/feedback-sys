# Pitfalls Research

**Domain:** Design fidelity + bug fixes on existing Next.js 15 / Tailwind v4 alpha / shadcn/ui / Supabase app
**Researched:** 2026-03-26
**Confidence:** HIGH (CSS/Tailwind v4 issues from official docs + GitHub issues; Supabase from official docs; seed patterns from PostgreSQL docs; Pencil from developer reports)

---

## Critical Pitfalls

### Pitfall 1: CSS Variables Defined Inside `@layer base` Break Dark Mode with Tailwind v4

**What goes wrong:**
Dark mode tokens stop switching when `:root` and `.dark` are placed inside `@layer base`. The utility layer in Tailwind v4 has higher specificity than `@layer base`, so theme-token overrides inside `.dark` are silently ignored. Components render with light-mode colors even after the `.dark` class is applied to `<html>`.

**Why it happens:**
Tailwind v4 overhauled CSS cascade handling. In v3, `@layer base` was always the right place for `:root` variables. In v4, the `@theme inline` mechanism bridges CSS custom properties to utility classes — but only correctly if `:root` and `.dark` are **outside** any layer. Developers who scaffold with shadcn/ui v3 patterns carry the `@layer base { :root { ... } }` pattern into v4 projects, where it silently breaks.

The current `globals.css` in this project already uses the correct structure (`:root` and `.dark` inside `@layer base`). This IS the problematic pattern. It may appear to work in dev but fail once utilities start overriding the base layer.

**How to avoid:**
Move `:root` and `.dark` blocks **out of** `@layer base`. Wrap every HSL value in `hsl()` directly on the variable declaration. Then use `@theme inline` (not `@theme`) to map to Tailwind utilities. The official shadcn/ui v4 structure is:

```css
/* OUTSIDE any @layer */
:root {
  --background: hsl(180 10% 98%);
  --primary: hsl(171 53% 64%);
}
.dark {
  --background: hsl(180 5% 5%);
  --primary: hsl(171 53% 64%);
}

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
}
```

**Warning signs:**
- Dark mode toggle updates `<html class="dark">` but component backgrounds remain white
- HSL tokens look correct in DevTools but `var(--primary)` resolves to the `:root` value inside dark mode
- `next-themes` reports correct theme string but visual output disagrees

**Phase to address:** Design System Phase (Phase 1 of v2) — before any color tokens are applied to components.

---

### Pitfall 2: Tailwind v4 Alpha (`4.0.0-alpha.25`) Is Pinned to a Pre-Stable Version

**What goes wrong:**
`package.json` pins `tailwindcss` and `@tailwindcss/postcss` to `4.0.0-alpha.25`. This specific alpha has documented bugs: hot-reload crashes on file save (issue #14533), `@apply` directive failures (discussion #16429), and production vs development style discrepancies (issue #16176). New components added in v2 may render differently in `next build` than in `next dev`.

**Why it happens:**
The project was scaffolded during the alpha period. Tailwind v4 stable shipped in early 2025, but the lockfile was not updated.

**How to avoid:**
Upgrade to Tailwind v4 stable (`>=4.0.0`) before beginning any design work. Run `npm install tailwindcss@latest @tailwindcss/postcss@latest`. Verify that all existing pages still render correctly before adding new design tokens. Do this in an isolated commit so regressions are easy to bisect.

**Warning signs:**
- Styles that work in `next dev` disappear in production build
- `@apply` inside component CSS modules throws "unknown utility" errors
- Hot reload triggers full-page refreshes instead of HMR updates for CSS changes

**Phase to address:** Design System Phase — first task, before any styling work begins.

---

### Pitfall 3: Supabase `.single()` Throws PGRST116 When `feedback_config` Row Is Missing

**What goes wrong:**
`settings/page.tsx` calls `.single()` on `feedback_config`. If the seed script has not been run, or if it was run and failed on the config insert (which has no conflict guard), the table is empty. `.single()` throws PGRST116 ("JSON object requested, multiple (or no) rows returned"), which crashes the Settings page with an error boundary.

**Why it happens:**
`.single()` is intentionally strict — it errors on zero rows, not just multiple rows. It was chosen because the config is semantically a singleton. But the guarantee "there will always be one row" is only upheld if the seed script has run cleanly, which is not enforced at the application level.

**How to avoid:**
Two complementary fixes are needed:

1. **Query layer:** Replace `.single()` with `.maybeSingle()` on the read path. The page already handles `!config` correctly; `.maybeSingle()` returns `null` instead of an error when no row exists, allowing the existing null-check to display a helpful empty state rather than a crash.

2. **Seed layer:** Make the config insert idempotent using upsert with a sentinel unique column:
```typescript
await supabase
  .from('feedback_config')
  .upsert([{ id: 1, ...configValues }], { onConflict: 'id' })
  .select()
  .maybeSingle()
```
This requires `feedback_config.id` to have a unique constraint (it does as a primary key). If the row exists, it is updated; if not, it is created.

**Warning signs:**
- Settings page shows "Error Loading Configuration" on a fresh environment
- Console shows `code: 'PGRST116'` from Supabase
- The error only reproduces on new Supabase projects or after a database reset

**Phase to address:** Bug Fixes Phase (Settings Fix) — this is the primary bug described in PROJECT.md.

---

### Pitfall 4: Seed Script Is Not Idempotent — Breaks on Re-Run Due to Foreign Key Order

**What goes wrong:**
Running `npm run seed` twice inserts duplicate hotels and bookings. Running it after a partial failure leaves the database in a mixed state. If a developer truncates tables manually without respecting FK order (`bookings` → `hotels` → `feedback_config`), Postgres raises a foreign key violation and all subsequent seed attempts fail.

**Why it happens:**
The current `seed.ts` uses bare `.insert()` calls with no conflict handling. There is no truncation step, no `ON CONFLICT DO NOTHING`, and no UUID stability. Each run generates new rows with auto-generated IDs, making deduplication impossible without clearing the tables first. When clearing, developers truncate `hotels` before `bookings`, which violates the FK constraint `bookings.hotel_id → hotels.id`.

**How to avoid:**
Implement a clean-then-seed pattern with correct cascade order:

```typescript
// Truncate in FK-safe order: children before parents
await supabase.rpc('truncate_seed_tables') // or raw SQL via service role
// SQL: TRUNCATE bookings, feedback, feedback_config RESTART IDENTITY CASCADE;
// SQL: TRUNCATE hotels RESTART IDENTITY;
```

Or use stable UUIDs and upsert:
```typescript
const HOTEL_IDS = {
  grandRoyal: 'a1b2c3d4-...',  // fixed UUIDs committed to source
  // ...
}
await supabase.from('hotels').upsert(hotelsData, { onConflict: 'id' })
```

Stable UUIDs allow bookings to reference known hotel IDs across seed runs without re-querying after insert.

**Warning signs:**
- `npm run seed` on an already-seeded DB inserts 12 hotels instead of 6
- FK violation errors like "insert or update on table bookings violates foreign key constraint"
- Hotel cards show duplicate names in the UI after two seed runs

**Phase to address:** Seed Data Phase — must be resolved before any UI work, as all other features depend on clean seed data.

---

### Pitfall 5: Notification Previews Become a "Client Component That Needs Server Data" Mismatch

**What goes wrong:**
The notifications page is currently `"use client"` with a hardcoded `SAMPLE_DATA` const. When switching to live data, the natural impulse is to add a `useEffect` + Supabase client call. This pattern causes: (a) flash of empty preview on every page load while the fetch resolves, (b) the Supabase browser client bypasses RLS edge cases differently than the server client, and (c) the data is never cached — every tab switch refetches.

**Why it happens:**
The component needs interactivity (channel switching), which forces `"use client"`. Developers assume "client component = must fetch client-side." In Next.js App Router, the correct pattern is to fetch in a parent Server Component and pass data down as props to the interactive child.

**How to avoid:**
Split the page into two layers:

```typescript
// notifications/page.tsx — Server Component (no "use client")
export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: recentFeedback } = await supabase
    .from('feedback')
    .select('*, bookings(traveller_name, checkin_date, checkout_date, hotels(name))')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return <NotificationTabs previewData={buildPreviewData(recentFeedback)} />
}

// NotificationTabs.tsx — "use client" receives pre-fetched props
```

The join query (`feedback` with `bookings` with `hotels`) returns all required preview fields in a single round-trip, avoiding N+1 queries.

**Warning signs:**
- Preview shows blank/loading state for a moment before populating
- Network tab shows multiple Supabase REST requests on channel tab switch
- Data shown in preview is stale (not the most recent feedback)

**Phase to address:** Dynamic Notifications Phase.

---

### Pitfall 6: Pencil MCP Design Fidelity — Generated Code Misses Spacing Scale and Responsive Breakpoints

**What goes wrong:**
Pencil MCP reads vector coordinates and emits Tailwind classes, but three categories of fidelity loss are common:
1. **Spacing rounding:** A 14px gap in the design becomes `gap-3` (12px) or `gap-4` (16px) — the nearest Tailwind step. At multiple locations this compounds into visible layout drift.
2. **Responsive breakpoints:** A desktop mockup generates `grid-cols-3` without breakpoint variants. On mobile the grid doesn't collapse.
3. **Component over-generation:** Pencil may emit raw `div` + inline styles where a shadcn `Card`, `Badge`, or `Table` already exists and is already themed.

**Why it happens:**
Pencil converts pixel values to the nearest Tailwind scale step. It has no knowledge of what shadcn components are already installed unless explicitly told via the design system context. Developers who generate code for the full page at once receive overwhelming output that's harder to review for these substitutions.

**How to avoid:**
- Generate one section at a time, review before proceeding
- Provide Pencil with the component inventory (`Card`, `Badge`, `Button` variants, `Table`) so it maps to existing components rather than raw HTML
- After generation, do a spacing audit: check that spacings match a consistent scale (4px grid) rather than arbitrary pixel values
- Add responsive variants (`md:grid-cols-2 lg:grid-cols-3`) to any multi-column layout before considering it complete

**Warning signs:**
- Generated component doesn't use any `@/components/ui/*` imports
- Layout looks correct on 1440px but breaks on 768px
- Spacing values include unusual Tailwind classes like `p-[14px]` or `gap-[18px]` (arbitrary values)

**Phase to address:** Design Mockups Phase (before coding begins) — establish component mapping rules in the Pencil session upfront.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep `tailwindcss@4.0.0-alpha.25` | No migration work | Production build bugs, hot-reload crashes | Never — upgrade to stable before v2 work |
| Keep `:root` inside `@layer base` | No refactor needed | Dark mode silently broken in v4 | Never — move outside layer |
| Keep `.single()` for `feedback_config` | Simple code | Crashes on empty DB, blocks onboarding | Never — replace with `.maybeSingle()` + upsert |
| Fetch live data in `"use client"` notification component | Quick to wire up | Flash of empty state, no caching | Only for true real-time subscriptions (use Supabase Realtime instead) |
| Keep seed script non-idempotent | Simpler code | Unusable after first run, blocks team onboarding | Never — fix as part of Seed Data Phase |
| Generate full-page code from Pencil at once | Faster initial output | Hard to review, misses component substitutions | Only for throw-away prototyping |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Tailwind v4 + shadcn/ui | Defining `:root` inside `@layer base` (v3 pattern) | Define `:root` and `.dark` outside all layers; use `@theme inline` not `@theme` |
| Tailwind v4 + shadcn/ui | Using bare `hsl(171 53% 64%)` in `@theme` block | Wrap in `hsl()` on the variable itself; reference bare `var()` in `@theme inline` |
| Supabase + singleton table | Using `.single()` when row may not exist | Use `.maybeSingle()` for reads; use `.upsert({ onConflict: 'id' })` for writes |
| Supabase + seed script | `TRUNCATE hotels` before child tables | Truncate children first: `TRUNCATE bookings, feedback RESTART IDENTITY CASCADE; TRUNCATE hotels RESTART IDENTITY;` |
| Next.js App Router + interactive preview | Fetching in `"use client"` component | Fetch in parent Server Component, pass as props to client child |
| Supabase + hotel score update | Separate read-then-update in `submitFeedback` | This is already correct in the codebase — do not introduce a single-query computed column without a migration |
| next-themes + Tailwind v4 | Theme toggling class applied but CSS variables not switching | Ensure `next-themes` `attribute="class"` matches `.dark` selector in CSS; do not use `data-mode` attribute variant |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| N+1 query in notification preview | Multiple sequential Supabase requests visible in Network tab | Single join query: `feedback → bookings → hotels` in one `.select()` | Any time the preview fetches per-relation separately |
| Missing `RESTART IDENTITY` on seed truncate | Auto-increment IDs grow unboundedly across seed runs; bookings reference wrong hotel IDs if stable IDs assumed | Add `RESTART IDENTITY` to truncate or use stable UUID map | After 2+ seed runs |
| `revalidatePath` missing `/notifications` | Notification preview shows stale booking data after feedback submission | Add `revalidatePath('/notifications')` to `submitFeedback` action | After any feedback submission |
| Supabase Realtime subscription in client-side notification preview | Subscription opened on every channel-tab switch | Subscribe once at page level; pass data via context or props | When tab-switching triggers new subscriptions |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using `supabase.createClient()` (anon key) in seed script | Seed fails silently due to RLS policies blocking inserts | Use `SUPABASE_SERVICE_ROLE_KEY` for seed script — current code already does this correctly, do not change |
| Exposing `SUPABASE_SERVICE_ROLE_KEY` in client-side code | Full database access from browser | Service role key must never appear in `NEXT_PUBLIC_*` env vars — current code is correct |
| Hardcoded feedback link in notification preview pointing to `ziptrrip.com` | Misleading in demo, looks like a real system link | Replace with `process.env.NEXT_PUBLIC_APP_URL` or a clearly mock URL like `demo.ziptrrip.com/f/...` |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Notification preview shows "Riyan Khan / Grand Royal Bangalore" even after real feedback exists | Admin thinks previews are static; doesn't trust the system | Show most recent real feedback in preview by default; clearly label as "Live Preview: based on [booking ID]" |
| Settings page error state shows raw Supabase error message | Unprofessional; confusing to non-technical admin | Show "Configuration not set up yet — run the seed script" as the empty state message |
| Teal `#72D3C4` primary on white background | WCAG AA contrast ratio is ~2.7:1 — fails for body text | Use teal only for UI accents (icons, borders, focus rings); use dark foreground for all text |
| Design mockup-to-code spacing drift | Multiple 2-4px misalignments look "off" even if not pinpointed | Use 4px grid strictly: all spacing values must be multiples of 4 (`p-1`=4px, `p-2`=8px, etc.) |

---

## "Looks Done But Isn't" Checklist

- [ ] **Dark mode:** Toggle the theme and verify every page — the teal tokens must switch correctly, not just `background`/`foreground`
- [ ] **Settings page:** Verify on a brand-new Supabase project (no seed run) — should show empty state, not crash
- [ ] **Seed script:** Run `npm run seed` twice consecutively — hotel count must stay at 6, not become 12
- [ ] **Notification preview:** Submit a new feedback entry, then visit Notifications — preview must show that new booking's data
- [ ] **Responsive layout:** Check every Pencil-generated screen at 375px, 768px, and 1280px viewport widths
- [ ] **Tailwind upgrade:** Run `next build` after upgrading to stable v4 — no `@apply` errors, no style discrepancies vs `next dev`
- [ ] **Foreign key cascade:** Truncate `bookings` first, then `hotels` — no FK violation errors
- [ ] **`revalidatePath` coverage:** After submitting feedback, `/notifications` must show fresh data without manual page reload

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Dark mode broken after CSS refactor | LOW | Move `:root`/`.dark` out of `@layer base`; add `hsl()` wrappers; redeploy |
| Alpha Tailwind prod vs dev style divergence | MEDIUM | Pin to `tailwindcss@latest` (stable); rebuild; audit every page for visual regressions |
| `feedback_config` PGRST116 crash | LOW | Change `.single()` to `.maybeSingle()` in `settings/page.tsx`; add upsert to seed |
| Duplicate seed data in production DB | MEDIUM | Run `TRUNCATE bookings, feedback RESTART IDENTITY CASCADE; TRUNCATE hotels, feedback_config RESTART IDENTITY;` via Supabase SQL editor; re-run seed |
| Notification preview always shows static data | LOW | Refactor page into Server Component shell + client child; single join query |
| Pencil code doesn't use shadcn components | MEDIUM | Audit generated JSX; replace raw div/span patterns with `Card`, `Badge`, `Table` equivalents; recheck spacing scale |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `:root` in `@layer base` breaks dark mode | Phase 1: Design System Setup | Toggle dark mode on every page; check all CSS token values in DevTools under `.dark` |
| Tailwind alpha build bugs | Phase 1: Design System Setup (first task) | Run `next build` and compare screenshots with `next dev` output |
| `feedback_config` `.single()` crash | Phase 2: Bug Fixes | Visit Settings on fresh Supabase project with empty DB |
| Non-idempotent seed script | Phase 2: Bug Fixes / Seed Data | Run `npm run seed` twice; verify hotel count = 6 |
| Notification preview static data | Phase 3: Dynamic Notifications | Submit feedback, reload notifications page, verify preview data changed |
| Pencil spacing and responsive gaps | Phase 1: Design Mockups (review gate) | Checklist review of every generated screen before committing code |
| N+1 notification query | Phase 3: Dynamic Notifications | Inspect Network tab — must show single Supabase request on page load |

---

## Sources

- [shadcn/ui Tailwind v4 docs — CSS variable placement and dark mode](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn/ui Theming docs](https://ui.shadcn.com/docs/theming)
- [Tailwind v4 alpha hot reload crash — GitHub issue #14533](https://github.com/tailwindlabs/tailwindcss/issues/14533)
- [Tailwind v4 production vs dev style bug — GitHub issue #16176](https://github.com/tailwindlabs/tailwindcss/issues/16176)
- [Tailwind v4 @apply broken — Discussion #16429](https://github.com/tailwindlabs/tailwindcss/discussions/16429)
- [Supabase PGRST116 error codes](https://supabase.com/docs/guides/api/rest/postgrest-error-codes)
- [Supabase maybeSingle() JS reference](https://supabase.com/docs/reference/javascript/maybesingle)
- [Supabase upsert with onConflict — JS reference](https://supabase.com/docs/reference/javascript/upsert)
- [Supabase duplicate key in sequence — Troubleshooting](https://supabase.com/docs/guides/troubleshooting/inserting-into-sequenceserial-table-causes-duplicate-key-violates-unique-constraint-error-pi6DnC)
- [PostgreSQL TRUNCATE with CASCADE — official docs](https://www.postgresql.org/docs/current/sql-truncate.html)
- [Pencil.dev design-to-code fidelity — developer review 2026](https://invernessdesignstudio.com/pencil-dev-review-the-complete-guide-to-ai-vibe-coding-for-2026)
- [Next.js revalidatePath reference](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Shadcnblocks Tailwind v4 theming breakdown](https://www.shadcnblocks.com/blog/tailwind4-shadcn-themeing/)

---
*Pitfalls research for: Ziptrrip Feedback Intelligence System v2.0 (design fidelity + bug fixes on existing Next.js/Supabase/shadcn/Tailwind v4 alpha app)*
*Researched: 2026-03-26*
