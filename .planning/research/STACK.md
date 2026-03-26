# Stack Research

**Domain:** B2B SaaS feedback dashboard — v2 milestone (design fidelity + full functionality)
**Researched:** 2026-03-26
**Confidence:** HIGH

## Summary Verdict

No new npm packages are required for v2. Every v2 feature is solvable with the libraries already installed. The work is configuration, query fixes, and code patterns — not dependency additions.

---

## Recommended Stack (v2 Additions)

### No New Core Dependencies

All five v2 feature areas are covered by the existing stack:

| Feature Area | Solved By | Approach |
|---|---|---|
| Pencil MCP design workflow | Pencil MCP (editor tool, not npm) | Process-only. Use `get_editor_state`, `batch_design`, `get_screenshot` tools |
| feedback_config singleton fix | `@supabase/supabase-js` ^2.45.4 (already installed) | Switch seed from `.insert()` to `.upsert({ onConflict: 'id', ignoreDuplicates: true })` + add DB-level `CHECK` constraint or row-level lock |
| Dynamic notification previews | `@supabase/ssr` ^0.5.1 (already installed) | Convert notifications page from `"use client"` + hardcoded `SAMPLE_DATA` to a Server Component that queries recent `bookings` + `hotels` via Supabase server client |
| Ziptrrip teal design system | Tailwind CSS v4 + shadcn/ui (already installed) | CSS variable update in `globals.css` using `@theme inline` — no extra tooling needed |
| Seed idempotency | `@supabase/supabase-js` ^2.45.4 (already installed) | Replace `.insert()` with `.upsert()` across all seed tables using natural unique columns |

---

## Supporting Libraries — Already Installed, Zero Additions

| Library | Current Version | Role in v2 |
|---|---|---|
| `tailwindcss` | 4.0.0-alpha.25 | CSS variable theming via `@theme inline` |
| `@supabase/ssr` | ^0.5.1 | Server Component data fetching for dynamic notification previews |
| `@supabase/supabase-js` | ^2.45.4 | `.upsert()` with `onConflict` for idempotent seeding |
| `react-hook-form` + `zod` | ^7.53 + ^3.23 | Settings form already wired; fix is a query change, not a form change |
| `next-themes` | ^0.3.0 | Already handles dark mode CSS variable switching |

---

## Development Tools — No Changes

| Tool | Purpose | Notes |
|---|---|---|
| Pencil MCP | Design-to-code mockup workflow | Already active in this project (`pencil-new.pen` exists). Use MCP tools directly — no install |
| `ts-node` | Run seed script via `npm run seed` | Already in devDependencies — keep as-is |
| Context7 MCP | Verify API signatures before coding | Use before touching `.upsert()`, Server Component patterns, or `@theme inline` |

---

## Installation

No installation required. All packages are present.

```bash
# No new packages for v2.
# Verify current versions resolve correctly:
npm install
```

---

## Tailwind v4 Theming — The Right Pattern

The project is on `tailwindcss@4.0.0-alpha.25`. The stable v4 release is `4.x` (released January 2025). The alpha is functional but an upgrade to stable `^4.0` would bring the final `@theme inline` syntax and OKLCH support.

**Current approach in `globals.css` is correct but incomplete.** The file already defines CSS variables under `:root` and maps them with `@theme { --color-primary: var(--primary) }`. This works but the `@theme` block (without `inline`) creates static utility classes that don't pick up runtime CSS variable changes reliably across dark mode.

**Recommended fix (no new packages):**

```css
/* In globals.css — change @theme to @theme inline */
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... rest of tokens */
}
```

The `inline` keyword tells Tailwind v4 to emit the CSS variable references directly into utility classes rather than resolving to static values at build time. This is the canonical shadcn/ui v4 pattern per official docs.

**For the Ziptrrip teal (#72D3C4):** The HSL value `hsl(171, 53%, 64%)` is already correctly set as `--primary: 171 53% 64%` in `:root`. No color change needed — only the `@theme inline` fix ensures it propagates reliably.

---

## feedback_config Singleton — Two-Layer Fix

The bug: `.single()` on the settings page crashes if the table has 0 rows (no seed run) or 2+ rows (seed run twice). The seed uses `.insert()`, so reruns add duplicates.

**Layer 1 — DB constraint (run once in Supabase SQL editor):**

```sql
-- Enforce singleton at the DB level
CREATE UNIQUE INDEX IF NOT EXISTS feedback_config_singleton
  ON feedback_config ((true));
```

This creates a unique index on a constant expression, allowing only one row in the table.

**Layer 2 — Seed script change (no new library):**

```typescript
// Replace .insert() with .upsert() in seed.ts
await supabase
  .from('feedback_config')
  .upsert(
    [{ /* config object */ }],
    { onConflict: 'id', ignoreDuplicates: true }
  )
```

For the DB constraint approach (singleton index), use `ignoreDuplicates: true` without specifying a column — the index handles conflict detection.

**Confidence:** HIGH — `.upsert()` with `ignoreDuplicates: true` is documented in `@supabase/supabase-js` v2 official docs.

---

## Seed Idempotency — upsert Pattern per Table

| Table | Natural Unique Key | upsert Strategy |
|---|---|---|
| `feedback_config` | None (singleton) | `ignoreDuplicates: true` after singleton DB constraint |
| `hotels` | `name` (de facto) | Add `UNIQUE` constraint on `name`, then `onConflict: 'name'` |
| `bookings` | `traveller_email + hotel_id + checkout_date` | `onConflict: 'traveller_email,hotel_id,checkout_date'` (requires composite unique index) |

**Alternative (simpler for dev seed):** Truncate-and-reseed. Check row count first; skip seeding if rows exist.

```typescript
const { count } = await supabase
  .from('hotels')
  .select('*', { count: 'exact', head: true })

if (count && count > 0) {
  console.log('Hotels already seeded, skipping.')
  return
}
```

This is simpler than upsert for dev seeds and avoids needing unique constraints on every table.

---

## Dynamic Notification Previews — Server Component Pattern

The current `NotificationsPage` is `"use client"` with hardcoded `SAMPLE_DATA`. The fix is a Server Component query — no new library.

```typescript
// Convert page.tsx to async Server Component
export default async function NotificationsPage() {
  const supabase = await createClient() // @supabase/ssr server client

  const { data: recentBooking } = await supabase
    .from('bookings')
    .select('*, hotels(name)')
    .eq('status', 'completed')
    .eq('feedback_eligible', true)
    .order('checkout_date', { ascending: false })
    .limit(1)
    .single()

  // Pass as props to Client Component for channel switching
}
```

The channel-switcher `useState` still requires a Client Component boundary — extract just the tab UI as a child Client Component, keep the data fetch at the Server Component level.

**Confidence:** HIGH — Standard Next.js App Router data fetching pattern, fully compatible with existing `@supabase/ssr` setup.

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|---|---|---|
| CSS variable edit in globals.css | Install `shadcn-theme` or `tw-colors` library | Overkill. CSS variables are already defined; only need `inline` keyword change |
| `tweakcn.com` for visual theme export | Manual HSL calculation | tweakcn is a useful generator tool for initial color exploration but the project already has correct HSL values — no need |
| Truncate-and-reseed guard | Full upsert on every table | Simpler for dev seeds. Only use full upsert if production seed mutations are needed |
| Server Component for notifications | SWR/React Query for client fetch | App Router Server Components are the idiomatic pattern; no client-side fetch needed for preview data |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|---|---|---|
| `shadcn-theme` / `tw-colors` / `next-themes-color` | The existing CSS variable system in globals.css already implements brand tokens correctly | Edit `@theme` to `@theme inline` in globals.css |
| New seed tooling (Faker.js, drizzle-seed) | Overkill for 6 hotels and 4 travellers | Plain TypeScript with conditional guard |
| React Query or SWR for notifications | Adds client bundle weight; Server Components already fetch from Supabase | `createClient()` from `@supabase/ssr` in Server Component |
| `dotenv` as a production dependency | Currently used in seed.ts as `require('dotenv')` — it's missing from devDependencies | Add `dotenv` to devDependencies only, or replace with `next/env` loading |

---

## Tailwind Version Note

**Current:** `tailwindcss@4.0.0-alpha.25` (alpha, pre-stable)
**Stable:** `tailwindcss@4.x` (released January 2025, latest patch as of March 2026 is 4.x.x)

The `@theme inline` syntax is available in the alpha but the stable release is production-hardened. Upgrading is low-risk (CSS-only change, same syntax) and eliminates alpha-stage edge cases. However, since v1 shipped on the alpha and it is working, treat upgrade as optional for v2 to avoid introducing risk.

---

## Version Compatibility

| Package | Compatible With | Notes |
|---|---|---|
| `tailwindcss@4.0.0-alpha.25` | `@tailwindcss/postcss@4.0.0-alpha.25` | Versions must match — already correct in package.json |
| `@supabase/ssr@^0.5.1` | `@supabase/supabase-js@^2.45.4` | Compatible — ssr package wraps supabase-js v2 |
| `next@^15.0.0` | `react@^19.0.0` | Next.js 15 requires React 19 — already correct |
| `framer-motion@^12.38.0` | `react@^19.0.0` | Framer Motion 12 supports React 19 |

---

## Sources

- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — `@theme inline` syntax, CSS variable pattern — HIGH confidence
- [shadcn/ui Theming docs](https://ui.shadcn.com/docs/theming) — CSS variable token naming — HIGH confidence
- [Supabase upsert JS docs](https://supabase.com/docs/reference/javascript/upsert) — `onConflict`, `ignoreDuplicates` options — HIGH confidence
- [Supabase seeding guide](https://supabase.com/docs/guides/local-development/seeding-your-database) — seed file patterns — HIGH confidence
- [tweakcn.com](https://tweakcn.com/) — visual theme generator (useful for exploration, not required) — MEDIUM confidence
- [Tailwind CSS v4.0 release announcement](https://tailwindcss.com/blog/tailwindcss-v4) — stable release confirmation — HIGH confidence

---

*Stack research for: Feedback Intelligence System v2 — Design Fidelity & Full Functionality*
*Researched: 2026-03-26*
